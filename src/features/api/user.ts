import api from './api.ts';
import { UserModel } from '../../shared/models';

export const fetchUserById = async (userId: string): Promise<UserModel> => {
  const response = await api.get<UserModel>(`users/details`, {
    params: { userId },
  });
  return response.data;
};

export const updateUser = async (
  username?: string,
  name?: string,
  email?: string,
  image?: File,
): Promise<void> => {
  const formData = new FormData();
  if (username) formData.append('username', username);
  if (name) formData.append('name', name);
  if (email) formData.append('email', email);
  if (image) formData.append('image', image);

  console.log({ formData });

  await api.put<UserModel>('/users/update', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
