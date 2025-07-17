import { logger } from "../utils/logger.js";
import { groups } from "../storage/groups.js";
import { messages } from "../storage/messages.js";
import { client } from "../config/config.js";

// Функція для надсилання повідомлення у групу з обробкою помилок
async function sendMessageWithJoin(group, message) {
    try {
        await client.sendMessage(group, { message });
        logger("INFO", `Відправлено у ${group}: ${message}`);
    } catch (e) {
        logger("ERROR", `Не вдалося відправити у ${group}: ${e.message}`);
        // Якщо бот не в групі — пробуємо приєднатися
        if (e.message && e.message.includes("USER_NOT_PARTICIPANT")) {
            try {
                logger("INFO", `Спроба приєднатися до групи ${group}...`);
                await client.invoke(
                    new Api.channels.JoinChannel({
                        channel: group
                    })
                );
                logger("INFO", `Успішно приєднано до ${group}, повторна спроба надсилання...`);
                // Повторна спроба
                await client.sendMessage(group, { message });
                logger("INFO", `Повторно відправлено у ${group}: ${message}`);
            } catch (joinErr) {
                logger("ERROR", `Не вдалося приєднатися до ${group}: ${joinErr.message}`);
            }
        }
    }
}

// Оновлена функція для розсилки
export async function sendRandomMessage() {
    for (const group of groups) {
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        await sendMessageWithJoin(group, randomMsg);
    }
}