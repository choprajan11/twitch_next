import TelegramBot from "node-telegram-bot-api";
import { spawn } from "child_process";
import { readFile, writeFile, unlink, mkdir } from "fs/promises";
import { join } from "path";
import { createWriteStream } from "fs";
import { pipeline } from "stream/promises";
import { Readable } from "stream";
import dotenv from "dotenv";

dotenv.config();

const BOT_DIR = process.cwd();
const FAVORITES_PATH = join(BOT_DIR, "favorites.json");
const VOICE_DIR = join(BOT_DIR, "voice_tmp");

const token = process.env.TELEGRAM_BOT_TOKEN;
const allowedIdsRaw = process.env.CURSOR_ALLOWED_USER_IDS || "";
const allowedUserIds = new Set(
  allowedIdsRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
);
const workspace = process.env.CURSOR_DEFAULT_WORKSPACE || "/root/twitch_next";
const CURSOR_AGENT = `${process.env.HOME || "/root"}/.local/bin/cursor-agent`;
const CURSOR_BIN = "/usr/bin/cursor";
const TELEGRAM_MAX_MESSAGE = 4096;
const AGENT_TIMEOUT_MS = 0;
const STREAM_UPDATE_INTERVAL_MS = 3000;

const pendingModelByChat = {};
const agentModeByChat = {};
const runningAgentByChat = {};

// ─── Favorites persistence ───

async function loadFavorites() {
  try {
    const raw = await readFile(FAVORITES_PATH, "utf8");
    return new Map(Object.entries(JSON.parse(raw)));
  } catch {
    return new Map();
  }
}

async function saveFavorites(map) {
  const obj = Object.fromEntries(map);
  await writeFile(FAVORITES_PATH, JSON.stringify(obj, null, 2), "utf8");
}

async function getFavorites(userId) {
  const map = await loadFavorites();
  return map.get(String(userId)) || [];
}

async function addFavorite(userId, modelId) {
  const map = await loadFavorites();
  const list = map.get(String(userId)) || [];
  if (list.includes(modelId)) return list;
  list.push(modelId);
  map.set(String(userId), list);
  await saveFavorites(map);
  return list;
}

async function removeFavorite(userId, modelId) {
  const map = await loadFavorites();
  const list = (map.get(String(userId)) || []).filter((m) => m !== modelId);
  map.set(String(userId), list);
  await saveFavorites(map);
  return list;
}

// ─── Model listing ───

function parseModelsOutput(text) {
  const models = [];
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    const sep = " - ";
    const idx = trimmed.indexOf(sep);
    if (idx === -1) continue;
    const id = trimmed.slice(0, idx).trim();
    const label = trimmed.slice(idx + sep.length).trim();
    if (id && label) models.push({ id, label });
  }
  return models;
}

async function getModels() {
  const out = await runCommand([CURSOR_AGENT, "models"], { timeout: 15_000 });
  return parseModelsOutput(out);
}

// ─── Init ───

