// src/utils/checkMembership.js
import { Api } from "telegram";
import { client } from "../config/config.js";

/** Допоміжні парсери */
function normalizeUsername(username) {
  if (!username) return null;
  let u = String(username).trim();
  if (u.startsWith("@")) u = u.slice(1);
  const m = u.match(/(?:https?:\/\/)?t\.me\/([^/]+)/i);
  if (m) u = m[1];
  if (!u) return null;
  // t.me/+HASH або t.me/joinchat/HASH — це не username
  if (u.startsWith("+") || u.startsWith("joinchat")) return null;
  return u;
}

function extractInviteHash(link) {
  if (!link) return null;
  const s = String(link).trim();
  const m = s.match(/(?:https?:\/\/)?t\.me\/(?:\+|joinchat\/)([A-Za-z0-9_-]+)/i);
  return m ? m[1] : null;
}

/** Витягуємо дані з об'єкта каналу/чату грамджеес */
function buildPeerInfoFromChat(chat) {
  if (!chat) return null;
  const isChannel = chat.className?.toLowerCase?.().includes("channel") || typeof chat.accessHash !== "undefined";
  const peerType = isChannel ? "channel" : "chat";

  return {
    peerType,
    id: chat.id != null ? String(chat.id) : undefined,               // TL id (не botAPI -100...)
    accessHash: chat.accessHash != null ? String(chat.accessHash) : undefined,
    title: chat.title,
    username: chat.username,
  };
}

/** Спроба дізнатись, чи ми учасник каналу/групи */
async function isMemberByChannel(channelInputPeer) {
  try {
    await client.invoke(
      new Api.channels.GetParticipant({
        channel: channelInputPeer,
        participant: new Api.InputPeerSelf(),
      })
    );
    return { ok: true, isMember: true };
  } catch (e) {
    const msg = String(e?.message || "");
    if (/USER_NOT_PARTICIPANT|PARTICIPANT_ID_INVALID/.test(msg)) {
      return { ok: true, isMember: false };
    }
    // Якщо метод недоступний (приватний канал) — повернемо невизначено
    if (/CHANNEL_PRIVATE|CHAT_ADMIN_REQUIRED|CHANNEL_INVALID/.test(msg)) {
      return { ok: false, isMember: false, reason: msg };
    }
    return { ok: false, isMember: false, reason: msg };
  }
}

/**
 * Перевіряє членство і за потреби приєднується.
 * Вхід: об'єкт групи з будь-якою доступною комбінацією полів:
 *  - username: '@name' | 'name' | 't.me/name' (публічні)
 *  - invite: 't.me/+HASH' | 't.me/joinchat/HASH' (приватні)
 *  - id/accessHash/peerType: кешований peer (опціонально)
 *
 * Повертає:
 *  {
 *    isMember: boolean,
 *    status: 'member' | 'joined' | 'pending' | 'failed',
 *    peer?: { peerType, id, accessHash?, title?, username? },
 *    referral: { groupId?: string, peerType?: 'channel'|'chat', username?: string|null, inviteHash?: string|null },
 *    reason?: string
 *  }
 */
