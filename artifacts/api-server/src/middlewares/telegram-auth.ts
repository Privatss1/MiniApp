import crypto from "crypto";
import { type Request, type Response, type NextFunction } from "express";

function verifyInitData(initData: string, botToken: string): boolean {
  try {
    const params = new URLSearchParams(initData);
    const hash = params.get("hash");
    if (!hash || !/^[0-9a-f]{64}$/.test(hash)) return false;

    params.delete("hash");

    const dataCheckString = Array.from(params.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join("\n");

    const secretKey = crypto
      .createHmac("sha256", "WebAppData")
      .update(botToken)
      .digest();

    const expectedHash = crypto
      .createHmac("sha256", secretKey)
      .update(dataCheckString)
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(expectedHash, "hex"),
      Buffer.from(hash, "hex"),
    );
  } catch {
    return false;
  }
}

export function telegramAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  if (!botToken) {
    res.status(500).json({ error: "Server misconfiguration: bot token not set" });
    return;
  }

  const initData =
    (req.headers["x-telegram-init-data"] as string | undefined) ?? "";

  if (!initData) {
    res.status(401).json({ error: "Missing Telegram initData" });
    return;
  }

  if (!verifyInitData(initData, botToken)) {
    res.status(403).json({ error: "Invalid Telegram initData signature" });
    return;
  }

  next();
}