if (!token) {
  console.error("Missing TELEGRAM_BOT_TOKEN in .env");
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

function isAllowed(userId) {
  if (allowedUserIds.size === 0) return true;
  return allowedUserIds.has(String(userId));
}

function chunkText(text, max = TELEGRAM_MAX_MESSAGE) {
  const chunks = [];
  for (let i = 0; i < text.length; i += max) {
    chunks.push(text.slice(i, i + max));
  }
  return chunks.length ? chunks : [""];
}

// ─── Non-streaming command runner (kept for models, status, tunnel) ───

function runCommand(args, options = {}) {
  const { timeout = 0, cwd = workspace } = options;
  return new Promise((resolve, reject) => {
    const proc = spawn(args[0], args.slice(1), {
      cwd,
      shell: false,
      env: { ...process.env, NO_OPEN_BROWSER: "1" },
    });
    let stdout = "";
    let stderr = "";
    proc.stdout?.on("data", (d) => (stdout += d.toString()));
    proc.stderr?.on("data", (d) => (stderr += d.toString()));
    let t;
    if (timeout > 0) {
      t = setTimeout(() => {
        proc.kill("SIGTERM");
        reject(new Error(`Timeout after ${timeout / 1000}s`));
      }, timeout);
    }
    proc.on("error", (err) => {
      if (t) clearTimeout(t);
      reject(err);
    });
    proc.on("close", (code) => {
      if (t) clearTimeout(t);
      const out = stdout + (stderr ? "\n--- stderr ---\n" + stderr : "");
      if (code !== 0 && !out.trim()) reject(new Error(`Exit code ${code}`));
      else resolve(out.trim() || `(exit ${code})`);
    });
  });
}

// ─── Streaming agent runner ───

function summarizeStreamEvent(evt) {
  switch (evt.type) {
    case "text":
      return evt.content || "";
    case "tool_call":
      return `\u{1F527} ${evt.tool_name || "tool"}: ${(evt.arguments || evt.content || "").slice(0, 200)}`;
    case "tool_result":
      return `\u2705 Result: ${(evt.content || "").slice(0, 300)}`;
    case "status":
      return `\u23F3 ${evt.content || evt.status || "working\u2026"}`;
    case "error":
      return `\u274C ${evt.content || "error"}`;
    case "done":
      return null;
    default:
      if (evt.content) return evt.content;
      return null;
  }
}

async function runAgentStreaming(chatId, args) {
  const proc = spawn(args[0], args.slice(1), {
    cwd: workspace,
    shell: false,
    env: { ...process.env, NO_OPEN_BROWSER: "1" },
  });

  runningAgentByChat[chatId] = proc;

  const statusMsg = await bot.sendMessage(chatId, "\u23F3 Agent starting\u2026");
  const statusMsgId = statusMsg.message_id;

  let fullText = "";
  let lastUpdateTime = 0;
  let buffer = "";
  let lastSentText = "\u23F3 Agent starting\u2026";

  const updateTelegram = async (text, force = false) => {
    const now = Date.now();
    if (!force && now - lastUpdateTime < STREAM_UPDATE_INTERVAL_MS) return;
    const truncated = text.length > TELEGRAM_MAX_MESSAGE
      ? "\u2026" + text.slice(-(TELEGRAM_MAX_MESSAGE - 20))
      : text;
    if (truncated === lastSentText) return;
    lastUpdateTime = now;
    lastSentText = truncated;
    try {
      await bot.editMessageText(truncated || "\u23F3 working\u2026", {
        chat_id: chatId,
        message_id: statusMsgId,
      });
    } catch {
      // Telegram rate limit or "message not modified"
    }
  };

  proc.stdout?.on("data", (chunk) => {
    buffer += chunk.toString();
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      try {
        const evt = JSON.parse(trimmed);
        const snippet = summarizeStreamEvent(evt);
        if (snippet) {
          fullText += (fullText ? "\n" : "") + snippet;
          updateTelegram(fullText);
        }
      } catch {
        fullText += (fullText ? "\n" : "") + trimmed;
        updateTelegram(fullText);
      }
    }
  });

  let stderr = "";
  proc.stderr?.on("data", (d) => (stderr += d.toString()));

  return new Promise((resolve) => {
    proc.on("close", async (code) => {
      delete runningAgentByChat[chatId];

      if (buffer.trim()) {
        try {
          const evt = JSON.parse(buffer.trim());
          const snippet = summarizeStreamEvent(evt);
          if (snippet) fullText += (fullText ? "\n" : "") + snippet;
        } catch {
          fullText += (fullText ? "\n" : "") + buffer.trim();
        }
      }

      if (stderr.trim()) {
        fullText += "\n--- stderr ---\n" + stderr.trim();
      }

      const finalText = fullText.trim() || `(exit ${code})`;
      await updateTelegram(finalText, true);

      if (finalText.length > TELEGRAM_MAX_MESSAGE) {
        const chunks = chunkText(finalText);
        try {
          await bot.editMessageText(chunks[0], {
            chat_id: chatId,
            message_id: statusMsgId,
          });
        } catch {}
        for (let i = 1; i < chunks.length; i++) {
          await bot.sendMessage(chatId, chunks[i]);
        }
      }

      resolve(finalText);
    });

    proc.on("error", async (err) => {
      delete runningAgentByChat[chatId];
      await updateTelegram(`\u274C Error: ${err.message}`, true);
      resolve(`Error: ${err.message}`);
    });
  });
}

function buildAgentArgs(prompt, options = {}) {
  const { mode, model } = options;
  const args = [
    CURSOR_AGENT,
    "--print",
    "--trust",
    "--output-format", "stream-json",
    "--stream-partial-output",
  ];
  if (mode) args.push("--mode", mode);
  if (model) args.push("--model", model);
  args.push("--workspace", workspace, prompt);
  return args;
}

async function sendLong(chatId, text, options = {}) {
  const chunks = chunkText(String(text));
  for (const chunk of chunks) {
    await bot.sendMessage(chatId, chunk, options);
  }
}

