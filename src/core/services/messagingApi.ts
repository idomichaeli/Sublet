export interface ChatMessage {
  id: string;
  fromUserId: string;
  toUserId: string;
  body: string;
  sentAt: Date;
}

export async function fetchMessages(_peerId: string): Promise<ChatMessage[]> {
  return [];
}

export async function sendMessage(message: Omit<ChatMessage, "id" | "sentAt">): Promise<ChatMessage> {
  return { ...message, id: String(Date.now()), sentAt: new Date() } as ChatMessage;
}


