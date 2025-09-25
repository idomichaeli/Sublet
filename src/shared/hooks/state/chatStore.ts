import { create } from "zustand";
import { fetchMessages, sendMessage, ChatMessage } from "../../services/chatApi";

type ChatState = {
  messagesByPeer: Record<string, ChatMessage[]>;
  load: (peerId: string) => Promise<void>;
  send: (peerId: string, body: string, fromUserId: string) => Promise<void>;
};

export const useChatStore = create<ChatState>((set, get) => ({
  messagesByPeer: {},
  load: async (peerId) => {
    const msgs = await fetchMessages(peerId);
    set({ messagesByPeer: { ...get().messagesByPeer, [peerId]: msgs } });
  },
  send: async (peerId, body, fromUserId) => {
    const created = await sendMessage({ body, fromUserId, toUserId: peerId });
    const existing = get().messagesByPeer[peerId] || [];
    set({ messagesByPeer: { ...get().messagesByPeer, [peerId]: [...existing, created] } });
  },
}));


