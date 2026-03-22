/**
 * Preset chat messages for Twitch chatbot service
 * Combined from GrowTwitch legacy messages + new category-based messages
 */

export const CHAT_CATEGORIES = {
  random: {
    label: "Random Chat Messages",
    desc: "Natural, varied messages",
  },
  hype: {
    label: "Hype & Excitement",
    desc: "LET'S GO, POG, etc.",
  },
  reactions: {
    label: "Reactions & Emotes",
    desc: "LUL, Kappa, KEKW, etc.",
  },
  questions: {
    label: "Questions & Engagement",
    desc: "What game is next?, etc.",
  },
  compliments: {
    label: "Compliments & Support",
    desc: "Great play!, Love the stream, etc.",
  },
  casual: {
    label: "Casual Conversation",
    desc: "Hey chat, GGs, etc.",
  },
} as const;

export type ChatCategory = keyof typeof CHAT_CATEGORIES;

// Random/General messages (from GrowTwitch legacy + additions)
const RANDOM_MESSAGES = [
  "Hello! Excited to join your stream",
  "Hey bro",
  "Yoooo whats good bro!!",
  "Hi mate",
  "Watcha sayin'",
  "!headset",
  "Let's get it",
  "yo yo yo",
  "How are you today mate?",
  "You're a beast",
  "Keep up the good work!",
  "Lets have some funnn",
  "I'm so glad I found your channel",
  "You always make me laugh",
  "You've got mad skills",
  "I've learned so much from watching you",
  "Best way to learn is to watch other people tbh",
  "hey bro you good?",
  "Ye its good man",
  "You're killing it",
  "Stream is fire",
  "Any tips for someone starting on twitch?",
  "The grind is real",
  "Thanks for the fantastic stream!",
  "Greetings! Excited to tune into your stream.",
  "Yo, what's the plan for today?",
  "How's your day going, mate?",
  "Your skills are impressive.",
  "Enjoying the stream, as always.",
  "Found your channel and loving it.",
  "Laughter is guaranteed with your content.",
  "You've got some serious talent.",
  "Learning a lot from you.",
  "Watching others is a great way to learn.",
  "Keeping an eye on your strategies.",
  "You're absolutely killing it!",
  "The stream is on fire!",
  "Any tips for a Twitch beginner?",
  "The grind is real but rewarding.",
  "What's up, my dude?",
  "New gear, who dis?",
  "Let's crush it today!",
  "What's the vibe for today?",
  "Feeling awesome, how 'bout you?",
  "Serious skills on display.",
  "Enjoying the show here.",
  "Stumbled upon your channel and hooked.",
  "Watching and learning is key.",
  "Keeping an eye on the master.",
  "You're killing it, as always.",
  "Positive energy radiating from the stream.",
  "Any advice for a Twitch newbie?",
  "The grind never stops, but it's worth it.",
  "Thanks for the epic stream!",
  "Tuning in for the good vibes.",
  "Ready for another epic session.",
  "Checking out your content, loving it.",
  "Impressive skills you've got.",
  "Valuable lessons from your gameplay.",
  "Watching others is a smart way to learn.",
  "Ready to dive into your content.",
  "Just got here, what did I miss?",
  "This is my favorite stream to watch",
  "Finally made it to the stream!",
  "Been looking forward to this all day",
  "Quality content as always",
  "This is why I subbed",
  "Love the energy today",
  "Vibes are immaculate",
  "Perfect stream to end my day",
];

// Hype & Excitement messages
const HYPE_MESSAGES = [
  "LET'S GOOOOO",
  "POGGERS",
  "POG",
  "POGCHAMP",
  "LETS GET IT",
  "HYPE",
  "YOOOOO",
  "OH MY GOD",
  "THAT WAS INSANE",
  "NO WAYYYY",
  "SHEEEESH",
  "CRACKED",
  "GOATED",
  "HE'S GAMING",
  "GAMING",
  "ACTUAL GOD",
  "BUILT DIFFERENT",
  "TOO GOOD",
  "UNREAL",
  "ABSOLUTELY MENTAL",
  "HUGE",
  "MASSIVE",
  "CLUTCH",
  "CLEAN",
  "CRISPY",
  "EZ CLAP",
  "THEY'RE NOT READY",
  "THIS GUY IS DIFFERENT",
  "HOW IS HE SO GOOD",
  "WORLD CLASS",
  "TOP TIER GAMEPLAY",
  "ON FIRE TODAY",
  "UNSTOPPABLE",
  "BEAST MODE",
  "GODLIKE",
];

