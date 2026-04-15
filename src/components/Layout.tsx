import { useEffect, useLayoutEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

export default function Layout() {
  const { pathname, key } = useLocation();

  useEffect(() => {
    if (!('scrollRestoration' in window.history)) return;

    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';

    return () => {
      window.history.scrollRestoration = previous;
    };
  }, []);

  useLayoutEffect(() => {
    const resetScroll = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    resetScroll();

    const frame = window.requestAnimationFrame(resetScroll);

    return () => window.cancelAnimationFrame(frame);
  }, [pathname, key]);

  return (
    <>
      <nav className="fixed top-0 z-50 flex h-16 w-full items-center justify-between border-b border-[#24243a]/15 bg-[#0d0d1c]/80 px-4 backdrop-blur-xl sm:px-6 md:px-12">
        <div className="text-lg font-bold text-[#c19bff] font-label lowercase tracking-tighter sm:text-xl">
          portfolio.seviko
        </div>
        
        <div className="hidden md:flex gap-8 items-center">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `font-label lowercase tracking-tighter transition-colors duration-300 font-bold ${isActive ? "text-[#c19bff] before:content-['#'] before:mr-0.5" : "text-slate-400 hover:text-[#9cefff]"}`
            }
          >
            home
          </NavLink>
          <NavLink 
            to="/experience" 
            className={({ isActive }) => 
              `font-label lowercase tracking-tighter transition-colors duration-300 font-bold ${isActive ? "text-[#c19bff] before:content-['#'] before:mr-0.5" : "text-slate-400 hover:text-[#9cefff]"}`
            }
          >
            experience
          </NavLink>
          <NavLink 
            to="/projects" 
            className={({ isActive }) => 
              `font-label lowercase tracking-tighter transition-colors duration-300 font-bold ${isActive ? "text-[#c19bff] before:content-['#'] before:mr-0.5" : "text-slate-400 hover:text-[#9cefff]"}`
            }
          >
            projects
          </NavLink>
          <NavLink 
            to="/about" 
            className={({ isActive }) => 
              `font-label lowercase tracking-tighter transition-colors duration-300 font-bold ${isActive ? "text-[#c19bff] before:content-['#'] before:mr-0.5" : "text-slate-400 hover:text-[#9cefff]"}`
            }
          >
            about
          </NavLink>
          <NavLink 
            to="/publications" 
            className={({ isActive }) => 
              `font-label lowercase tracking-tighter transition-colors duration-300 font-bold ${isActive ? "text-[#c19bff] before:content-['#'] before:mr-0.5" : "text-slate-400 hover:text-[#9cefff]"}`
            }
          >
            publications
          </NavLink>
          <NavLink 
            to="/contacts" 
            className={({ isActive }) => 
              `font-label lowercase tracking-tighter transition-colors duration-300 font-bold ${isActive ? "text-[#c19bff] before:content-['#'] before:mr-0.5" : "text-slate-400 hover:text-[#9cefff]"}`
            }
          >
            contacts
          </NavLink>
        </div>
      </nav>

      <div className="pt-16">
        <Outlet />
      </div>
    </>
  );
}
