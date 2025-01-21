import { Message } from '../../shared/models/Chat';

interface ChatMessageProps {
    message: Message;
    isOwnMessage: boolean;
}

const ChatMessage = ({ message, isOwnMessage }: ChatMessageProps) => {
    return (
        <div
            className={`flex ${
                isOwnMessage ? 'justify-end' : 'justify-start'
            } mb-2`}
        >
            <div
                className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                    isOwnMessage
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                }`}
            >
                <p>{message.content}</p>
                <div className={`text-xs mt-1 ${
                    isOwnMessage ? 'text-gray-200' : 'text-gray-500'
                }`}>
                    {message.formattedTime}
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;