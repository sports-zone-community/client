import { Chat, Message } from '../models';

export const mockChats: Chat[] = [
    {
        chatId: "1",
        chatName: "shlomi gueta",
        isGroup: false,
        lastMessage: {
            messageId: "1",
            chatId: "1",
            content: "Hello! This is a test message",
            timestamp: "2025-01-20T21:32:02.263Z",
            formattedTime: "23:32",
            isRead: true,
            read: ["678828ccb1afda3f98a74376"],
            sender: {
                id: "678828ccb1afda3f98a74376",
                name: "or cohen",
                username: "orcohen10"
            }
        },
        unreadCount: 1
    },
    // Add more mock chats...
];

export const mockMessages: Message[] = [
    {
        messageId: "1",
        chatId: "1",
        content: "Hey there!",
        sender: {
            id: "678828ccb1afda3f98a74376",
            name: "or cohen",
            username: "orcohen10"
        },
        timestamp: "2025-01-20T21:27:48.543Z",
        formattedTime: "23:27",
        isRead: true,
        read: ["678828ccb1afda3f98a74376"]
    },
    {
        messageId: "2",
        chatId: "1",
        content: "How are you?",
        sender: {
            id: "67882ae2b1afda3f98a7437c",
            name: "shlomi gueta",
            username: "shlomigueta10"
        },
        timestamp: "2025-01-20T21:28:48.543Z",
        formattedTime: "23:28",
        isRead: true,
        read: ["678828ccb1afda3f98a74376"]
    },
    // Add more messages with matching chatIds...
]; 