// ─── Voice / audio message handling ───

async function ensureVoiceDir() {
  try {
    await mkdir(VOICE_DIR, { recursive: true });
  } catch {}
}

async function downloadTelegramFile(fileId) {
  await ensureVoiceDir();
  const filePath = await bot.getFileLink(fileId);
  const localPath = join(VOICE_DIR, `${fileId}.ogg`);

  const response = await fetch(filePath);
  if (!response.ok) throw new Error(`Download failed: ${response.status}`);
  const fileStream = createWriteStream(localPath);
  await pipeline(Readable.fromWeb(response.body), fileStream);
  return localPath;
}

async function transcribeAudio(filePath) {
  try {
    // Try whisper CLI first (openai-whisper python package)
    const out = await runCommand(
      ["whisper", "--model", "base", "--output_format", "txt", "--output_dir", VOICE_DIR, filePath],
      { timeout: 60_000, cwd: VOICE_DIR }
    );
    const txtPath = filePath.replace(/\.ogg$/, ".txt");
    const transcript = await readFile(txtPath, "utf8");
    return transcript.trim();
  } catch {
    try {
      // Fallback: python3 inline whisper
      const pythonCmd = `import whisper; m=whisper.load_model("base"); r=m.transcribe("${filePath}"); print(r["text"])`;
      const out = await runCommand(
        ["python3", "-c", pythonCmd],
        { timeout: 120_000, cwd: VOICE_DIR }
      );
      return out.trim();
    } catch {
      return null;
    }
  }
}

// ─── Bot commands ───

const BOT_COMMANDS = [
  { command: "start", description: "Start bot" },
  { command: "help", description: "List all commands" },
  { command: "agent", description: "Run agent with prompt" },
  { command: "agent_on", description: "Auto-agent: all text goes to agent" },
  { command: "agent_off", description: "Disable auto-agent mode" },
  { command: "agent_plan", description: "Agent read-only / plan" },
  { command: "agent_ask", description: "Agent Q&A only" },
  { command: "agent_model", description: "Run with model: model_id prompt" },
  { command: "models", description: "List available models" },
  { command: "favorites", description: "Your favorite models" },
  { command: "cancel", description: "Cancel pending model / stop agent" },
  { command: "cursor_status", description: "Agent auth status" },
  { command: "cursor_tunnel", description: "Tunnel status" },
];

async function setBotCommands() {
  try {
    await bot.setMyCommands(BOT_COMMANDS);
    console.log("Bot command menu set.");
  } catch (e) {
    console.warn("Could not set command menu:", e.message);
  }
}

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  if (!isAllowed(msg.from?.id)) {
    bot.sendMessage(chatId, "Not allowed.");
    return;
  }
  bot.sendMessage(chatId, "Cursor CLI bot. Send /help to see commands.");
});

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from?.id;
  if (!isAllowed(userId)) {
    bot.sendMessage(chatId, "Not allowed.");
    return;
  }
  const agentStatus = agentModeByChat[chatId] ? "ON \u2705" : "OFF";
  const help = `
/agent <prompt> \u2014 Run Cursor agent (streaming)
/agent_on \u2014 Auto-agent: all text goes to agent
/agent_off \u2014 Disable auto-agent mode
/agent_plan <prompt> \u2014 Read-only / planning
/agent_ask <prompt> \u2014 Q&A only
/agent_model <model> <prompt> \u2014 Use a specific model
/models \u2014 List models (with buttons)
/favorites \u2014 Your favorite models
/favorites_add <model_id> \u2014 Add to favorites
/favorites_remove <model_id> \u2014 Remove from favorites
/cancel \u2014 Cancel pending model / stop running agent
/cursor_status \u2014 Agent auth status
/cursor_tunnel \u2014 Tunnel status
/help \u2014 This message

\u{1F3A4} Voice messages supported \u2014 send a voice note and it will be transcribed and sent to the agent.

Agent mode: ${agentStatus}
Workspace: ${workspace}
`.trim();
  bot.sendMessage(chatId, help);
});

// ─── Agent mode toggle ───

bot.onText(/\/agent_on/, (msg) => {
  const chatId = msg.chat.id;
  if (!isAllowed(msg.from?.id)) {
    bot.sendMessage(chatId, "Not allowed.");
    return;
  }
  agentModeByChat[chatId] = true;
  bot.sendMessage(chatId, "\u2705 Agent mode ON \u2014 all your text messages will go to the agent. Send /agent_off to disable.");
});