// Reactions & Emotes
const REACTION_MESSAGES = [
  "LUL",
  "KEKW",
  "Kappa",
  "PogChamp",
  "OMEGALUL",
  "monkaS",
  "monkaW",
  "Sadge",
  "PepeHands",
  "FeelsGoodMan",
  "FeelsBadMan",
  "catJAM",
  "EZ",
  "4Head",
  "LULW",
  "PepeLaugh",
  "Pepega",
  "AYAYA",
  "widepeepoHappy",
  "peepoSad",
  "Clap",
  "GG",
  "F",
  "W",
  "TRUE",
  "REAL",
  "BASED",
  "copium",
  "sadKEK",
  "xqcL",
];

// Questions & Engagement
const QUESTION_MESSAGES = [
  "What game is next?",
  "How long you streaming today?",
  "What rank are you?",
  "When did you start streaming?",
  "What's your favorite game to play?",
  "Any tips for new players?",
  "What's your setup like?",
  "How long have you been playing this?",
  "What made you start streaming?",
  "What's your goal for today?",
  "Is this your main game?",
  "How do you stay motivated?",
  "What's the plan for the stream?",
  "Any collabs coming up?",
  "Do you stream every day?",
  "What time zone are you in?",
  "How long til the next break?",
  "What's your highest score?",
  "Ever thought about going pro?",
  "What's your favorite thing about streaming?",
  "How did you get so good?",
  "Any music requests?",
  "What server you on?",
  "Who's your favorite streamer?",
  "What got you into gaming?",
];

// Compliments & Support
const COMPLIMENT_MESSAGES = [
  "Great play!",
  "Love the stream",
  "You're so good at this",
  "This stream is amazing",
  "Best streamer ever",
  "You deserve more viewers",
  "Underrated channel for real",
  "Always a good time here",
  "Your content is top tier",
  "Keep doing what you're doing",
  "Love the vibes here",
  "So glad I found this channel",
  "You're gonna blow up soon",
  "Quality streamer right here",
  "Always learn something new",
  "The best part of my day",
  "Such a chill stream",
  "Love the community here",
  "You make streaming look easy",
  "Talented AND entertaining",
  "10/10 stream",
  "Never disappoints",
  "Keep up the amazing work",
  "You're an inspiration",
  "This is why you're the best",
];

// Casual Conversation
const CASUAL_MESSAGES = [
  "Hey chat",
  "GGs",
  "gg",
  "sup everyone",
  "Hey all",
  "yo",
  "What's good everyone",
  "How's everyone doing?",
  "Good vibes only",
  "Just chilling",
  "Late night vibes",
  "Day stream hits different",
  "Weekend stream let's go",
  "Finally caught you live",
  "Just got off work, perfect timing",
  "Having dinner and watching",
  "Background stream while I work",
  "Best stream to fall asleep to lol",
  "Cozy stream energy",
  "Just here to hang",
  "Good evening everyone",
  "Happy to be here",
  "Chat moving fast",
  "Who else is lurking",
  "Silent viewer checking in",
  "Back from grabbing food",
  "Had to step away, what happened?",
  "This is the content I signed up for",
  "Perfect background noise",
  "Chill stream best stream",
];

export const CATEGORY_MESSAGES: Record<ChatCategory, string[]> = {
  random: RANDOM_MESSAGES,
  hype: HYPE_MESSAGES,
  reactions: REACTION_MESSAGES,
  questions: QUESTION_MESSAGES,
  compliments: COMPLIMENT_MESSAGES,
  casual: CASUAL_MESSAGES,
};

/**
 * Get messages for selected categories
 * @param categories Array of category IDs or comma-separated string
 * @returns Array of messages
 */
export function getMessagesForCategories(categories: string[] | string): string[] {
  const categoryList = typeof categories === "string" 
    ? categories.split(",").map(c => c.trim()).filter(Boolean)
    : categories;
  
  if (categoryList.length === 0) {
    return RANDOM_MESSAGES;
  }

  const messages: string[] = [];
  for (const category of categoryList) {
    const catMessages = CATEGORY_MESSAGES[category as ChatCategory];
    if (catMessages) {
      messages.push(...catMessages);
    }
  }

  // If no valid categories found, return random messages
  if (messages.length === 0) {
    return RANDOM_MESSAGES;
  }

  // Shuffle the messages for variety
  return shuffleArray([...new Set(messages)]);
}

/**
 * Get all preset messages (all categories combined)
 */
export function getAllPresetMessages(): string[] {
  const all = Object.values(CATEGORY_MESSAGES).flat();
  return [...new Set(all)];
}

/**
 * Parse custom messages from newline-separated string
 */
export function parseCustomMessages(input: string): string[] {
  return input
    .split("\n")
    .map(m => m.trim())
    .filter(m => m.length > 0);
}

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
