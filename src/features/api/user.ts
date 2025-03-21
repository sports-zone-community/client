import api from './api.ts';
import { UserModel } from '../../shared/models';

export const fetchUserById = async (userId: string): Promise<UserModel> => {
  const response = await api.get<UserModel>(`users/details`, {
    params: { userId },
  });
  return response.data;
};

interface UpdateUserParams {
  username: string;
  name: string;
  email: string;
  picture: File;
}

export const updateUser = async ({
  username,
  name,
  email,
  picture,
}: UpdateUserParams): Promise<void> => {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('name', name);
  formData.append('email', email);
  formData.append('image', picture);

  await api.put('/users/update', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const toggleFollowUserById = async (userId: string): Promise<void> => {
  await api.post(`/users/toggle-follow/${userId}`);
};
