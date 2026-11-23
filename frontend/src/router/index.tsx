import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { Home } from '../pages/Home';
import { Play } from '../pages/Play';
import { Leaderboard } from '../pages/Leaderboard';
import { Chat } from '../pages/Chat';
import { Profile } from '../pages/Profile';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { Privacy } from '../pages/Privacy';
import { Terms } from '../pages/Terms';
import { NotFound } from '../pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'play',
        element: <Play />,
      },
      {
        path: 'leaderboard',
        element: <Leaderboard />,
      },
      {
        path: 'chat',
        element: <Chat />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'privacy',
        element: <Privacy />,
      },
      {
        path: 'terms',
        element: <Terms />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);
