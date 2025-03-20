import { useState, useCallback, useEffect, useMemo } from 'react';
import ChatSidebar from '../../components/chat/ChatSidebar';
import ChatHeader from '../../components/chat/ChatHeader';
import ChatMessage from '../../components/chat/ChatMessage';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { Chat, Message } from '../../shared/models';
import { ChatFilter } from '../../shared/enums/ChatFilter';
import { useChats } from '../../shared/hooks/useChats';
import { useAuth } from '../../shared/hooks/useAuth';


const Inbox: React.FC = () => {
    const [selectedChat, setSelectedChat] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [messageInput, setMessageInput] = useState('');
    const { chats, getChats, isLoading, enterChat, sendMessage, messages, chatFilter, onChangeChatFilter } = useChats();
    const {user} = useAuth();

    const handleChatSelect = useCallback(async (chatId: string) => {
        if (chatId === selectedChat) return;
        
        setSelectedChat(chatId);
        enterChat(chatId);
    }, [selectedChat, enterChat]);

    const handleSendMessage = async (): Promise<void> => {
        if (!messageInput.trim() || !selectedChat) return;

        try {
            const isGroup: boolean = currentChat?.isGroupChat || false;
            await sendMessage(messageInput.trim(), selectedChat, isGroup);
            setMessageInput('');
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    const filteredChats: Chat[] = useMemo(() => {
        return chats.filter((chat: Chat) => {
            const matchesFilter: boolean | undefined = 
            chatFilter === ChatFilter.DIRECT ? !chat.isGroupChat : chat.isGroupChat;

            const matchesSearch: boolean = chat.chatName?.toLowerCase()?.includes(searchTerm.toLowerCase());
            
            return matchesFilter && matchesSearch;
        });
    }, [chats, chatFilter, searchTerm]);

    const currentChat: Chat | undefined = chats.find((chat: Chat) => chat.chatId === selectedChat);

    useEffect(() => {
        getChats(chatFilter === ChatFilter.GROUPS);
    }, [chatFilter]);

    useEffect(() => {
        if (messages.length > 0) {
            const chatContainer: HTMLElement | null = document.querySelector('.overflow-y-auto');
            if (chatContainer) {
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }
        }
    }, [messages]);

    return (
        <div className="flex h-screen bg-gray-50">
            <ChatSidebar 
                chatFilter={chatFilter}
                searchTerm={searchTerm}
                selectedChat={selectedChat}
                onFilterChange={onChangeChatFilter}
                onSearchChange={setSearchTerm}
                onChatSelect={handleChatSelect}
                chats={filteredChats}
            />

            <div className="flex-1 flex flex-col bg-white">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
                    </div>
                ) : currentChat ? (
                    <>
                        <ChatHeader 
                            chatName={currentChat.chatName} 
                            isOnline={true} 
                            image={currentChat.image}
                        />
                        <div className="flex-1 overflow-y-auto chat-messages-container p-4 bg-white">
                            {messages.map((message: Message) => (
                                <ChatMessage
                                    key={message.messageId}
                                    message={message}
                                    isOwnMessage={message.sender.id === user?._id}
                                />
                            ))}
                            {messages.length === 0 && (
                                <div className="h-full flex items-center justify-center text-gray-500 text-center text-xl">
                                    No messages yet so start chatting now :)
                                </div>
                            )}
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
                                    disabled={!currentChat}
                                />
                                <button 
                                    onClick={handleSendMessage}
                                    disabled={!messageInput.trim() || !currentChat}
                                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-white
                                        ${messageInput.trim() && currentChat 
                                            ? 'bg-blue-600 hover:bg-blue-700' 
                                            : 'bg-gray-400 cursor-not-allowed'}`}
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