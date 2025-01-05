interface PopupProps {
    message: string;
    onClose: () => void;
}

const Popup = ({ message, onClose }: PopupProps) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md flex flex-col items-center justify-center text-center">
                <p className="text-gray-600 mb-6">{message}</p>
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default Popup;
