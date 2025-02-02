import { UserChat } from "./UserChat";

export interface Message {
    messageId: string;
    chatId: string;
    content: string;
    sender: UserChat;
    timestamp: string;
    formattedTime: string;
    isRead: boolean;
    read: string[];
}