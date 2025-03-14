import { AxiosResponse } from 'axios';
import { Chat, Message } from '../../shared/models';
import api from './api.ts';
import { config } from '../../config';

export const fetchChats = async (isGroupChat: boolean = false): Promise<Chat[]> => {
  const response: AxiosResponse<Chat[]> = await api.get<Chat[]>('chats', {
    params: { isGroupChat },
  });
  return response.data.map((chat) => ({
    ...chat,
    image: chat.image ? `${config.apiUrl}/${chat.image}` : chat.image,
  }));
};

export const markMessagesAsRead = async (chatId: string): Promise<void> => {
  const response: AxiosResponse<void> = await api.put(`chats/${chatId}/read`);
  return response.data;
};

export const getUnreadMessages = async (): Promise<Message[]> => {
  const response: AxiosResponse<Message[]> = await api.get<Message[]>('chats/messages/unread');
  return response.data;
};

export const getSuggestion = async (prompt: string): Promise<string> => {
  const response = await api.post<{ suggestion: string }>('chats/ai/suggestion', { prompt });
  return response.data.suggestion;
};

export const getChatMessages = async (chatId: string): Promise<Message[]> => {
  const response: AxiosResponse<Message[]> = await api.get<Message[]>(`chats/${chatId}`);
  return response.data;
};
