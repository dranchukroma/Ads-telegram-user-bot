import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";
import dotenv from 'dotenv';
dotenv.config();

const apiId = Number(process.env.CONNECTED_TELEGRAM_ACC_API_ID);
const apiHash = process.env.CONNECTED_TELEGRAM_ACC_API_HASH;
const stringSession = new StringSession(process.env.CONNECTED_TELEGRAM_ACC_STRING_SESSION);

// export const daysOfWeek = [1, 3, 5]; // Наприклад, понеділок, середа, п’ятниця
export const daysOfWeek = [1, 3, 5]; // Наприклад, понеділок, середа, п’ятниця
export const randomMode = true; // Перемикач рандомного режиму

export const client = new TelegramClient(
  stringSession,
  apiId,
  apiHash,
  { connectionRetries: 5, }
);

client.connect()
  .then(() => {
    console.log('✅ Клієнт успішно підключений');
  })
  .catch((error) => {
    console.error('❌ Помилка підключення клієнта:', error);
  });