import { useEffect, useState } from 'react';
import { Navigate, createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Projects from './pages/Projects';
import About from './pages/About';
import Contacts from './pages/Contacts';
import Publications from './pages/Publications';
import ExperiencePage from './pages/Experience';
import CertificatesPage from './pages/Certificates';

const HERO_IMAGE_URL = 'https://firebasestorage.googleapis.com/v0/b/portfolio-seviko.firebasestorage.app/o/bg%20putih.png?alt=media&token=6cfb4203-5e16-409a-9401-3e7bcb47bb98';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/projects',
        element: <Projects />,
      },
      {
        path: '/experience',
        element: <ExperiencePage />,
      },
      {
        path: '/works',
        element: <Navigate to="/projects" replace />,
      },
      {
        path: '/about',
        element: <About />,
      },
      {
        path: '/publications',
        element: <Publications />,
      },
      {
        path: '/certificates',
        element: <CertificatesPage />,
      },
      {
        path: '/contacts',
        element: <Contacts />,
      },
    ],
  },
]);

function App() {
  const [isBooting, setIsBooting] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const minimumDelay = new Promise<void>((resolve) => {
      window.setTimeout(resolve, 1200);
    });

    const preloadHero = new Promise<void>((resolve) => {
      const isMobileViewport = window.matchMedia('(max-width: 767px)').matches;
      if (isMobileViewport) {
        resolve();
        return;
      }

      const image = new Image();
      image.src = HERO_IMAGE_URL;
      image.onload = () => resolve();
      image.onerror = () => resolve();
    });

    Promise.all([minimumDelay, preloadHero]).then(() => {
      if (isMounted) {
        setIsBooting(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      {isBooting && (
        <div className="fixed inset-0 z-999 overflow-hidden bg-background text-on-surface">
          <div className="absolute inset-0 dot-grid opacity-20" />
          <div className="relative flex min-h-screen items-center justify-center px-4 sm:px-8">
            <div className="w-full max-w-3xl">
              <div className="mb-6 font-label text-[10px] uppercase tracking-[0.35em] text-secondary">
                initializing interface
              </div>
              <div className="mb-8 flex items-end justify-between gap-6">
                <h1 className="font-headline text-3xl font-bold lowercase tracking-tighter text-on-surface sm:text-4xl md:text-6xl">
                  portfolio.seviko
                </h1>
                <div className="hidden font-mono text-xs uppercase tracking-[0.25em] text-outline md:block">
                  system boot
                </div>
              </div>
              <div className="h-px w-full overflow-hidden bg-outline-variant/20">
                <div className="boot-loader-line h-full w-1/3 bg-linear-to-r from-transparent via-primary to-secondary" />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
