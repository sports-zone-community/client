import { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import AiSuggestionModal from '../../chat/AiSuggestionModal.tsx';

export interface DescriptionInputProps {
  registration: UseFormRegisterReturn;
  error?: FieldError;
}

const DescriptionInput = ({ registration, error }: DescriptionInputProps) => {
  const [isAiSuggestionModalOpen, setIsAiSuggestionModalOpen] = useState(false);

  return (
    <div className="space-y-2">
      {isAiSuggestionModalOpen && (
        <AiSuggestionModal onClose={() => setIsAiSuggestionModalOpen(false)} />
      )}
      <div className="flex flex-row items-center">
        <label className="text-lg text-gray-300">Post Description</label>
        <SparklesIcon
          className="h-5 w-5 ml-auto text-yellow-400 cursor-pointer"
          aria-hidden="true"
          onClick={() => setIsAiSuggestionModalOpen(true)}
        />
      </div>
      <textarea
        {...registration}
        className={`
          h-24
          w-full
          rounded-xl
          border
          bg-gray-800
          p-4
          text-gray-100
          ${error ? 'border-red-500' : 'border-gray-700'}
          focus:ring-2
          focus:ring-blue-500
        `}
        placeholder="Write your description..."
      />
      {error && <p className="text-sm text-red-400">{error.message}</p>}
    </div>
  );
};

export default DescriptionInput;
