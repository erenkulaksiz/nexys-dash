import { Log } from "./logger";

export async function SendTelegramMessage({ message }: { message: string }) {
  const text = encodeURIComponent(message);
  if (!process.env.TELEGRAM_BOT_ID || !process.env.TELEGRAM_BOT_TARGET_ID)
    return Log.error("Telegram bot not configured");
  await fetch(
    `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_ID}/sendMessage?chat_id=${process.env.TELEGRAM_BOT_TARGET_ID}&text=${text}`
  );
  Log.debug("Sent telegram bot message: ", message);
  //Log.debug("Telegram bot res:", res);
}
