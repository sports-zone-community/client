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
import Explore from './pages/explore/Explore';
import { ToastContainer } from 'react-toastify';
import EditPost from './pages/edit-post/EditPost.tsx';
import { PostsProvider } from './components/post/context/PostsProvider.tsx';
import { GroupsProvider } from './components/groups/context/GroupsProvider.tsx';
import { configToast } from './shared/functions/toastConfig';

const publicRoutes = [
  { path: '/', element: <Home /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
];

const protectedRoutes = [
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/inbox', element: <Inbox /> },
  { path: '/explore', element: <Explore /> },
  { path: '/add-post', element: <AddPost /> },
  { path: '/edit-post/:postId', element: <EditPost /> },
  { path: '/add-group', element: <AddGroup /> },
  { path: '/profile', element: <Profile /> },
];

const App = () => {
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
          <Layout>
            <Routes>
              {publicRoutes.map(({ path, element }) => (
                <Route key={path} path={path} element={element} />
              ))}

              <Route
                element={
                  <ProtectedRoute>
                    <GroupsProvider>
                      <PostsProvider>
                        <Outlet />
                      </PostsProvider>
                    </GroupsProvider>
                  </ProtectedRoute>
                }
              >
                {protectedRoutes.map(({ path, element }) => (
                  <Route key={path} path={path} element={element} />
                ))}
              </Route>
            </Routes>
          </Layout>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
};

export default App;
