const crypto = require("crypto");
function hashEmail(email) {
  return crypto
    .createHash("sha256")
    .update(normalizeEmail(email))
    .digest("hex");
}

function getKey() {
  const key = process.env.EMAIL_ENCRYPTION_KEY;

  if (!key || key.length !== 64) {
    throw new Error(
      "EMAIL_ENCRYPTION_KEY must be exactly 64 hexadecimal characters"
    );
  }

  return Buffer.from(key, "hex");
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function encryptEmail(email) {
  const normalizedEmail = normalizeEmail(email);

  const iv = crypto.randomBytes(12);

  const cipher = crypto.createCipheriv(
    "aes-256-gcm",
    getKey(),
    iv
  );

  const encrypted = Buffer.concat([
    cipher.update(normalizedEmail, "utf8"),
    cipher.final()
  ]);

  const authTag = cipher.getAuthTag();

  return [
    iv.toString("hex"),
    authTag.toString("hex"),
    encrypted.toString("hex")
  ].join(":");
}

function decryptEmail(encryptedEmail) {
  const parts = encryptedEmail.split(":");

  const iv = Buffer.from(parts[0], "hex");
  const authTag = Buffer.from(parts[1], "hex");
  const encrypted = Buffer.from(parts[2], "hex");

  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    getKey(),
    iv
  );

  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final()
  ]);

  return decrypted.toString("utf8");
}

module.exports = {
  normalizeEmail,
  encryptEmail,
  decryptEmail,
  hashEmail,
};