bot.onText(/\/agent_off/, (msg) => {
  const chatId = msg.chat.id;
  if (!isAllowed(msg.from?.id)) {
    bot.sendMessage(chatId, "Not allowed.");
    return;
  }
  delete agentModeByChat[chatId];
  bot.sendMessage(chatId, "Agent mode OFF \u2014 use /agent <prompt> to run the agent.");
});

// ─── Status / tunnel / models ───

bot.onText(/\/cursor_status/, async (msg) => {
  const chatId = msg.chat.id;
  if (!isAllowed(msg.from?.id)) {
    bot.sendMessage(chatId, "Not allowed.");
    return;
  }
  try {
    const out = await runCommand([CURSOR_AGENT, "status"], { timeout: 15_000 });
    await sendLong(chatId, out);
  } catch (e) {
    await bot.sendMessage(chatId, `Error: ${e.message}`);
  }
});

bot.onText(/\/cursor_tunnel/, async (msg) => {
  const chatId = msg.chat.id;
  if (!isAllowed(msg.from?.id)) {
    bot.sendMessage(chatId, "Not allowed.");
    return;
  }
  try {
    const out = await runCommand(
      [CURSOR_BIN, "--user-data-dir=/tmp/cursor-cli", "tunnel", "status"],
      { timeout: 10_000 }
    );
    await sendLong(chatId, out);
  } catch (e) {
    await bot.sendMessage(chatId, `Error: ${e.message}`);
  }
});

bot.onText(/\/cursor_models/, async (msg) => {
  const chatId = msg.chat.id;
  if (!isAllowed(msg.from?.id)) {
    bot.sendMessage(chatId, "Not allowed.");
    return;
  }
  try {
    const out = await runCommand([CURSOR_AGENT, "models"], { timeout: 15_000 });
    await sendLong(chatId, out);
  } catch (e) {
    await bot.sendMessage(chatId, `Error: ${e.message}`);
  }
});

bot.onText(/\/models/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from?.id;
  if (!isAllowed(userId)) {
    bot.sendMessage(chatId, "Not allowed.");
    return;
  }
  try {
    await bot.sendMessage(chatId, "Loading models\u2026");
    const models = await getModels();
    if (models.length === 0) {
      await bot.sendMessage(chatId, "No models found.");
      return;
    }
    const text = models.map((m) => `${m.id} \u2014 ${m.label}`).join("\n");
    await sendLong(chatId, text);

    const BUTTONS_PER_ROW = 2;
    const useRows = [];
    for (let i = 0; i < models.length; i += BUTTONS_PER_ROW) {
      const row = models.slice(i, i + BUTTONS_PER_ROW).map((m) => ({
        text: m.label.length > 25 ? m.id : m.label,
        callback_data: `use:${m.id}`.slice(0, 64),
      }));
      useRows.push(row);
    }
    await bot.sendMessage(chatId, "Tap to use for your next prompt:", {
      reply_markup: { inline_keyboard: useRows },
    });

    const favRows = [];
    for (let i = 0; i < models.length; i += BUTTONS_PER_ROW) {
      const row = models.slice(i, i + BUTTONS_PER_ROW).map((m) => ({
        text: "\u2665 " + (m.label.length > 22 ? m.id : m.label),
        callback_data: `fav:${m.id}`.slice(0, 64),
      }));
      favRows.push(row);
    }
    await bot.sendMessage(chatId, "Add to favorites:", {
      reply_markup: { inline_keyboard: favRows },
    });
  } catch (e) {
    await bot.sendMessage(chatId, `Error: ${e.message}`);
  }
});

// ─── Cancel / favorites ───

bot.onText(/\/cancel/, (msg) => {
  const chatId = msg.chat.id;
  if (!isAllowed(msg.from?.id)) return;

  let cancelled = false;
  if (runningAgentByChat[chatId]) {
    runningAgentByChat[chatId].kill("SIGTERM");
    delete runningAgentByChat[chatId];
    bot.sendMessage(chatId, "\u26D4 Running agent killed.");
    cancelled = true;
  }
  if (pendingModelByChat[chatId]) {
    delete pendingModelByChat[chatId];
    bot.sendMessage(chatId, "Cancelled model selection.");
    cancelled = true;
  }
  if (!cancelled) {
    bot.sendMessage(chatId, "Nothing to cancel.");
  }
});

