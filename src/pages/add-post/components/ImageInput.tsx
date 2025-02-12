import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { FieldError, UseFormRegisterReturn, UseFormSetValue } from 'react-hook-form';
import { AddPostFormInputs } from '../AddPost.tsx';

export interface ImageInputProps {
  previewImage: string | null;
  setPreviewImage: (value: string | null) => void;
  registration: UseFormRegisterReturn;
  setValue: UseFormSetValue<AddPostFormInputs>;
  error?: FieldError;
}

const ImageInput = ({
  previewImage,
  setPreviewImage,
  registration,
  setValue,
  error,
}: ImageInputProps) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        alert('Only JPEG and PNG images are allowed');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('Image must be less than 5MB');
        return;
      }

      setValue('image', file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-lg font-medium text-gray-300">Post Image</label>
      <div
        className={`
          relative
          h-56
          w-full
          overflow-hidden
          rounded-xl
          border-2
          border-dashed
          bg-gray-800
          p-4
          transition-colors
          ${previewImage ? 'border-blue-500' : 'border-gray-700'}
          hover:border-blue-400
        `}
      >
        <input
          {...registration}
          type="file"
          accept="image/jpeg,image/png"
          className="hidden"
          id="post-image"
          onChange={handleImageChange}
        />
        <label
          htmlFor="post-image"
          className="flex h-full w-full cursor-pointer items-center justify-center"
        >
          {previewImage ? (
            <div className="relative h-full w-full group">
              <img
                src={previewImage}
                alt="Preview"
                className="h-full w-full rounded-lg object-cover"
              />
              <div
                className="
                absolute
                inset-0
                flex
                items-center
                justify-center
                rounded-lg
                bg-black
                bg-opacity-60
                opacity-0
                transition-opacity
                group-hover:opacity-100
              "
              >
                <p className="text-gray-200 font-medium">Change Image</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2">
              <CloudArrowUpIcon className="h-16 w-16 text-blue-400" />
              <p className="text-sm text-gray-400">Click to upload group image</p>
              <p className="text-xs text-gray-500">PNG, JPG less than 5MB</p>
            </div>
          )}
        </label>
      </div>
      {error && <p className="text-sm text-red-400 mt-1">{error.message}</p>}
    </div>
  );
};

export default ImageInput;
