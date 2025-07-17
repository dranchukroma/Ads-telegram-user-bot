import { sendRandomMessage } from "./sendAdsMessages.js";
import schedule from "node-schedule";
import { logger } from "../utils/logger.js";
import { randomMode, daysOfWeek } from "../config/config.js";

export function scheduleMessages() {
    // Скасувати всі попередні задачі
    schedule.gracefulShutdown();

    if (randomMode) {
      // Для кожного дня тижня
      daysOfWeek.forEach((day) => {
        // Випадковий час (наприклад, між 10:00 і 20:00)
        // const hour = Math.floor(Math.random() * 10) + 10;
        // const minute = Math.floor(Math.random() * 60);
        const hour = 14;
        const minute = 59;

        schedule.scheduleJob({ dayOfWeek: day, hour, minute }, sendRandomMessage);
        logger("SCHEDULE", `Заплановано на день ${day}, ${hour}:${minute}`);
      });
    }
  }