bot.onText(/\/favorites$/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from?.id;
  if (!isAllowed(userId)) {
    bot.sendMessage(chatId, "Not allowed.");
    return;
  }
  const list = await getFavorites(userId);
  if (list.length === 0) {
    await bot.sendMessage(
      chatId,
      "No favorites yet. Use /models and tap \u2665 to add, or /favorites_add <model_id>"
    );
    return;
  }
  const text = "Your favorites:\n" + list.map((m) => `\u2022 ${m}`).join("\n");
  const rows = list.map((m) => [
    { text: `Use ${m}`, callback_data: `use:${m}`.slice(0, 64) },
    { text: `Remove`, callback_data: `remove:${m}`.slice(0, 64) },
  ]);
  await bot.sendMessage(chatId, text, {
    reply_markup: { inline_keyboard: rows },
  });
});

bot.onText(/\/favorites_add\s+(.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from?.id;
  if (!isAllowed(userId)) {
    bot.sendMessage(chatId, "Not allowed.");
    return;
  }
  const modelId = match[1].trim();
  await addFavorite(userId, modelId);
  const list = await getFavorites(userId);
  await bot.sendMessage(chatId, `Added "${modelId}". Favorites: ${list.join(", ")}`);
});

bot.onText(/\/favorites_remove\s+(.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from?.id;
  if (!isAllowed(userId)) {
    bot.sendMessage(chatId, "Not allowed.");
    return;
  }
  const modelId = match[1].trim();
  await removeFavorite(userId, modelId);
  const list = await getFavorites(userId);
  await bot.sendMessage(chatId, `Removed "${modelId}". Favorites: ${list.join(", ") || "(none)"}`);
});

// ─── Callback queries (model use / fav buttons) ───

bot.on("callback_query", async (query) => {
  const chatId = query.message?.chat?.id;
  const userId = query.from?.id;
  const data = query.data;
  if (!chatId || !data || !isAllowed(userId)) {
    await bot.answerCallbackQuery(query.id);
    return;
  }
  if (data.startsWith("use:")) {
    const modelId = data.slice(4);
    pendingModelByChat[chatId] = modelId;
    await bot.answerCallbackQuery(query.id, { text: `Model: ${modelId}. Send your prompt.` });
    await bot.sendMessage(chatId, `Model set to *${modelId}*. Send your prompt now (or /cancel).`, {
      parse_mode: "Markdown",
    });
    return;
  }
  if (data.startsWith("fav:")) {
    const modelId = data.slice(4);
    await addFavorite(userId, modelId);
    await bot.answerCallbackQuery(query.id, { text: `Added ${modelId} to favorites` });
    return;
  }
  if (data.startsWith("remove:")) {
    const modelId = data.slice(7);
    await removeFavorite(userId, modelId);
    await bot.answerCallbackQuery(query.id, { text: `Removed ${modelId}` });
    const list = await getFavorites(userId);
    const text = list.length ? "Favorites:\n" + list.map((m) => `\u2022 ${m}`).join("\n") : "No favorites left.";
    try {
      await bot.editMessageText(text, {
        chat_id: chatId,
        message_id: query.message?.message_id,
        reply_markup: list.length
          ? { inline_keyboard: list.map((m) => [
              { text: `Use ${m}`, callback_data: `use:${m}`.slice(0, 64) },
              { text: `Remove`, callback_data: `remove:${m}`.slice(0, 64) },
            ]) }
          : undefined,
      });
    } catch {
      await bot.sendMessage(chatId, text);
    }
    return;
  }
  await bot.answerCallbackQuery(query.id);
});

// ─── Agent commands (all now use streaming) ───

bot.onText(/\/agent_model\s+(\S+)\s+(.+)/s, async (msg, match) => {
  const chatId = msg.chat.id;
  if (!isAllowed(msg.from?.id)) {
    bot.sendMessage(chatId, "Not allowed.");
    return;
  }
  const modelId = match[1].trim();
  const prompt = match[2].trim();
  const args = buildAgentArgs(prompt, { model: modelId });
  await runAgentStreaming(chatId, args);
});

bot.onText(/\/agent_plan\s*(.+)?/s, async (msg, match) => {
  const chatId = msg.chat.id;
  if (!isAllowed(msg.from?.id)) {
    bot.sendMessage(chatId, "Not allowed.");
    return;
  }
  const prompt = match[1]?.trim();
  if (!prompt) {
    bot.sendMessage(chatId, "Usage: /agent_plan <prompt>");
    return;
  }
  const args = buildAgentArgs(prompt, { mode: "plan" });
  await runAgentStreaming(chatId, args);
});

