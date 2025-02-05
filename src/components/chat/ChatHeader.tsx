interface ChatHeaderProps {
    chatName: string;
    isOnline?: boolean;
}

const ChatHeader = ({ chatName, isOnline = false }: ChatHeaderProps) => {
    return (
        <div className="flex items-center p-4 bg-white border-b">
            <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gray-300 mr-3" />
                {isOnline && (
                    <div className="absolute bottom-0 right-2 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
            </div>
            <div>
                <h2 className="font-semibold text-gray-800">{chatName}</h2>
                <span className="text-sm text-gray-500">
                    {isOnline ? 'Online' : 'Offline'}
                </span>
            </div>
        </div>
    );
};

export default ChatHeader;