import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { createPost } from '../../features/api/posts.ts';
import ImageInput from '../../components/post/components/ImageInput.tsx';
import DescriptionInput from '../../components/post/components/DescriptionInput.tsx';
import GroupsInput from '../../components/post/components/GroupsInput.tsx';

const addPostSchema = z.object({
  image: z.instanceof(File),
  description: z
    .string()
    .min(1, { message: 'Content cannot be empty' })
    .max(100, { message: 'Content must be less than 100 characters' }),
  groupId: z.string(),
});

export type AddPostFormInputs = z.infer<typeof addPostSchema>;

const AddPost = () => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<AddPostFormInputs>({
    resolver: zodResolver(addPostSchema),
    mode: 'onChange',
  });

  const onSubmitForm = async (data: AddPostFormInputs) => {
    const { image, description, groupId } = data;

    try {
      await createPost(image, description, groupId);
      toast.success('Post Created Successfully!');
    } catch (error) {
      console.error('Failed to create post', error);
      toast.error('Failed to create post');
    }

    reset();
    setPreviewImage(null);
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto bg-gray-900 rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="w-120 p-8">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <h1 className="text-3xl font-bold text-gray-100">Create New Post</h1>
          </div>

          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
            <ImageInput
              previewImage={previewImage}
              setPreviewImage={setPreviewImage}
              registration={register('image')}
              setValue={setValue}
              error={errors.image}
            />
            <DescriptionInput registration={register('description')} error={errors.description} />
            <GroupsInput registration={register('groupId')} />

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
              Create Post
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AddPost;
