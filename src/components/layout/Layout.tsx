import { useAuth } from '../../shared/hooks/useAuth.ts';
import Sidebar from './Sidebar.tsx';
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  onSearchClick: () => void;
  onOutsideClick: () => void;
}

const Layout = ({ children, onSearchClick, onOutsideClick }: LayoutProps) => {
  const { user } = useAuth();

  return (
    <div className="bg-blue-950 min-h-screen flex">
      {user && <Sidebar onSearchClick={onSearchClick} onOtherClick={onOutsideClick} />}
      <div id="scrollableDiv" className={`flex-1 relative overflow-auto h-screen`}>
        <div className="h-full">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
