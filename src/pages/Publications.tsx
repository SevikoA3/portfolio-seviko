import { useEffect, useState } from 'react';
import { fetchPublications, type Publication } from '../lib/firebase';
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
    <main className="min-h-screen bg-background pt-8 pb-24 px-8 md:px-12">
      <div className="max-w-7xl mx-auto">
        <AnimateIn>
          <header className="mb-16">
            <div className="inline-block border border-secondary text-secondary px-3 py-1 font-label text-[10px] mb-6 tracking-widest uppercase">
              system.log: academic_records
            </div>
            <h1 className="text-5xl md:text-7xl font-headline font-bold lowercase tracking-tighter text-on-surface mb-6">
              #publications
            </h1>
            <p className="text-on-surface-variant font-body text-lg max-w-xl">
              Peer-reviewed research and technical papers focusing on pushing the boundaries of AI, Machine Learning, and Systems Engineering.
            </p>
          </header>
        </AnimateIn>

        <div className="flex flex-col gap-8">
          {loading ? (
             <div className="flex justify-center py-20 text-secondary items-center animate-pulse gap-2">
                <span className="material-symbols-outlined">rotate_right</span> Fetching academic.records...
             </div>
          ) : publications.length === 0 ? (
             <div className="text-on-surface-variant font-mono py-12">No publications found in the database.</div>
          ) : (
            publications.map(pub => (
              <AnimateIn key={pub.id}>
                <article className="border border-outline-variant/30 bg-surface-container-low p-8 md:p-12 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary group-hover:w-2 transition-all duration-300"></div>
                  <div className="absolute right-0 top-0 text-[120px] font-headline font-bold opacity-[0.02] -mt-10 -mr-10 select-none pointer-events-none">
                    IEEE
                  </div>
                  
                  <div className="flex items-center gap-4 mb-6 relative z-10">
                    <span className="bg-primary/20 text-primary font-mono text-xs px-3 py-1 border border-primary/30">{pub.type}</span>
                    <span className="text-on-surface-variant font-mono text-xs">Published: {pub.year}</span>
                  </div>
                  
                  <h2 className="relative z-10 text-3xl lg:text-4xl font-headline font-bold text-on-surface mb-6 leading-tight group-hover:text-primary transition-colors">
                    {pub.title}
                  </h2>
                  
                  <p className="relative z-10 text-on-surface-variant font-body text-base lg:text-lg mb-8 leading-relaxed max-w-4xl">
                    <strong className="text-on-surface font-headline uppercase tracking-wide text-sm mr-2 text-primary">Abstract:</strong>
                    {pub.abstract}
                  </p>
                  
                  <div className="relative z-10 flex flex-wrap gap-4">
                    <a href={pub.link} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-primary text-on-primary font-headline font-bold text-sm hover:brightness-110 active:scale-95 transition-all flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">article</span>
                      Read Full Text
                    </a>
                    <a href={pub.link} target="_blank" rel="noopener noreferrer" className="px-6 py-3 border border-outline-variant/50 text-on-surface font-headline font-bold text-sm hover:bg-surface-container-highest transition-all flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">link</span>
                      Source Link
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
