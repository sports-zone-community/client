import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { useAuth } from '../../shared/hooks/useAuth';
import { config } from '../../config';
import { ToastContent } from '../../components/toastContent/toastContent.tsx';
import { ToastType } from '../../shared/enums/ToastType.ts';
import { updateUser } from '../../features/api/user.ts';
import ProfileImageInput from '../../components/post/components/ProfileImageInput.tsx';
import { motion } from 'framer-motion';

const editProfileSchema = z.object({
  username: z.string().nonempty({ message: 'Username is required' }),
  name: z.string().nonempty({ message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  picture: z.instanceof(File).optional(),
});

export type EditProfileFormInputs = z.infer<typeof editProfileSchema>;

const EditProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<EditProfileFormInputs>({
    resolver: zodResolver(editProfileSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    if (user) {
      setValue('username', user.username);
      setValue('name', user.name);
      setValue('email', user.email);
      setPreviewImage(
        user.picture.startsWith('https') ? user.picture : `${config.apiUrl}/${user.picture}`,
      );
    }
  }, [user, setValue]);

  const onSubmitForm = async (data: EditProfileFormInputs) => {
    try {
      const username = data.username ?? undefined;
      const name = data.name ?? undefined;
      const email = data.email ?? undefined;
      const image = data.picture instanceof File ? data.picture : undefined;

      await updateUser(username, name, email, image);

      toast.success(
        <ToastContent
          message="Profile updated successfully!"
          description=""
          type={ToastType.SUCCESS}
        />,
      );
      navigate('/profile');
    } catch (error) {
      console.error('Failed to update profile', error);
      toast.error(
        <ToastContent message="Failed to update profile" description="" type={ToastType.ERROR} />,
      );
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
            <h1 className="text-3xl font-bold text-gray-100">Edit Profile</h1>
          </div>

          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
            <div>
              <label className="block text-gray-300">Username</label>
              <input
                type="text"
                {...register('username')}
                className="w-full p-2 rounded bg-gray-800 text-gray-100"
              />
              {errors.username && <p className="text-red-500">{errors.username.message}</p>}
            </div>

            <div>
              <label className="block text-gray-300">Name</label>
              <input
                type="text"
                {...register('name')}
                className="w-full p-2 rounded bg-gray-800 text-gray-100"
              />
              {errors.name && <p className="text-red-500">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-gray-300">Email</label>
              <input
                type="email"
                {...register('email')}
                className="w-full p-2 rounded bg-gray-800 text-gray-100"
              />
              {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            </div>

            <ProfileImageInput
              previewImage={previewImage}
              setPreviewImage={setPreviewImage}
              registration={register('picture')}
              setValue={setValue}
              error={errors.picture}
            />

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
              Save
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default EditProfile;
