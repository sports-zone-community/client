import { IoIosArrowDown } from 'react-icons/io';
import { IoSearchOutline } from 'react-icons/io5';
import { Chat } from '../../shared/models/chat/Chat';
import ChatListItem from './ChatListItem';
import { ChatFilter } from '../../shared/enums/ChatFilter';
import { useChats } from '../../shared/hooks/useChats';

interface ChatSidebarProps {
    chatFilter: ChatFilter;
    searchTerm: string;
    selectedChat: string | null;
    onFilterChange: () => void;
    onSearchChange: (value: string) => void;
    onChatSelect: (chatId: string) => void;
    chats: Chat[];
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
    chatFilter,
    searchTerm,
    selectedChat,
    onFilterChange,
    onSearchChange,
    onChatSelect,
    chats
}: ChatSidebarProps) => {
    const {isLoading} = useChats();
    return (
        <div className="w-80 bg-[#1a1a1a] border-r border-gray-700 flex flex-col overflow-y-auto">
            <div className="p-4 flex-shrink-0">
                <button 
                    onClick={onFilterChange}
                    className="flex w-full items-center justify-between text-lg font-semibold text-white mb-4"
                >
                    {chatFilter === ChatFilter.DIRECT ? 'Direct Messages' : 'Groups'}
                    <IoIosArrowDown className={`text-gray-400 transform transition-transform ${
                        chatFilter === 'groups' ? 'rotate-180' : ''
                    }`} />
                </button>
                <div className="relative">
                    <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full bg-gray-800 text-gray-200 pl-10 pr-4 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-600"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
                    </div>
                ) : (
                    chats.map((chat: Chat) => (
                        <ChatListItem
                            key={chat.chatId}
                            chat={chat}
                            isSelected={chat.chatId === selectedChat}
                            onClick={onChatSelect}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default ChatSidebar;