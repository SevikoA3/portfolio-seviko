import { type ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useOutlet } from 'react-router-dom';
import Lenis from 'lenis';

export default function Layout() {
  const { pathname, key } = useLocation();
  const outlet = useOutlet();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileMenuMounted, setIsMobileMenuMounted] = useState(false);
  const [activeOutlet, setActiveOutlet] = useState(outlet);
  const [leavingOutlet, setLeavingOutlet] = useState<ReactNode | null>(null);
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);
  const transitionTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current !== null) {
        window.clearTimeout(transitionTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!('scrollRestoration' in window.history)) return;

    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';

    return () => {
      window.history.scrollRestoration = previous;
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const lenis = new Lenis({
      autoRaf: true,
      smoothWheel: true,
      syncTouch: true,
      touchMultiplier: 1.1,
      wheelMultiplier: 0.9,
      lerp: 0.085,
      anchors: {
        offset: 80,
      },
    });

    lenisRef.current = lenis;

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useLayoutEffect(() => {
    const lenis = lenisRef.current;

    if (lenis) {
      lenis.scrollTo(0, { immediate: true, force: true });
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, key]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      setIsMobileMenuMounted(true);
      return;
    }

    const timeout = window.setTimeout(() => {
      setIsMobileMenuMounted(false);
    }, 180);

    return () => window.clearTimeout(timeout);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (outlet === activeOutlet) {
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (transitionTimerRef.current !== null) {
      window.clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }

    if (prefersReducedMotion) {
      setLeavingOutlet(null);
      setActiveOutlet(outlet);
      setIsPageTransitioning(false);
      return;
    }

    setLeavingOutlet(activeOutlet);
    setActiveOutlet(outlet);
    setIsPageTransitioning(true);

    transitionTimerRef.current = window.setTimeout(() => {
      setLeavingOutlet(null);
      setIsPageTransitioning(false);
      transitionTimerRef.current = null;
    }, 2000);
  }, [activeOutlet, outlet, pathname]);

  return (
    <>
      <nav className="fixed top-0 z-50 flex h-16 w-full items-center justify-between border-b border-[#24243a]/15 bg-[#0d0d1c]/80 px-4 backdrop-blur-xl sm:px-6 md:px-12">
        <Link to="/" className="text-lg font-bold text-[#c19bff] font-label lowercase tracking-tighter transition-colors hover:text-[#9cefff] sm:text-xl">
          portfolio.seviko
        </Link>
        
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
            to="/certificates" 
            className={({ isActive }) => 
              `font-label lowercase tracking-tighter transition-colors duration-300 font-bold ${isActive ? "text-[#c19bff] before:content-['#'] before:mr-0.5" : "text-slate-400 hover:text-[#9cefff]"}`
            }
          >
            certificates
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

        <button
          type="button"
          aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-navigation"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#24243a]/20 bg-surface-container-low text-[#9cefff] transition-colors hover:border-[#9cefff]/40 hover:bg-surface-container md:hidden"
          onClick={() => setIsMobileMenuOpen((value) => !value)}
        >
          <span className="material-symbols-outlined text-[22px]">
            {isMobileMenuOpen ? 'close' : 'menu'}
          </span>
        </button>
      </nav>

      {isMobileMenuMounted && (
        <div
          className={`fixed inset-0 z-40 md:hidden transition-all duration-200 ease-out ${
            isMobileMenuOpen ? 'pointer-events-auto bg-black/50 opacity-100 backdrop-blur-sm' : 'pointer-events-none bg-black/0 opacity-0 backdrop-blur-0'
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            id="mobile-navigation"
            className={`absolute right-4 top-16 w-[min(280px,calc(100vw-2rem))] rounded-2xl border border-[#24243a]/20 bg-[#0d0d1c]/95 p-3 shadow-[0_20px_60px_rgba(0,0,0,0.45)] transition-all duration-200 ease-out ${
              isMobileMenuOpen ? 'translate-y-0 scale-100 opacity-100' : '-translate-y-2 scale-95 opacity-0'
            }`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 px-3 pt-1 text-[10px] font-mono uppercase tracking-[0.28em] text-slate-500">
              navigate
            </div>
            <div className="flex flex-col gap-1">
              {[
                ['home', '/'],
                ['experience', '/experience'],
                ['projects', '/projects'],
                ['about', '/about'],
                ['publications', '/publications'],
                ['certificates', '/certificates'],
                ['contacts', '/contacts'],
              ].map(([label, to]) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `rounded-xl px-3 py-3 text-sm font-bold lowercase tracking-tighter transition-colors ${
                      isActive ? 'bg-[#1b1b31] text-[#c19bff]' : 'text-slate-300 hover:bg-surface-container hover:text-[#9cefff]'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="pt-16">
        <div className={`page-transition-shell ${isPageTransitioning ? 'is-transitioning' : ''}`}>
          {leavingOutlet && (
            <div className="page-transition-layer page-transition-layer-exit" aria-hidden="true">
              {leavingOutlet}
            </div>
          )}
          {isPageTransitioning && <div className="page-transition-veil" aria-hidden="true" />}
          <div
            key={key}
            className={`page-transition-layer ${isPageTransitioning ? 'page-transition-layer-enter' : 'page-transition-layer-static'}`}
          >
            {activeOutlet}
          </div>
        </div>
      </div>
    </>
  );
}
