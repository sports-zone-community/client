import { Message } from '../../models';

export interface ChatEvent {
  chatId: string;
  message: Message;
}

export interface UnreadMessageEvent {
  chatId: string;
  from: string;
  senderName: string;
  content: string;
  sender: string;
  timestamp: Date;
}

export interface GroupJoinedEvent {
  success: boolean;
  groupId: string;
  chatId: string;
} 

export interface MessageReadEvent {
  chatId: string;
  messageIds: string[];
  userId?: string;
  timestamp?: string;
}