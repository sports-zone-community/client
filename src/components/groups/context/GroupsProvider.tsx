import { ReactNode, useState } from 'react';
import { GroupModel, CreateGroupModel } from '../../../shared/models/Group.ts';
import { fetchGroups, createNewGroup } from '../../../features/api/groups.ts';
import { GroupsContext } from './GroupsContext.tsx';

export const GroupsProvider = ({ children }: { children: ReactNode }) => {
  const [groups, setGroups] = useState<GroupModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getGroups = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const newGroups: GroupModel[] = await fetchGroups();
      setGroups(newGroups);
    } catch (err) {
      console.error('Error fetching groups:', err);
      setError('Failed to fetch groups');
    } finally {
      setIsLoading(false);
    }
  };

  const createGroup = async (group: CreateGroupModel): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const newGroup: GroupModel = await createNewGroup(group);
      setGroups([...groups, newGroup]);
    } catch (err) {
      console.error('Error creating group:', err);
      setError('Failed to create group');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GroupsContext.Provider
      value={{ groups, getGroups, isLoading, error, setError, createGroup }}
    >
      {children}
    </GroupsContext.Provider>
  );
};