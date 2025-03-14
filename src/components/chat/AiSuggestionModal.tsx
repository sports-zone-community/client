import { useState } from 'react';
import { getSuggestion } from '../../features/api/chats.ts';

interface AiSuggestionModalProps {
  onClose: () => void;
}

const AiSuggestionModal = ({ onClose }: AiSuggestionModalProps) => {
  const [step, setStep] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');

  const handleSubmit = async () => {
    if (step === 0 && userInput.trim()) {
      const suggestion = await getSuggestion(userInput);
      setAiResponse(suggestion);
      setStep(1);
    }
  };

  const handleClose = () => {
    setStep(0);
    setUserInput('');
    setAiResponse('');
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50" onClick={handleClose}></div>
      <div className="relative bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6 z-10">
        {step === 0 && (
          <>
            <h2 className="text-xl font-semibold mb-4">Chat with AI</h2>
            <p className="mb-4">What is your post about?</p>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:border-blue-500"
              placeholder="Type your answer here..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <h2 className="text-xl font-semibold mb-4">AI Response</h2>
            <p className="mb-4">{aiResponse}</p>
            <div className="flex justify-end">
              <button
                onClick={handleClose}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AiSuggestionModal;
