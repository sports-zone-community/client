import { useForm } from 'react-hook-form';
import { IoMdCloudUpload } from 'react-icons/io';
import { FaUsers, FaRunning } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { CreateGroupProps } from '../../shared/interfaces/props/CreateGroupProps';
import { FormInputs } from '../../shared/interfaces/CreateGroupFormInput';

const CreateGroup = ({ onSubmit }: CreateGroupProps) => {
  const { register,  handleSubmit, formState: { errors }, watch } = useForm<FormInputs>();

  const imageFile: File | null = watch('image')?.[0] as File | null;
  const previewUrl: string = imageFile ? URL.createObjectURL(imageFile) : '';

  const onSubmitForm = (data: FormInputs) => {
    const formData: FormData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    if (data.image?.[0]) {
      formData.append('image', data.image[0]);
    }
    onSubmit(formData);
  };

  return (
    <div className="min-h-screen bg-black from-blue-50 to-indigo-100 p-4 sm:p-6 md:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto bg-gray-900 rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <FaUsers className="text-3xl text-blue-500" />
            <h1 className="text-3xl font-bold text-gray-100">Create Group</h1>
          </div>

          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
            <div className="space-y-2">
              <label className="flex items-center text-lg font-medium text-gray-300">
                <FaRunning className="mr-2" />
                Group Name
              </label>
              <input
                {...register('name', { 
                  required: 'Group name is required',
                  minLength: { value: 3, message: 'Name must be at least 3 characters' }
                })}
                className={`w-full px-4 py-3 border rounded-xl bg-gray-800
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  transition-all placeholder-gray-500 text-gray-100
                  ${errors.name ? 'border-red-500' : 'border-gray-700'}`}
                placeholder="Enter your group name..."
              />
              {errors.name && (
                <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-lg font-medium text-gray-300">
                Group Image
              </label>
              <div className={`border-2 border-dashed rounded-xl p-4 
                ${previewUrl ? 'border-blue-500' : 'border-gray-700'} 
                hover:border-blue-400 transition-colors cursor-pointer
                bg-gray-800`}>
                <input
                  {...register('image', {
                    required: 'Group image is required'
                  })}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="group-image"
                />
                <label htmlFor="group-image" className="cursor-pointer">
                  {previewUrl ? (
                    <div className="relative group">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-h-64 w-full rounded-lg object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-60 
                        opacity-0 group-hover:opacity-100 transition-opacity
                        rounded-lg flex items-center justify-center">
                        <p className="text-gray-200">Change Image</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <IoMdCloudUpload className="mx-auto h-16 w-16 text-blue-400" />
                      <p className="mt-2 text-sm text-gray-400">Click to upload group image</p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                    </div>
                  )}
                </label>
                {errors.image && (
                  <p className="text-red-400 text-sm mt-2">{errors.image.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-lg font-medium text-gray-300">
                Group Description
              </label>
              <textarea
                {...register('description', {
                  required: 'Description is required',
                  minLength: { value: 10, message: 'Description must be at least 10 characters' }
                })}
                className={`w-full px-4 py-3 border rounded-xl bg-gray-800
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  transition-all min-h-[120px] resize-none placeholder-gray-500
                  text-gray-100 ${errors.description ? 'border-red-500' : 'border-gray-700'}`}
                placeholder="Describe your group..."
              />
              {errors.description && (
                <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-800
                text-gray-100 py-4 px-6 rounded-xl font-medium text-lg
                hover:from-blue-700 hover:to-blue-900 transition-all
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                focus:ring-offset-gray-900 shadow-lg"
            >
              Create Group
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateGroup;
