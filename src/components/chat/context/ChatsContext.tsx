import { createContext } from 'react';
import { Chat } from '../../../shared/models/chat/Chat.ts';
import { Message } from '../../../shared/models/chat/Message.ts';
interface ChatsContextType {
  chats: Chat[];
  getChats: (isGroupChat: boolean) => Promise<void>;
  getChatMessagesById: (chatId: string) => Promise<void>;
  messages: Message[];
  unreadCounts: Record<string, number>,
  activeChat: string | null
  isLoading: boolean;
  error: string | null;
  enterChat: (chatId: string) => void,
  leaveChat: () => void,
  setError: (error: string | null) => void;
  sendMessage: (content: string, chatId: string, isGroup: boolean) => Promise<void>;
  joinGroup: (groupId: string) => Promise<void>;
  followUser: (followedUserId: string) => Promise<void>;
}

export const ChatsContext = createContext<ChatsContextType | undefined>(undefined);
