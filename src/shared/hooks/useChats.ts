import { useContext } from 'react';
import { ChatsContext } from '../../components/chat/context/ChatsContext.tsx';

export const useChats = () => {
  const context = useContext(ChatsContext);
  if (!context) throw new Error('useChats must be used within a ChatsProvider');
  return context;
};
