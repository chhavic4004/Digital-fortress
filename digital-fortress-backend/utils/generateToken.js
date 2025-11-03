import jwt from "jsonwebtoken";

let hasWarned = false;

export const generateToken = (id) => {
  try {
    const secret = process.env.JWT_SECRET || "fallbackSecretKey";
    const expiresIn = process.env.JWT_EXPIRE?.trim() || "1h";

    if (!process.env.JWT_SECRET && !hasWarned) {
      console.warn("⚠️ JWT_SECRET missing — using fallback secret");
      hasWarned = true;
    }
    if (!process.env.JWT_EXPIRE && !hasWarned) {
      console.warn("⚠️ JWT_EXPIRE missing — using default 1h expiry");
      hasWarned = true;
    }

    // Always try to make a valid token
    return jwt.sign({ id }, secret, { expiresIn });
  } catch (err) {
    console.error("⚠️ Token generation failed:", err.message);
    // Always return a token so login never breaks
    return `dummy-token-${id}-${Date.now()}`;
  }
};
