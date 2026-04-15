import { useEffect, useState } from 'react';
import { fetchProjects, fetchPublications, type Project, type Publication } from '../lib/firebase';
import { Link } from 'react-router-dom';
import AnimateIn from '../components/AnimateIn';

export default function Home() {
  const [latestProjects, setLatestProjects] = useState<Project[]>([]);
  const [latestPublication, setLatestPublication] = useState<Publication | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [projData, pubData] = await Promise.all([
        fetchProjects(true),
        fetchPublications(true)
      ]);
      setLatestProjects(projData);
      setLatestPublication(pubData.length > 0 ? pubData[0] : null);
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <main>

      {/* ── 1. Hero ── bg-background ── */}
      <section className="relative min-h-screen flex items-stretch px-8 md:px-12 overflow-hidden bg-background">
        <div className="absolute inset-0 dot-grid z-0"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10 w-full max-w-7xl mx-auto py-24">
          <AnimateIn delay={0}>
            <div className="inline-block border border-secondary text-secondary px-3 py-1 font-label text-[10px] mb-6 tracking-widest uppercase">
              system.status: active_and_available
            </div>
            <h1 className="text-5xl md:text-7xl font-headline font-bold tracking-tighter mb-6 leading-tight text-on-surface">
              <span className="text-primary italic">AI/ML Engineer</span> &amp;<br />
              Backend Developer
            </h1>
            <p className="text-on-surface-variant font-body text-lg max-w-xl mb-10 leading-relaxed">
              I'm Seviko Attalarik P.H, bridging algorithmic logic and scalable architectures. Crafting high-performance backend systems and machine learning models at the edge of the digital void.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/contacts" className="px-8 py-4 bg-primary text-on-primary font-headline font-bold text-sm hover:brightness-110 transition-all active:scale-95 inline-block">
                Contact me
              </Link>
              <Link to="/works" className="px-8 py-4 border border-outline-variant text-on-surface font-headline font-bold text-sm hover:bg-surface-container-high transition-all active:scale-95 inline-block">
                View Manifest
              </Link>
            </div>
          </AnimateIn>

          <AnimateIn delay={150} className="flex items-center justify-center lg:justify-end">
            <img
              alt="Seviko Attalarik P.H"
              className="h-[480px] md:h-[600px] w-auto object-contain"
              src="https://firebasestorage.googleapis.com/v0/b/portfolio-seviko.firebasestorage.app/o/bg%20putih.png?alt=media&token=6cfb4203-5e16-409a-9401-3e7bcb47bb98"
            />
          </AnimateIn>
        </div>
      </section>

      {/* ── 2. Skills ── bg-surface-container-low ── */}
      <section className="py-24 px-8 md:px-12 bg-surface-container-low">
        <div className="max-w-7xl mx-auto">
          <AnimateIn>
            <div className="flex items-center gap-4 mb-12">
              <h2 className="text-4xl font-headline font-bold lowercase tracking-tighter text-on-surface shrink-0">
                #core_competencies
              </h2>
              <div className="h-px flex-grow bg-outline-variant/20"></div>
            </div>
          </AnimateIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: 'neurology',     title: 'Machine Learning',  tags: ['TensorFlow','PyTorch','Computer Vision','NLP'] },
              { icon: 'deployed_code', title: 'Backend & Systems', tags: ['Python','Go','Rust','PostgreSQL'] },
              { icon: 'cloud_queue',   title: 'Cloud & Ops',       tags: ['Docker','Kubernetes','AWS','Firebase'] },
            ].map(({ icon, title, tags }, i) => (
              <AnimateIn key={title} delay={i * 100}>
                <div className="p-8 bg-surface border border-outline-variant/10 group hover:border-primary/40 transition-colors h-full">
                  <div className="text-secondary mb-4">
                    <span className="material-symbols-outlined text-4xl">{icon}</span>
                  </div>
                  <h3 className="font-headline font-bold text-xl mb-4 text-on-surface">{title}</h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map(t => (
                      <span key={t} className="bg-surface-container-high text-secondary font-label text-[10px] px-2 py-1 uppercase tracking-wider hover:bg-secondary hover:text-on-secondary transition-colors">{t}</span>
                    ))}
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Latest Publication ── bg-background ── */}
      {latestPublication && (
        <section className="py-24 px-8 md:px-12 bg-background">
          <div className="max-w-7xl mx-auto">
            <AnimateIn>
              <div className="flex items-center gap-4 mb-12">
                <h2 className="text-4xl font-headline font-bold lowercase tracking-tighter text-on-surface shrink-0">
                  #latest_publication
                </h2>
                <div className="h-px flex-grow bg-outline-variant/20"></div>
                <Link to="/publications" className="text-primary font-label text-xs uppercase hover:underline flex items-center gap-2 shrink-0">
                  View All <span className="material-symbols-outlined text-sm">arrow_outward</span>
                </Link>
              </div>
            </AnimateIn>
            <AnimateIn delay={100}>
              <div className="flex flex-col md:flex-row gap-8 items-center bg-surface-container-low border border-primary/20 p-8 hover:border-primary/50 transition-colors">
                <div className="bg-primary/10 p-4 rounded-full text-primary shrink-0 hidden md:block">
                  <span className="material-symbols-outlined text-4xl">workspace_premium</span>
                </div>
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-primary/20 text-primary font-mono text-[10px] px-2 py-1 uppercase tracking-widest border border-primary/30">{latestPublication.type}</span>
                    <span className="text-on-surface-variant font-mono text-[10px] uppercase tracking-widest">{latestPublication.year}</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-headline font-bold text-on-surface mb-3">
                    {latestPublication.title}
                  </h3>
                  <p className="text-on-surface-variant font-body text-sm line-clamp-2">
                    {latestPublication.abstract}
                  </p>
                </div>
                <div className="shrink-0 w-full md:w-auto mt-4 md:mt-0">
                  <Link to="/publications" className="px-6 py-3 bg-primary text-on-primary font-headline font-bold text-sm hover:brightness-110 active:scale-95 transition-all text-center block whitespace-nowrap">
                    Read Paper
                  </Link>
                </div>
              </div>
            </AnimateIn>
          </div>
        </section>
      )}

      {/* ── 4. Latest Projects ── bg-surface-container-low ── */}
      <section className={`py-24 px-8 md:px-12 ${latestPublication ? 'bg-surface-container-low' : 'bg-background'}`}>
        <div className="max-w-7xl mx-auto">
          <AnimateIn>
            <div className="flex items-center gap-4 mb-12">
              <h2 className="text-4xl font-headline font-bold lowercase tracking-tighter text-on-surface shrink-0">
                #latest_projects
              </h2>
              <div className="h-px flex-grow bg-outline-variant/20"></div>
              <Link to="/works" className="text-primary font-label text-xs uppercase hover:underline flex items-center gap-2 shrink-0">
                View All <span className="material-symbols-outlined text-sm">arrow_outward</span>
              </Link>
            </div>
          </AnimateIn>

          {loading ? (
            <div className="flex justify-center py-20 text-secondary items-center animate-pulse gap-2">
              <span className="material-symbols-outlined">rotate_right</span> Loading data.streams...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {latestProjects.map((project, idx) => (
                <AnimateIn key={project.id} delay={idx * 80}>
                  <div className="group bg-surface border border-outline-variant/10 transition-all duration-300 hover:border-primary/60 flex flex-col h-full">
                    <div className="aspect-video bg-surface-container-low overflow-hidden">
                      <img
                        alt={project.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        src={project.imageUrl}
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="font-label text-[10px] text-secondary mb-2 uppercase tracking-tighter">{project.category}</div>
                      <h3 className="font-headline font-bold text-xl mb-3 group-hover:text-primary transition-colors text-on-surface">{project.title}</h3>
                      <p className="text-on-surface-variant text-sm mb-6 leading-relaxed flex-grow">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mt-auto">
                        {project.tags.map(tag => (
                          <span key={tag} className="text-[9px] font-label text-outline uppercase">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </AnimateIn>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── 5. About ── bg-background ── */}
      <section className={`py-24 px-8 md:px-12 ${latestPublication ? 'bg-background' : 'bg-surface-container-low'}`}>
        <AnimateIn>
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-4xl font-headline font-bold lowercase tracking-tighter text-on-surface shrink-0">
                  #about
                </h2>
                <div className="h-px flex-grow bg-outline-variant/20"></div>
              </div>
              <p className="text-on-surface-variant font-body mb-6 leading-relaxed">
                Based at the intersection of data science and core engineering, I am focused on the efficiency of code. My methodology is rooted in structural principles: data integrity, modularity, and a refusal to build complex structures when simple logic suffices.
              </p>
              <Link to="/about" className="text-primary font-label text-xs uppercase hover:underline flex items-center gap-2">
                Read Full Story <span className="material-symbols-outlined text-sm">arrow_outward</span>
              </Link>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="border border-outline-variant/20 p-6 bg-surface max-w-sm w-full">
                <div className="flex items-center gap-3 text-sm text-on-surface font-mono mb-4">
                  <span className="material-symbols-outlined text-primary text-base">terminal</span>
                  <span>currently_available: true</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-on-surface font-mono">
                  <span className="material-symbols-outlined text-secondary text-base">location_on</span>
                  <span>origin: [JAKARTA, ID]</span>
                </div>
              </div>
            </div>
          </div>
        </AnimateIn>
      </section>

      {/* ── 6. Contact CTA ── bg-surface-container-low ── */}
      <section className={`py-24 px-8 md:px-12 relative overflow-hidden border-t border-outline-variant/10 ${latestPublication ? 'bg-surface-container-low' : 'bg-background'}`}>
        <div className="absolute inset-0 dot-grid opacity-5 z-0"></div>
        <AnimateIn className="relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center gap-4 mb-8 justify-center">
              <h2 className="text-4xl font-headline font-bold lowercase tracking-tighter text-on-surface shrink-0">
                #contact
              </h2>
            </div>
            <p className="text-on-surface-variant font-body mb-10 max-w-xl mx-auto leading-relaxed text-lg">
              Whether you have a specific AI project in mind or need a scalable backend architecture, my inbox is always monitored.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 items-center">
              <div className="flex items-center space-x-3 bg-surface-container-highest/50 px-6 py-3 border border-outline-variant/10">
                <span className="material-symbols-outlined text-primary">mail</span>
                <span className="text-sm font-mono text-on-surface">seviko.attalarik@example.com</span>
              </div>
              <Link to="/contacts" className="px-8 py-3 bg-primary text-on-primary font-headline font-bold text-sm hover:brightness-110 transition-all uppercase tracking-wider">
                Full Contact Info
              </Link>
            </div>
          </div>
        </AnimateIn>
      </section>

    </main>
  );
}