bot.onText(/\/agent_ask\s*(.+)?/s, async (msg, match) => {
  const chatId = msg.chat.id;
  if (!isAllowed(msg.from?.id)) {
    bot.sendMessage(chatId, "Not allowed.");
    return;
  }
  const prompt = match[1]?.trim();
  if (!prompt) {
    bot.sendMessage(chatId, "Usage: /agent_ask <prompt>");
    return;
  }
  const args = buildAgentArgs(prompt, { mode: "ask" });
  await runAgentStreaming(chatId, args);
});

bot.onText(/\/agent(?!\s*_)\s*(.+)?/s, async (msg, match) => {
  const chatId = msg.chat.id;
  if (!isAllowed(msg.from?.id)) {
    bot.sendMessage(chatId, "Not allowed.");
    return;
  }
  const prompt = match[1]?.trim();
  if (!prompt) {
    bot.sendMessage(chatId, "Usage: /agent <prompt>");
    return;
  }
  const args = buildAgentArgs(prompt);
  await runAgentStreaming(chatId, args);
});

// ─── Voice message handler ───

bot.on("voice", async (msg) => {
  const chatId = msg.chat.id;
  if (!isAllowed(msg.from?.id)) {
    bot.sendMessage(chatId, "Not allowed.");
    return;
  }

  await bot.sendMessage(chatId, "\u{1F3A4} Received voice message, transcribing\u2026");

  let localPath;
  try {
    localPath = await downloadTelegramFile(msg.voice.file_id);
    const transcript = await transcribeAudio(localPath);

    if (!transcript) {
      await bot.sendMessage(
        chatId,
        "\u26A0\uFE0F Could not transcribe audio. Whisper is not installed.\n" +
        "Install with: pip install openai-whisper\n" +
        "Or install ffmpeg: apt install ffmpeg"
      );
      return;
    }

    await bot.sendMessage(chatId, `\u{1F4DD} Transcription:\n${transcript}`);

    const args = buildAgentArgs(transcript);
    await runAgentStreaming(chatId, args);
  } catch (e) {
    await bot.sendMessage(chatId, `Error processing voice: ${e.message}`);
  } finally {
    if (localPath) {
      try { await unlink(localPath); } catch {}
      try { await unlink(localPath.replace(/\.ogg$/, ".txt")); } catch {}
    }
  }
});

bot.on("audio", async (msg) => {
  const chatId = msg.chat.id;
  if (!isAllowed(msg.from?.id)) {
    bot.sendMessage(chatId, "Not allowed.");
    return;
  }

  await bot.sendMessage(chatId, "\u{1F3B5} Received audio, transcribing\u2026");

  let localPath;
  try {
    localPath = await downloadTelegramFile(msg.audio.file_id);
    const transcript = await transcribeAudio(localPath);

    if (!transcript) {
      await bot.sendMessage(
        chatId,
        "\u26A0\uFE0F Could not transcribe audio. Whisper is not installed.\n" +
        "Install with: pip install openai-whisper"
      );
      return;
    }

    await bot.sendMessage(chatId, `\u{1F4DD} Transcription:\n${transcript}`);

    const args = buildAgentArgs(transcript);
    await runAgentStreaming(chatId, args);
  } catch (e) {
    await bot.sendMessage(chatId, `Error processing audio: ${e.message}`);
  } finally {
    if (localPath) {
      try { await unlink(localPath); } catch {}
      try { await unlink(localPath.replace(/\.ogg$/, ".txt")); } catch {}
    }
  }
});

// ─── Plain text handler (pending model + agent mode) ───

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  if (!text || text.startsWith("/") || !isAllowed(msg.from?.id)) return;

  const modelId = pendingModelByChat[chatId];
  if (modelId) {
    delete pendingModelByChat[chatId];
    const args = buildAgentArgs(text, { model: modelId });
    await runAgentStreaming(chatId, args);
    return;
  }

  if (agentModeByChat[chatId]) {
    const args = buildAgentArgs(text);
    await runAgentStreaming(chatId, args);
    return;
  }
});

// ─── Error handling & startup ───

bot.on("polling_error", (err) => console.error("Polling error:", err));

setBotCommands().then(() => {
  console.log("Cursor Telegram bot running (streaming + voice + agent mode).");
  console.log("Send /help in Telegram for commands.");
});
