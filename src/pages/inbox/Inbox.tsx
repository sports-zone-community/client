import { useState, useCallback } from 'react';
import { mockChats, mockMessages } from '../../shared/mocks/chatData';
import ChatSidebar from '../../components/chat/ChatSidebar';
import ChatHeader from '../../components/chat/ChatHeader';
import ChatMessage from '../../components/chat/ChatMessage';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { Chat, Message } from '../../shared/models';
import { ChatFilter } from '../../shared/enums/ChatFilter';

const Inbox: React.FC = () => {
    const [selectedChat, setSelectedChat] = useState<string | null>(null);
    const [chatFilter, setChatFilter] = useState<ChatFilter>(ChatFilter.DIRECT);
    const [searchTerm, setSearchTerm] = useState('');
    const [messageInput, setMessageInput] = useState('');
    const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
    const [chats, setChats] = useState<Chat[]>(mockChats);

    const markChatAsRead = useCallback((chatId: string) => {
        setChats(prevChats => 
            prevChats.map((chat: Chat) => 
                chat.chatId === chatId
                    ? { ...chat, unreadCount: 0 }
                    : chat
            )
        );
    }, []);

    const handleChatSelect = useCallback((chatId: string) => {
        if (chatId === selectedChat) return;
        
        setSelectedChat(chatId);
        const messages: Message[] = mockMessages.filter(msg => msg.chatId === chatId);
        setCurrentMessages(messages);
        markChatAsRead(chatId);
    }, [selectedChat, markChatAsRead]);

    const handleSendMessage = (): void => {
        if (!messageInput.trim() || !selectedChat) return;

        const newMessage: Message = {
            messageId: Date.now().toString(),
            chatId: selectedChat,
            content: messageInput,
            sender: {
                id: '678828ccb1afda3f98a74376', // Current user ID
                name: 'Current User',
                username: 'currentuser'
            },
            timestamp: new Date().toISOString(),
            formattedTime: new Date().toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
            }),
            isRead: true,
            read: ['678828ccb1afda3f98a74376']
        };

        setCurrentMessages(prev => [...prev, newMessage]);

        setChats(prevChats =>
            prevChats.map((chat: Chat) =>
                chat.chatId === selectedChat
                    ? { ...chat, lastMessage: newMessage }
                    : chat
            )
        );

        setMessageInput('');
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    const filteredChats: Chat[] = chats.filter((chat: Chat) => {
        const matchesFilter: boolean | undefined = chatFilter === 'direct' ? !chat.isGroup : chat.isGroup;
        const matchesSearch: boolean = chat.chatName.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const currentChat: Chat | undefined = chats.find((chat: Chat) => chat.chatId === selectedChat);

    return (
        <div className="flex h-screen bg-gray-50">
            <ChatSidebar 
                chatFilter={chatFilter}
                searchTerm={searchTerm}
                selectedChat={selectedChat}
                onFilterChange={() => setChatFilter(prev => prev === ChatFilter.DIRECT ? ChatFilter.GROUPS : ChatFilter.DIRECT)}
                onSearchChange={setSearchTerm}
                onChatSelect={handleChatSelect}
                chats={filteredChats}
            />

            <div className="flex-1 flex flex-col bg-white">
                {currentChat ? (
                    <>
                        <ChatHeader 
                            chatName={currentChat.chatName} 
                            isOnline={true} 
                        />
                        <div className="flex-1 overflow-y-auto p-4 bg-white">
                            {currentMessages.map((message: Message) => (
                                <ChatMessage
                                    key={message.messageId}
                                    message={message}
                                    isOwnMessage={message.sender.id === '678828ccb1afda3f98a74376'}
                                />
                            ))}
                        </div>
                        <div className="p-4 bg-white border-t">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Your message"
                                    className="w-full px-4 py-3 bg-gray-100 rounded-full pr-12 focus:outline-none"
                                />
                                <button 
                                    onClick={handleSendMessage}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700"
                                >
                                    <PaperAirplaneIcon className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                        Select a chat to start messaging
                    </div>
                )}
            </div>
        </div>
    );
};

export default Inbox;