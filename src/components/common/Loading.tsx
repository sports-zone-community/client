const LoadingSpinner = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white/80">
            <div className="relative w-24 h-24">
                <div className="absolute w-full h-full rounded-full border-4 border-t-blue-500 border-b-blue-700 border-l-blue-600 border-r-blue-400 animate-spin" />
                <div className="absolute top-2 left-2 w-20 h-20 rounded-full border-4 border-t-blue-400 border-b-blue-600 border-l-blue-500 border-r-blue-300 animate-spin-reverse" />
                <div className="absolute top-[42%] left-[42%] w-4 h-4 bg-blue-500 rounded-full animate-pulse" />
            </div>
        </div>
    );
};

export default LoadingSpinner;
