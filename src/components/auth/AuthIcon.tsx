type AuthIconProps = {
    icon: string;
    title: string;
    onClick: () => void;
};

const AuthIcon = ({ icon, title, onClick }: AuthIconProps) => {
    return (
        <div
            onClick={onClick}
            className="flex flex-row justify-center items-center bg-none border border-gray-500 w-full rounded-3xl hover:bg-gray-800 hover:border-gray-400 transition-all cursor-pointer"
        >
            <div className="flex flex-row items-center gap-1">
                <img src={icon} className="size-6" />
                <span className="text-white text-sm">{title}</span>
            </div>
        </div>
    );
};

export default AuthIcon;
