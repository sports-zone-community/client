import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { updatePost } from '../../features/api/posts.ts';
import { useNavigate, useParams } from 'react-router-dom';
import ImageInput from '../../components/post/components/ImageInput.tsx';
import DescriptionInput from '../../components/post/components/DescriptionInput.tsx';
import { usePosts } from '../../shared/hooks/usePosts.ts';
import Loading from '../../components/common/Loading.tsx';
import { config } from '../../config.ts';
import { ToastContent } from '../../components/toastContent/toastContent.tsx';
import { ToastType } from '../../shared/enums/ToastType.ts';
import { toastConfig } from '../../shared/functions/toastConfig.ts';

const editPostSchema = z.object({
  image: z.instanceof(File),
  description: z
    .string()
    .min(1, { message: 'Content cannot be empty' })
    .max(100, { message: 'Content must be less than 100 characters' }),
});

export type EditPostFormInputs = z.infer<typeof editPostSchema>;

const EditPost = () => {
  const { postId } = useParams();
  const { getPostById } = usePosts();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    watch,
  } = useForm<EditPostFormInputs>({
    defaultValues: {
      image: undefined,
      description: '',
    },
  });

  const description = watch('description');
  const image = watch('image');

  useEffect(() => {
    const loadPost = () => {
      setIsLoading(true);
      const post = getPostById(postId!);
      if (!post) {
        toast.error(
          <ToastContent message="Post not found" description="" type={ToastType.ERROR} />,
        );
        navigate('/dashboard');
        return;
      }

      setValue('description', post.content);
      setPreviewImage(`${config.apiUrl}/${post.image}`);
      setIsLoading(false);
    };

    if (postId) {
      loadPost();
    }
  }, [postId, getPostById, setValue]);

  useEffect(() => {
    setHasChanges(isDirty || image instanceof File);
  }, [description, image, isDirty]);

  const onSubmitForm = async (data: EditPostFormInputs) => {
    try {
      setIsLoading(true);
      const imageToUpdate = data.image instanceof File ? data.image : undefined;
      await updatePost(postId!, imageToUpdate, data.description ?? undefined);
      toast.success(
        <ToastContent
          message="Post updated Successfully!"
          description=""
          type={ToastType.SUCCESS}
        />,
        toastConfig,
      );
    } catch (error) {
      console.error('Failed to update post', error);
      toast.error(
        <ToastContent message="Failed to update post" description="" type={ToastType.ERROR} />,
      );
    } finally {
      setIsLoading(false);
      setHasChanges(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto bg-gray-900 rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="w-120 p-8">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <h1 className="text-3xl font-bold text-gray-100">Edit Post</h1>
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

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-800
                text-gray-100 py-4 px-6 rounded-xl font-medium text-lg
                hover:from-blue-700 hover:to-blue-900 transition-all
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                focus:ring-offset-gray-900 shadow-lg disabled:opacity-50 disabled:pointer-events-none"
              disabled={!hasChanges}
            >
              Save
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default EditPost;
