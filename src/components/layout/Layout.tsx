import { useState } from 'react';
import { useAuth } from '../../shared/hooks/useAuth.ts';
import Sidebar from './Sidebar.tsx';
import Search from '../../pages/search/Search.tsx';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user } = useAuth();
  const [isSearchDrawerVisible, setIsSearchDrawerVisible] = useState(false);

  const showSearchDrawer = () => {
    setIsSearchDrawerVisible(true);
  };

  const closeSearchDrawer = () => {
    setIsSearchDrawerVisible(false);
  };

  return (
    <>
      <div className="bg-blue-950 min-h-screen flex">
        {user && <Sidebar onSearchClick={showSearchDrawer} />}
        <div id="scrollableDiv" className={`flex-1 relative overflow-auto h-screen`}>
          <div className="h-full">{children}</div>
        </div>
      </div>
      <Search visible={isSearchDrawerVisible} onClose={closeSearchDrawer} />
    </>
  );
};

export default Layout;