export async function checkMembershipAndJoin(groupLike) {
  const username = normalizeUsername(groupLike?.username);
  const inviteHash = extractInviteHash(groupLike?.invite);
  const groupId = extractInviteHash(groupLike?.id);

  // 1) Якщо є інвайт — найнадійніший шлях
  if (inviteHash) {
    try {
      const checked = await client.invoke(new Api.messages.CheckChatInvite({ hash: inviteHash }));
      // Якщо ми вже учасник, об'єкт буде мати поле chat (ChatInviteAlready)
      if (checked && (checked.chat || checked.channel || checked?.className === "ChatInviteAlready")) {
        const chat = checked.chat || checked.channel;
        const peer = buildPeerInfoFromChat(chat);
        return {
          isMember: true,
          status: "member",
          peer,
          referral: {
            groupId: peer?.id,
            peerType: peer?.peerType,
            username: username ?? peer?.username ?? null,
            inviteHash,
          },
        };
      }
      // Не учасник — пробуємо приєднатися
      const upd = await client.invoke(new Api.messages.ImportChatInvite({ hash: inviteHash }));
      const chat = (upd?.chats && upd.chats[0]) || null;
      const peer = buildPeerInfoFromChat(chat);
      return {
        isMember: true,
        status: "joined",
        peer,
        referral: {
          groupId: peer?.id,
          peerType: peer?.peerType,
          username: username ?? peer?.username ?? null,
          inviteHash,
        },
      };
    } catch (e) {
      const msg = String(e?.message || "");
      // Якщо потрібне схвалення адміна (Join Request)
      if (/INVITE_REQUEST_SENT/.test(msg)) {
        return {
          isMember: false,
          status: "pending",
          peer: undefined,
          referral: {
            groupId: undefined,
            peerType: undefined,
            username: username ?? null,
            inviteHash,
          },
          reason: "Invite request sent; waiting for approval.",
        };
      }
      if (/INVITE_HASH_EXPIRED/.test(msg)) {
        return {
          isMember: false,
          status: "failed",
          referral: { username: username ?? null, inviteHash },
          reason: "Invite link expired.",
        };
      }
      if (/USER_BANNED_IN_CHANNEL/.test(msg)) {
        return {
          isMember: false,
          status: "failed",
          referral: { username: username ?? null, inviteHash },
          reason: "User is banned in this channel.",
        };
      }
      return {
        isMember: false,
        status: "failed",
        referral: { username: username ?? null, inviteHash },
        reason: msg,
      };
    }
  }

  // 2) Якщо є username — резолвимо і перевіряємо/приєднуємось
  if (username) {
    try {
      const res = await client.invoke(new Api.contacts.ResolveUsername({ username }));
      const chat = res?.chats?.[0] || null;
      if (!chat) {
        return {
          isMember: false,
          status: "failed",
          referral: { username, inviteHash: null },
          reason: "Username not found or not a channel/group.",
        };
      }
      const peer = buildPeerInfoFromChat(chat);

      // Перевірка членства
      const membership = await isMemberByChannel(chat);
      if (membership.ok && membership.isMember) {
        return {
          isMember: true,
          status: "member",
          peer,
          referral: {
            groupId: peer?.id,
            peerType: peer?.peerType,
            username,
            inviteHash: null,
          },
        };
      }

      // Не учасник — пробуємо приєднатися
      try {
        const upd = await client.invoke(new Api.channels.JoinChannel({ channel: username }));
        const joinedChat = (upd?.chats && upd.chats[0]) || chat;
        const joinedPeer = buildPeerInfoFromChat(joinedChat);
        return {
          isMember: true,
          status: "joined",
          peer: joinedPeer,
          referral: {
            groupId: joinedPeer?.id,
            peerType: joinedPeer?.peerType,
            username,
            inviteHash: null,
          },
        };
      } catch (joinErr) {
        const jmsg = String(joinErr?.message || "");
        if (/USER_ALREADY_PARTICIPANT/.test(jmsg)) {
          return {
            isMember: true,
            status: "member",
            peer,
            referral: {
              groupId: peer?.id,
              peerType: peer?.peerType,
              username,
              inviteHash: null,
            },
          };
        }
        if (/CHANNEL_PRIVATE/.test(jmsg)) {
          return {
            isMember: false,
            status: "failed",
            referral: { username, inviteHash: null },
            reason: "Channel is private; need invite link.",
          };
        }
        if (/USER_BANNED_IN_CHANNEL/.test(jmsg)) {
          return {
            isMember: false,
            status: "failed",
            referral: { username, inviteHash: null },
            reason: "User is banned in this channel.",
          };
        }
        return {
          isMember: false,
          status: "failed",
          referral: { username, inviteHash: null },
          reason: jmsg,
        };
      }
    } catch (e) {
      return {
        isMember: false,
        status: "failed",
        referral: { username, inviteHash: null },
        reason: String(e?.message || ""),
      };
    }
  }

  // 3) Кешований peer (тільки якщо є справжній TL id + accessHash для каналів)
  if (groupLike?.peerType && groupLike?.id && (groupLike.peerType === "chat" || groupLike.accessHash)) {
    try {
      const channel =
        groupLike.peerType === "channel"
          ? new Api.InputPeerChannel({
              channelId: BigInt(groupLike.id),           // Очікується TL id (НЕ -100...)
              accessHash: BigInt(groupLike.accessHash),
            })
          : new Api.InputPeerChat({ chatId: Number(groupLike.id) });

      const membership = await isMemberByChannel(channel);
      if (membership.ok && membership.isMember) {
        // Спробуємо дістати тайтл/юзернейм (опційно)
        let peer = {
          peerType: groupLike.peerType,
          id: String(groupLike.id),
          accessHash: groupLike.accessHash ? String(groupLike.accessHash) : undefined,
          title: groupLike.title,
          username: groupLike.username,
        };
        return {
          isMember: true,
          status: "member",
          peer,
          referral: {
            groupId: peer.id,
            peerType: peer.peerType,
            username: peer.username ?? null,
            inviteHash: null,
          },
        };
      }
      // Якщо не член — без username/invite ми не можемо приєднатись
      return {
        isMember: false,
        status: "failed",
        referral: {
          groupId: String(groupLike.id),
          peerType: groupLike.peerType,
          username: groupLike.username ?? null,
          inviteHash: null,
        },
        reason: "Not a member and no username/invite to join.",
      };
    } catch (e) {
      return {
        isMember: false,
        status: "failed",
        referral: {
          groupId: String(groupLike.id),
          peerType: groupLike.peerType,
          username: groupLike.username ?? null,
          inviteHash: null,
        },
        reason: String(e?.message || ""),
      };
    }
  }

  // Немає достатніх даних для перевірки/приєднання
  return {
    isMember: false,
    status: "failed",
    referral: {
      username: username ?? null,
      inviteHash: inviteHash ?? null,
    },
    reason: "Insufficient data: provide username or invite link (recommended).",
  };
}