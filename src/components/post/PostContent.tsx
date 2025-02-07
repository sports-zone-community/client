import { useEffect, useRef, useState } from "react";

export interface PostContentProps {
    content: string;
}

const PostContent = ({ content }: PostContentProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isClamped, setIsClamped] = useState(false);
    const contentRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (contentRef.current) {
            setIsClamped(
                contentRef.current.scrollHeight >
                    contentRef.current.clientHeight
            );
        }
    }, [content]);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };
    return (
        <div className="w-full h-12">
            <span
                ref={contentRef}
                className={`text-xs text-white ${isExpanded ? "" : "line-clamp-2"}`}
            >
                {content}
            </span>
            {isClamped && (
                <button
                    onClick={toggleExpand}
                    className={`text-blue-500 text-xs cursor-pointer ${isExpanded ? "ml-1" : ""}`}
                >
                    {isExpanded ? "Show less" : "Read more"}
                </button>
            )}
        </div>
    );
};

export default PostContent;
