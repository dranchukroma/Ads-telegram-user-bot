// src/utils/sendRandomMessageToGroup.js
import { client } from "../config/config.js";
import { resolveGroupToPeer } from './resolveGroupTopPeer.js'


/** helpers для витягування рефкоду з group */
function normalizeUsername(username) {
  if (!username) return null;
  let u = String(username).trim();
  if (u.startsWith("@")) u = u.slice(1);
  const m = u.match(/(?:https?:\/\/)?t\.me\/([^/]+)/i);
  if (m) u = m[1];
  if (!u) return null;
  if (u.startsWith("+") || u.startsWith("joinchat")) return null; // це вже інвайт, не username
  return u;
}
function extractInviteHash(link) {
  if (!link) return null;
  const s = String(link).trim();
  const m = s.match(/(?:https?:\/\/)?t\.me\/(?:\+|joinchat\/)([A-Za-z0-9_-]+)/i);
  return m ? m[1] : null;
}
/** Пріоритет вибору рефкоду з group */
function getReferralCodeFromGroup(group) {
  // 1) явний refCode (якщо захочеш додати колись)
  if (group?.refCode != null && group.refCode !== "") return String(group.refCode);
  // 2) стабільний TL id (кеш)
  if (group?.id != null && group.id !== "") return String(group.id);
  // 3) username (для публічних)
  const uname = normalizeUsername(group?.username);
  if (uname) return uname;
  // 4) invite hash (для приватних)
  const hash = extractInviteHash(group?.invite);
  if (hash) return hash;
  // 5) fallback
  return "0";
}

/**
 * Надсилає рандомне повідомлення у групу (рефкод береться з group).
 * ВАЖЛИВО: якщо юзербот не в групі — `resolveGroupToPeer(group)` має сама приєднати/зарезолвити.
 *
 * @param {Object} group - опис групи (з твоєї схеми)
 * @param {Function} messagesFn - функція messages(refCode) -> string (генерує вже рандомний текст)
 * @returns {Promise<{ ok: boolean, status: 'sent' | 'failed', group: Object, usedMessage?: string, reason?: string }>}
 */
export async function sendRandomMessageToGroup(group, messagesFn) {
  const refCode = getReferralCodeFromGroup(group);
  const text = messagesFn(refCode);

  try {
    // головна вимога: спираємось на resolveGroupToPeer для join/resolve
    const peer = await resolveGroupToPeer(group);

    await client.sendMessage(peer, {
      message: text,
      parseMode: "html",
    });

    return { ok: true, status: "sent", group, usedMessage: text };
  } catch (e) {
    return {
      ok: false,
      status: "failed",
      group,
      usedMessage: text,
      reason: String(e?.message || e),
    };
  }
}
