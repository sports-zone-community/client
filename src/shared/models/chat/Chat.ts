import { Message } from "./Message";

export interface Chat {
    chatId: string;
    chatName: string;
    lastMessage: Message;
    unreadCount: number;
    isGroup?: boolean;
} 