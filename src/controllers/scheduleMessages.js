import schedule from "node-schedule";
import { logger } from "../utils/logger.js";
import { randomMode, daysOfWeek } from "../config/config.js";
import { groups } from "../storage/groups.js";
import { sendRandomMessageToGroup } from "../features/sendRandomMessage.js";
import { messages } from "../storage/messages.js";


export function scheduleMessages() {
  // Скасувати всі попередні задачі
  schedule.gracefulShutdown();

  if (randomMode) {
    // Для кожного дня тижня
    daysOfWeek.forEach((day) => {
      // Випадковий час (наприклад, між 10:00 і 20:00)
      const hour = Math.floor(Math.random() * 10) + 10;
      const minute = Math.floor(Math.random() * 60);
      // const hour = 11;
      // const minute = 37;

      schedule.scheduleJob({ dayOfWeek: day, hour, minute }, async () => {
        for (const group of groups) {
          if (group.disabled) continue; // пропускаємо вимкнені

          const res = await sendRandomMessageToGroup(group, messages);
          console.log(res);

        }
      });
      logger("SCHEDULE", `Заплановано на день ${day}, ${hour}:${minute}`);
    });
  }
}