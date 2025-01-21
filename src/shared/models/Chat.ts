export interface User {
    id: string;
    name: string;
    username: string;
}

export interface Message {
    messageId: string;
    chatId: string;
    content: string;
    sender: User;
    timestamp: string;
    formattedTime: string;
    isRead: boolean;
    read: string[];
}

export interface Chat {
    chatId: string;
    chatName: string;
    lastMessage: Message;
    unreadCount: number;
    isGroup?: boolean;
} 