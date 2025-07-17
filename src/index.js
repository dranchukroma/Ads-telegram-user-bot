// adsUserBot/index.js

const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const schedule = require("node-schedule");
const input = require("input"); // Для введення даних при першому запуску

// --- Налаштування ---
const apiId = 123456; // Ваш api_id з my.telegram.org
const apiHash = "your_api_hash"; // Ваш api_hash
const stringSession = new StringSession(""); // Залишити порожнім для першого запуску

// Список груп (ID або username)
const groups = [
  -1001234567890, // ID групи
  "@yourgroupusername"
];

// Список рекламних повідомлень
const messages = [
  "Спробуй наш сервіс! 🔥",
  "Тільки сьогодні — знижка на підписку!",
  "Долучайся до нашого бота для пошуку!"
];

// Дні тижня для розсилки (0 — неділя, 6 — субота)
const daysOfWeek = [1, 3, 5]; // Наприклад, понеділок, середа, п’ятниця

let randomMode = true; // Перемикач рандомного режиму

(async () => {
  console.log("Запуск userBot...");

  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });

  await client.start({
    phoneNumber: async () => await input.text("Введіть номер телефону: "),
    password: async () => await input.text("Введіть 2FA пароль: "),
    phoneCode: async () => await input.text("Введіть код з Telegram: "),
    onError: (err) => console.log(err),
  });

  console.log("Бот авторизований!");
  console.log("StringSession:", client.session.save()); // Збережіть це для наступних запусків

  // Функція для надсилання повідомлення у випадкову групу
  async function sendRandomMessage() {
    for (const group of groups) {
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      try {
        await client.sendMessage(group, { message: randomMsg });
        console.log(`Відправлено у ${group}: ${randomMsg}`);
      } catch (e) {
        console.error(`Помилка для групи ${group}:`, e.message);
      }
    }
  }

  // Планування розсилки
  function scheduleMessages() {
    // Скасувати всі попередні задачі
    schedule.gracefulShutdown();

    if (randomMode) {
      // Для кожного дня тижня
      daysOfWeek.forEach((day) => {
        // Випадковий час (наприклад, між 10:00 і 20:00)
        const hour = Math.floor(Math.random() * 10) + 10;
        const minute = Math.floor(Math.random() * 60);

        schedule.scheduleJob({ dayOfWeek: day, hour, minute }, sendRandomMessage);
        console.log(`Заплановано на день ${day}, ${hour}:${minute}`);
      });
    }
  }

  // Запуск планування
  scheduleMessages();

  // Можна додати команду для перемикання randomMode через консоль або файл
})();