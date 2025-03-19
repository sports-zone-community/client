import { AxiosResponse } from 'axios';
import { GroupModel, CreateGroupModel } from '../../shared/models';
import api from './api.ts';
import { config } from '../../config';

export const fetchGroups = async (): Promise<GroupModel[]> => {
  const response: AxiosResponse<GroupModel[]> = await api.get<GroupModel[]>('groups');
  return response.data.map(group => ({
    ...group,
    image: group.image ? `${config.apiUrl}/${group.image}` : group.image
  }));
};

export const createNewGroup = async (group: CreateGroupModel): Promise<GroupModel> => {
  const formData = new FormData();
  formData.append('name', group.name);
  formData.append('description', group.description);
  formData.append('image', group.image);

  const response: AxiosResponse<GroupModel> = await api.post<GroupModel>('groups', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return {
    ...response.data,
    image: response.data.image ? `${config.apiUrl}/${response.data.image}` : response.data.image
  };
};

export const joinGroupById = async (groupId: string): Promise<GroupModel> => {
  const response: AxiosResponse<GroupModel> = await api.post(`groups/toggle-join/${groupId}`);
  return response.data;
};
