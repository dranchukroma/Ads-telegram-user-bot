import { scheduleMessages } from "./controllers/scheduleMessages.js";
import { sendRandomMessageToGroup } from "./features/sendRandomMessage.js";
import { groups } from "./storage/groups.js";
import { messages } from "./storage/messages.js";

(async () => {
    if (false) {
        setTimeout(async () => {
            for (const group of groups) {
                if (group.disabled) continue; // пропускаємо вимкнені

                const res = await sendRandomMessageToGroup(group, messages);
                console.log(res);
            }
        }, 2)
    } else scheduleMessages();
})();