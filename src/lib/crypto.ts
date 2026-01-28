import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";

const RAW_SECRET = process.env.SECRET_ENCRYPTION_KEY;

// Put this in env (same across cluster)
// Derive exactly 32 bytes
const SECRET_KEY = crypto.createHash("sha256").update(RAW_SECRET!).digest(); // 32 bytes buffer

export function encrypt(text: string) {
  const iv = crypto.randomBytes(12);

  const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  const tag = cipher.getAuthTag();

  return {
    iv: iv.toString("hex"),
    content: encrypted,
    tag: tag.toString("hex"),
  };
}

export function decrypt(enc: { iv: string; content: string; tag: string }) {
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    SECRET_KEY,
    Buffer.from(enc.iv, "hex"),
  );

  decipher.setAuthTag(Buffer.from(enc.tag, "hex"));

  let decrypted = decipher.update(enc.content, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
