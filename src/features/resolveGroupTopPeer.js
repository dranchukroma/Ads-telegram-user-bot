import { Api } from "telegram";
import { checkMembershipAndJoin } from "./checkMembershipAndJoin.js";


export async function resolveGroupToPeer(group) {
  // Спочатку перевіряємо/приєднуємось
  const res = await checkMembershipAndJoin(group);

  if (!res.isMember) {
    throw new Error(`Not a member of group: ${res.reason}`);
  }

  const peer = res.peer;

  if (peer?.peerType === "channel" && peer.id && peer.accessHash) {
    return new Api.InputPeerChannel({
      channelId: BigInt(peer.id),
      accessHash: BigInt(peer.accessHash),
    });
  }

  if (peer?.peerType === "chat" && peer.id) {
    return new Api.InputPeerChat({ chatId: Number(peer.id) });
  }

  // як fallback (якщо username зберігся)
  if (peer?.username) {
    return peer.username;
  }

  throw new Error("Cannot resolve group to peer.");
}