import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const TAG_LENGTH = 16;
const SALT_LENGTH = 32;

function getEncryptionKey(): Buffer {
  const secret = process.env.ENCRYPTION_SECRET;
  if (!secret) {
    throw new Error("ENCRYPTION_SECRET environment variable is required");
  }
  return crypto.scryptSync(secret, "salt", 32);
}

export function encrypt(text: string): string {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  const tag = cipher.getAuthTag();

  // Format: iv:tag:encrypted
  return `${iv.toString("hex")}:${tag.toString("hex")}:${encrypted}`;
}

export function decrypt(encryptedText: string): string {
  // Check if the text is encrypted (contains the expected format)
  if (!encryptedText.includes(":")) {
    // Not encrypted, return as-is (for backwards compatibility)
    return encryptedText;
  }

  const parts = encryptedText.split(":");
  if (parts.length !== 3) {
    // Not in expected format, return as-is
    return encryptedText;
  }

  try {
    const key = getEncryptionKey();
    const iv = Buffer.from(parts[0], "hex");
    const tag = Buffer.from(parts[1], "hex");
    const encrypted = parts[2];

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch {
    // Decryption failed, might be plaintext
    return encryptedText;
  }
}

export function isEncrypted(text: string): boolean {
  if (!text.includes(":")) return false;
  const parts = text.split(":");
  if (parts.length !== 3) return false;
  // Check if parts look like hex
  return /^[a-f0-9]+$/i.test(parts[0]) && /^[a-f0-9]+$/i.test(parts[1]);
}
