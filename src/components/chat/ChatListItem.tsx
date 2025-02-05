import { Chat } from '../../shared/models/chat/Chat';

interface ChatListItemProps {
    chat: Chat;
    isSelected: boolean;
    onClick: (chatId: string) => void;
}

const ChatListItem = ({ chat, isSelected, onClick }: ChatListItemProps) => {
    const handleClick = (): void => {
        onClick(chat.chatId);
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className={`w-full text-left flex items-center p-4 hover:bg-gray-800 transition-colors ${
                isSelected ? 'bg-gray-800' : ''
            }`}
        >
            <div className="w-12 h-12 rounded-full bg-gray-600 mr-4 flex-shrink-0" />
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-white truncate">{chat.chatName}</h3>
                    <span className="text-sm text-gray-400 ml-2 flex-shrink-0">
                        {chat.lastMessage.formattedTime}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-400 truncate">
                        {chat.lastMessage.content}
                    </p>
                    {chat.unreadCount > 0 && (
                        <span className="ml-2 bg-blue-500 text-white text-xs rounded-full px-2 py-0.5 flex-shrink-0">
                            {chat.unreadCount}
                        </span>
                    )}
                </div>
            </div>
        </button>
    );
};

export default ChatListItem;