import { Navigate, createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';

const ADMIN_PATH = (() => {
  const configuredPath = import.meta.env.VITE_ADMIN_PATH?.trim();

  if (!configuredPath) {
    return '/_portfolio-admin';
  }

  return configuredPath.startsWith('/') ? configuredPath : `/${configuredPath}`;
})();

const pageFallback = <div role="status" className="p-8 font-mono text-secondary">Loading page...</div>;

const router = createBrowserRouter([
  {
    path: ADMIN_PATH,
    lazy: async () => ({ Component: (await import('./pages/Admin')).default }),
    hydrateFallbackElement: pageFallback,
  },
  {
    path: '/',
    element: <Layout />,
    hydrateFallbackElement: pageFallback,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/projects',
        lazy: async () => ({ Component: (await import('./pages/Projects')).default }),
      },
      {
        path: '/experience',
        lazy: async () => ({ Component: (await import('./pages/Experience')).default }),
      },
      {
        path: '/works',
        element: <Navigate to="/projects" replace />,
      },
      {
        path: '/about',
        lazy: async () => ({ Component: (await import('./pages/About')).default }),
      },
      {
        path: '/publications',
        lazy: async () => ({ Component: (await import('./pages/Publications')).default }),
      },
      {
        path: '/certificates',
        lazy: async () => ({ Component: (await import('./pages/Certificates')).default }),
      },
      {
        path: '/contacts',
        lazy: async () => ({ Component: (await import('./pages/Contacts')).default }),
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
