import io from 'socket.io-client';
import {Socket} from 'socket.io-client';
import { config } from '../../config';
import { Chat, Message } from '../../shared/models';
import { ChatEvent, UnreadMessageEvent, GroupJoinedEvent, MessageReadEvent } from '../../shared/models/chat/SocketEvents';

interface SocketEvents {
  'authenticated': { success: boolean };
  'new message': ChatEvent;
  'unread message': UnreadMessageEvent;
  'group:joined': GroupJoinedEvent;
  'chatCreated': Chat;
  'enterChat': { chatId: string; userId: string };
  'leaveChat': { userId: string; chatId: string };
  'joinGroup': { userId: string; groupId: string };
  'followUser': { userId: string; followedUserId: string };
  'error': Error;
  'disconnect': void;
}

class SocketService {
  private socket: typeof Socket | null = null;
  private messageHandlers: Set<(message: Message) => void> = new Set();
  private unreadMessageHandlers: Set<(data: UnreadMessageEvent) => void> = new Set();
  private messageReadHandlers: Set<(data: MessageReadEvent) => void> = new Set();
  private activeChatId: string | null = null;

  connect(token: string) {
    if (this.socket?.connected) return;

    this.socket = io(config.apiUrl, {
      auth: { token },
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('authenticated', (data: { success: boolean }) => {
      if (data.success) {
        console.log('Socket authenticated:', data);
      }
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
      this.activeChatId = null;
    });

    this.socket.on('new message', (event: ChatEvent) => {
      this.messageHandlers.forEach(handler => handler(event.message));
    });

    this.socket.on('unread message', (data: UnreadMessageEvent) => {
      this.unreadMessageHandlers.forEach(handler => handler(data));
    });

    this.socket.on('messages:read', (data: MessageReadEvent) => {
      this.messageReadHandlers.forEach(handler => handler(data));
    });

    this.socket.on('error', (error: Error) => {
      console.error('Socket error:', error);
    });
  }

  sendPrivateMessage(content: string, to: string, senderName: string) {
    if (!this.socket?.connected) {
      throw new Error('Socket not connected');
    }
    this.socket.emit('private message', { content, to, senderName });
  }

  sendGroupMessage(content: string, groupId: string, senderName: string) {
    if (!this.socket?.connected) {
      throw new Error('Socket not connected');
    }
    this.socket.emit('group message', { content, groupId, senderName });
  }

  enterChat(chatId: string) {
    if (!this.socket?.connected) {
      throw new Error('Socket not connected');
    }
    this.activeChatId = chatId;
    this.socket.emit('enterChat', { chatId });
  }

  leaveChat(userId: string, chatId: string) {
    if (!this.socket?.connected) {
      throw new Error('Socket not connected');
    }
    this.activeChatId = null;
    this.socket.emit('leaveChat', { userId, chatId });
  }

  joinGroup(userId: string, groupId: string) {
    if (!this.socket?.connected) {
      throw new Error('Socket not connected');
    }
    this.socket.emit('joinGroup', { userId, groupId });
  }

  followUser(userId: string, followedUserId: string) {
    if (!this.socket?.connected) {
      throw new Error('Socket not connected');
    }
    this.socket.emit('followUser', { userId, followedUserId });
  }

  onNewMessage(handler: (message: Message) => void) {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  onUnreadMessage(handler: (data: UnreadMessageEvent) => void) {
    this.unreadMessageHandlers.add(handler);
    return () => this.unreadMessageHandlers.delete(handler);
  }

  onGroupJoined(handler: (data: GroupJoinedEvent) => void) {
    if (!this.socket) return () => {};
    this.socket.on('group:joined', handler);
    return () => this.socket?.off('group:joined', handler);
  }

  onChatCreated(handler: (chat: Chat) => void) {
    if (!this.socket) return () => {};
    this.socket.on('chatCreated', handler);
    return () => this.socket?.off('chatCreated', handler);
  }

  onSocketError(handler: (error: Error) => void) {
    if (!this.socket) return () => {};
    this.socket.on('error', handler);
    return () => this.socket?.off('error', handler);
  }

  onMessagesRead(handler: (data: MessageReadEvent) => void) {
    this.messageReadHandlers.add(handler);
    return () => this.messageReadHandlers.delete(handler);
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  disconnect(): void {
    if (this.activeChatId) {
      this.leaveChat(this.activeChatId, this.activeChatId);
    }
    this.socket?.disconnect();
    this.socket = null;
  }

  on<K extends keyof SocketEvents>(
    event: K,
    handler: (data: SocketEvents[K]) => void
  ) {
    if (!this.socket) return;
    this.socket.on(event, handler);
  }

  off<K extends keyof SocketEvents>(
    event: K,
    handler: (data: SocketEvents[K]) => void
  ) {
    if (!this.socket) return;
    this.socket.off(event, handler);
  }

  onEnterChat(handler: (data: { chatId: string, userId: string }) => void) {
    if (!this.socket) return () => {};
    this.socket.on('enterChat', handler);
    return () => this.socket?.off('enterChat', handler);
  }
}

export const socketService = new SocketService(); 