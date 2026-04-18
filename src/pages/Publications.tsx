import { useEffect, useState } from 'react';
import { fetchPublications } from '../lib/api';
import type { Publication } from '../lib/types';
import AnimateIn from '../components/AnimateIn';

export default function Publications() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchPublications(false);
      setPublications(data);
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <main className="relative min-h-screen overflow-x-clip bg-background">
      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 md:px-12 md:pb-24 md:pt-32">
        <AnimateIn>
          <header className="mb-16 md:mb-20">
            <h1 className="mb-6 wrap-break-words text-3xl font-headline font-bold tracking-tighter text-on-surface sm:text-4xl md:text-6xl lg:text-7xl">
              #<span className="text-primary">Publications</span>
            </h1>
            <p className="max-w-xl text-base text-on-surface-variant font-body sm:text-lg">
              Peer-reviewed research and technical papers focusing on pushing the boundaries of AI, Machine Learning, and Systems Engineering.
            </p>
          </header>
        </AnimateIn>

        <div className="flex flex-col gap-6 md:gap-8">
          {loading ? (
             <div className="flex justify-center py-20 text-secondary items-center animate-pulse gap-2">
                <span className="material-symbols-outlined">rotate_right</span> Fetching academic.records...
             </div>
          ) : publications.length === 0 ? (
             <div className="text-on-surface-variant font-mono py-12">No publications found in the database.</div>
          ) : (
            publications.map(pub => (
              <AnimateIn key={pub.id}>
                <article className="glass-panel group relative overflow-hidden border border-outline-variant/30 p-5 sm:p-6 md:p-10 lg:p-12">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary group-hover:w-2 transition-all duration-300"></div>
                  <div className="pointer-events-none absolute right-0 top-0 -mr-8 -mt-8 select-none font-headline text-[80px] font-bold opacity-[0.02] sm:-mr-10 sm:-mt-10 sm:text-[120px]">
                    IEEE
                  </div>
                  
                  <div className="relative z-10 mb-6 flex flex-wrap items-center gap-3 sm:gap-4">
                    <span className="border border-primary/30 bg-primary/20 px-3 py-1 text-[11px] text-primary font-mono sm:text-xs">{pub.type}</span>
                    <span className="text-on-surface-variant font-mono text-xs">Published: {pub.year}</span>
                  </div>
                  
                  <h2 className="relative z-10 mb-6 wrap-break-words text-2xl font-headline font-bold leading-tight text-on-surface transition-colors group-hover:text-primary sm:text-3xl lg:text-4xl">
                    {pub.title}
                  </h2>
                  
                  <p className="relative z-10 mb-8 max-w-4xl wrap-break-words text-sm leading-relaxed text-on-surface-variant font-body sm:text-base lg:text-lg">
                    <strong className="font-headline uppercase tracking-wide text-sm mr-2 text-primary">Abstract:</strong>
                    {pub.abstract}
                  </p>
                  
                  <div className="relative z-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
                    <a href={pub.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-primary px-6 py-3 text-sm font-bold text-on-primary font-headline transition-all hover:brightness-110 active:scale-95">
                      <span className="material-symbols-outlined text-sm">article</span>
                      Read Full Text
                    </a>
                  </div>
                </article>
              </AnimateIn>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
