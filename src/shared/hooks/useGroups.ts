import { useContext } from 'react';
import { GroupsContext } from '../../components/groups/context/GroupsContext.tsx';

export const useGroups = () => {
  const context = useContext(GroupsContext);
  if (!context) throw new Error('useGroups must be used within a GroupsProvider');
  return context;
};
