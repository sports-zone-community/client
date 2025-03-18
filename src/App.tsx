import './App.css';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Login from './components/auth/login/Login';
import Register from './components/auth/register/Register';
import AuthProvider from './components/auth/context/AuthProvider';
import ProtectedRoute from './components/auth/route/ProtectedRoute';
import Home from './components/home/Home';
import Dashboard from './pages/dashboard/Dashboard';
import Inbox from './pages/inbox/Inbox';
import AddPost from './pages/add-post/AddPost';
import Profile from './pages/profile/Profile';
import AddGroup from './pages/add-group/AddGroup';
import { ToastContainer } from 'react-toastify';
import EditPost from './pages/edit-post/EditPost.tsx';
import { PostsProvider } from './components/post/context/PostsProvider.tsx';
import { GroupsProvider } from './components/groups/context/GroupsProvider.tsx';
import { ChatsProvider } from './components/chat/context/ChatsProvider.tsx';
import { configToast } from './shared/functions/toastConfig';
import { SocketProvider } from './services/socket/SocketContext';
import EditProfile from './pages/edit-profile/EditProfile.tsx';
import Search from './pages/search/Search.tsx';
import { useState } from 'react';

const publicRoutes = [
  { path: '/', element: <Home /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
];

export const protectedRoutes = [
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/inbox', element: <Inbox /> },
  { path: '/add-post', element: <AddPost /> },
  { path: '/edit-post/:postId', element: <EditPost /> },
  { path: '/add-group', element: <AddGroup /> },
  { path: '/profile', element: <Profile /> },
  { path: '/edit-profile', element: <EditProfile /> },
];

const App = () => {
  const [isSearchDrawerVisible, setIsSearchDrawerVisible] = useState(false);

  const showSearchDrawer = () => {
    console.log('showSearchDrawer');
    setIsSearchDrawerVisible(true);
  };

  const closeSearchDrawer = () => {
    console.log('closeSearchDrawer');
    setIsSearchDrawerVisible(false);
  };

  return (
    <>
      <ToastContainer
        position="top-center"
        theme="dark"
        className="!transform-gpu"
        toastClassName={configToast}
      />
      <BrowserRouter>
        <AuthProvider>
          <Layout onSearchClick={showSearchDrawer} onOutsideClick={closeSearchDrawer}>
            <Routes>
              {publicRoutes.map(({ path, element }) => (
                <Route key={path} path={path} element={element} />
              ))}

              <Route
                element={
                  <ProtectedRoute>
                    <SocketProvider>
                      <GroupsProvider>
                        <ChatsProvider>
                          <PostsProvider>
                            <Outlet />
                          </PostsProvider>
                        </ChatsProvider>
                      </GroupsProvider>
                    </SocketProvider>
                  </ProtectedRoute>
                }
              >
                {protectedRoutes.map(({ path, element }) => (
                  <Route key={path} path={path} element={element} />
                ))}
              </Route>
            </Routes>
          </Layout>
          <Search visible={isSearchDrawerVisible} onClose={closeSearchDrawer} />
        </AuthProvider>
      </BrowserRouter>
    </>
  );
};

export default App;
