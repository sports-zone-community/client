import { ReactNode, useState, useEffect, useCallback } from 'react';
import { Chat, Message } from '../../../shared/models';
import { fetchChats, getChatMessages, getUnreadMessages, markMessagesAsRead } from '../../../features/api/chats';
import { ChatsContext } from './ChatsContext';
import { useAuth } from '../../../shared/hooks/useAuth';
import { useSocket } from '../../../services/socket/SocketContext';
import { GroupJoinedEvent, UnreadMessageEvent } from '../../../shared/models/chat/SocketEvents';

export const ChatsProvider = ({ children }: { children: ReactNode }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const socket = useSocket();

  const getChats = useCallback(async (isGroupChat: boolean = false) => {
    try {
      setIsLoading(true);
      setError(null);
      const newChats: Chat[] = await fetchChats(isGroupChat);
      setChats(newChats);
    } catch (err) {
      console.error('Error fetching chats:', err);
      setError('Failed to fetch chats');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getChatMessagesById = useCallback(async (chatId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const messages: Message[] = await getChatMessages(chatId);
      setMessages([]);
      messages.sort((a: Message, b: Message) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      setMessages(messages);
    } catch (err) {
      console.error('Error fetching chat messages:', err);
      setError('Failed to fetch chat messages');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const enterChat = useCallback(async (chatId: string) => {
    if (!user) return;
    
    try {
      if (activeChat) {
        socket.leaveChat(user._id, activeChat);
      }

      setMessages([]);
      
      socket.enterChat(chatId);
      setActiveChat(chatId);

      await getChatMessagesById(chatId);
      await markMessagesAsRead(chatId);
      
      setUnreadCounts(prev => ({ ...prev, [chatId]: 0 }));
      
      setChats(prev => 
        prev.map(chat => 
          chat.chatId === chatId 
            ? { ...chat, unreadCount: 0 }
            : chat
        )
      );

    } catch (err) {
      console.error('Error entering chat:', err);
      setError('Failed to enter chat');
    }
  }, [activeChat, user, socket, getChatMessagesById]);

  const joinGroup = useCallback(async (groupId: string) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      socket.joinGroup(user._id, groupId);
    } catch (err) {
      console.error('Error joining group:', err);
      setError('Failed to join group');
    } finally {
      setIsLoading(false);
    }
  }, [user, socket]);

  useEffect(() => {
    if (user) {
      getChats();
    }
  }, [user, getChats]);

  useEffect(() => {
    const loadUnreadMessages = async () => {
      if (!user) return;
      
      try {
        const unreadMessages: Message[] = await getUnreadMessages();
        const unreadCounts: Record<string, number> = {};
        
        unreadMessages.forEach((message: Message) => {
          unreadCounts[message.chatId] = (unreadCounts[message.chatId] || 0) + 1;
        });
        
        setUnreadCounts(unreadCounts);
      } catch (err) {
        console.error('Error loading unread messages:', err);
      }
    };

    loadUnreadMessages();
  }, [user]);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      const chatContainer = document.querySelector('.chat-messages-container');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 100);
  }, []);

  const sendMessage = useCallback(async (content: string, chatId: string, isGroup: boolean) => {
    if (!user) return;
    
    try {
      const now = new Date();
      const newMessage: Message = {
        messageId: now.getTime().toString(),
        chatId,
        content,
        sender: {
          id: user._id,
          name: user.name,
          username: user.username
        },
        timestamp: now.toISOString(),
        formattedTime: now.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }),
        isRead: true,
        read: [user._id]
      };

      setMessages(prev => [...prev, newMessage]);
      scrollToBottom();

      setChats(prev => {
        const updatedChats = [...prev];
        const chatIndex = updatedChats.findIndex(chat => chat.chatId === chatId);
        
        if (chatIndex !== -1) {
          const updatedChat = {
            ...updatedChats[chatIndex],
            lastMessage: newMessage
          };
          
          updatedChats.splice(chatIndex, 1);
          updatedChats.unshift(updatedChat);
        }
        
        return updatedChats;
      });

      if (isGroup) {
        socket.sendGroupMessage(content, chatId, user.name);
      } else {
        socket.sendPrivateMessage(content, chatId, user.name);
      }

    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
      
      setMessages(prev => prev.filter(msg => msg.messageId !== Date.now().toString()));
    }
  }, [user, socket, scrollToBottom]);

  const handleNewMessage = useCallback(async (message: Message) => {
    console.log('New message received:', message, 'Active chat:', activeChat);
    
    const chatExists: boolean = chats.some(chat => chat.chatId === message.chatId);
    const isDirectMessage: boolean = !chats.find(chat => chat.chatId === message.chatId)?.isGroupChat;
    
    if (!chatExists && isDirectMessage) {
      await getChats(false);
    }

    if (message.chatId === activeChat) {
      setMessages(prev => {
        const newMessages = [...prev, message];
        scrollToBottom();
        return newMessages;
      });
      
      if (message.sender.id !== user?._id) {
        socket.enterChat(message.chatId);
      }
    } 
    else if (message.sender.id !== user?._id) {
      setUnreadCounts(prev => ({
        ...prev,
        [message.chatId]: (prev[message.chatId] || 0) + 1
      }));
    }
    
    setChats(prev => {
      const updatedChats = [...prev];
      const chatIndex = updatedChats.findIndex(chat => chat.chatId === message.chatId);
      
      if (chatIndex === -1 && isDirectMessage) {
        const newChat: Chat = {
          chatId: message.chatId,
          participants: [
            message.sender.id,
            user?._id || ''
          ],
          chatName: message.sender.name,
          lastMessage: message,
          isGroupChat: false,
          unreadCount: message.sender.id !== user?._id ? 1 : 0
        };
        
        return [newChat, ...updatedChats];
      }
      
      if (chatIndex !== -1) {
        const chat = { ...updatedChats[chatIndex], lastMessage: message };
        
        if (message.chatId !== activeChat && message.sender.id !== user?._id) {
          chat.unreadCount = (chat.unreadCount || 0) + 1;
        }
        
        updatedChats.splice(chatIndex, 1);
        updatedChats.unshift(chat);
      }
      
      return updatedChats;
    });
  }, [activeChat, user, chats, getChats, socket, scrollToBottom]);

  useEffect(() => {
    if (!user) return;

    const handleUnreadMessage = (data: UnreadMessageEvent) => {
      
      if (data.chatId !== activeChat) {
        setUnreadCounts(prev => ({
          ...prev,
          [data.chatId]: (prev[data.chatId] || 0) + 1
        }));
      }

      const messageDate = new Date(data.timestamp);
      const newMessage: Message = {
        messageId: Date.now().toString(),
        chatId: data.chatId,
        content: data.content,
        sender: {
          id: data.sender,
          name: data.senderName,
          username: ''
        },
        timestamp: messageDate.toISOString(),
        formattedTime: messageDate.toLocaleTimeString('he-IL', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        isRead: false,
        read: []
      };

      if (data.chatId === activeChat) {
        setMessages(prev => {
          const newMessages = [...prev, newMessage];
          scrollToBottom();
          return newMessages;
        });
        socket.enterChat(data.chatId);
      }

      setChats(prev => {
        const updatedChats = [...prev];
        const chatIndex = updatedChats.findIndex(chat => chat.chatId === data.chatId);
        
        if (chatIndex !== -1) {
          const updatedChat = {
            ...updatedChats[chatIndex],
            lastMessage: newMessage,
            unreadCount: data.chatId !== activeChat 
              ? (updatedChats[chatIndex].unreadCount || 0) + 1 
              : updatedChats[chatIndex].unreadCount
          };
          
          updatedChats.splice(chatIndex, 1);
          updatedChats.unshift(updatedChat);
        }
        
        return updatedChats;
      });
    };

    const handleGroupJoined = (data: GroupJoinedEvent) => {
      if (data.success) {
        getChats(true);
        
        if (data.chatId) {
          enterChat(data.chatId);
        }
      }
    };

    const handleNewChat = (chat: Chat) => {
      const isGroup: boolean = chat.isGroupChat || false;
      
      setChats(prev => {

        const exists: boolean = prev.some((c: Chat) => c.chatId === chat.chatId);
        if (exists) return prev;
        
        const currentFilter: boolean = prev.some((c: Chat) => c.isGroupChat) === isGroup;
        if (!currentFilter) {
          getChats(isGroup);
          return prev;
        }
        
        return [chat, ...prev];
      });
    };

    const handleMessagesRead = (data: { chatId: string, userId: string }) => {
      if (data.chatId === activeChat && data.userId !== user._id) {
        setMessages(prev => prev.map(message => ({
          ...message,
          read: [...(message.read || []), data.userId],
          isRead: true
        })));
      }
    };

    const handleError = (error: Error) => {
      console.error('Socket error:', error);
      setError(error.message);
    };

    const unsubscribeNewMessage = socket.onNewMessage(handleNewMessage);
    const unsubscribeUnreadMessage = socket.onUnreadMessage(handleUnreadMessage);
    const unsubscribeGroupJoined = socket.onGroupJoined(handleGroupJoined);
    const unsubscribeNewChat = socket.onNewChat(handleNewChat);
    const unsubscribeEnterChat = socket.onEnterChat(handleMessagesRead);
    const unsubscribeError = socket.onSocketError(handleError);
    return () => {
      unsubscribeNewMessage();
      unsubscribeUnreadMessage();
      unsubscribeGroupJoined();
      unsubscribeNewChat();
      unsubscribeError();
      unsubscribeEnterChat();
      if (activeChat) {
        leaveChat();
      }
    };
  }, [user, socket, activeChat, getChats, enterChat]);

  const leaveChat = useCallback(() => {
    if (activeChat && user) {
      socket.leaveChat(user._id, activeChat);
      setActiveChat(null);
    }
  }, [user, socket]);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (activeChat && user) {
      setUnreadCounts(prev => ({ ...prev, [activeChat]: 0 }));
      setChats(prev => 
        prev.map(chat => 
          chat.chatId === activeChat 
            ? { ...chat, unreadCount: 0 }
            : chat
        )
      );
    }
  }, [activeChat, user]);

  return (
    <ChatsContext.Provider value={{ 
      chats,
      messages,
      activeChat,
      unreadCounts,
      isLoading,
      error,
      enterChat,
      setError,
      getChatMessagesById,
      leaveChat,
      sendMessage,
      getChats,
      joinGroup
    }}>
      {children}
    </ChatsContext.Provider>
  );
};