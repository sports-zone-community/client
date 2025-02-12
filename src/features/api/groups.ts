import { GroupModel } from '../../shared/models';
import api from './api.ts';

export const fetchGroups = async (): Promise<GroupModel[]> => {
  const response = await api.get<GroupModel[]>('groups');

  return response.data;
};
