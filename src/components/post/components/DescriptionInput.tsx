import { FieldError, UseFormRegisterReturn } from 'react-hook-form';

export interface DescriptionInputProps {
  registration: UseFormRegisterReturn;
  error?: FieldError;
}

const DescriptionInput = ({ registration, error }: DescriptionInputProps) => {
  return (
    <div className="space-y-2">
      <label className="text-lg text-gray-300">Post Description</label>
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
