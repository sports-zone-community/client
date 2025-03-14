import { createContext } from 'react';
import { GroupModel, CreateGroupModel } from '../../../shared/models/Group.ts';

interface GroupsContextType {
  groups: GroupModel[];
  getGroups: () => Promise<void>;
  createGroup: (group: CreateGroupModel) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
}

export const GroupsContext = createContext<GroupsContextType | undefined>(undefined);
