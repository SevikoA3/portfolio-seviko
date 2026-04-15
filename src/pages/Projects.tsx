import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from 'react';
import { fetchProjects, type Project } from '../lib/firebase';

/** Lightweight scroll-reveal for items that need custom inline style (gridColumn) */
function RevealItem({
  children,
  delay = 0,
  style,
}: {
  children: ReactNode;
  delay?: number;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { setInView(e.isIntersecting); }, // reset when leaving, trigger when entering
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ ...style, transitionDelay: inView ? `${delay}ms` : '0ms' }}
      className={`transition-all duration-700 ease-out ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      {children}
    </div>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchProjects(false);
      setProjects(data);
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <main className="pt-24 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <RevealItem>
        <header className="mb-20">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-on-surface mb-6 font-headline">
            Big<span className="text-primary">Projects</span>
          </h1>
          <p className="text-on-surface-variant max-w-2xl text-lg leading-relaxed font-body">
            A selection of production-ready machine learning pipelines and scalable backend architectures.
          </p>
        </header>
      </RevealItem>

      {/* Big Projects Grid — 3 cols, last 1 or 2 items stretch to fill the row */}
      <section
        className="grid gap-6 mb-32"
        style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}
      >
        {loading ? (
          <div style={{ gridColumn: '1 / -1' }} className="flex justify-center py-20 text-secondary items-center animate-pulse gap-2 font-mono">
            <span className="material-symbols-outlined">rotate_right</span> Loading database...
          </div>
        ) : projects.length === 0 ? (
          <div style={{ gridColumn: '1 / -1' }} className="text-on-surface-variant font-mono py-12 text-center">
            No projects found. Add some via Firebase Console.
          </div>
        ) : (
          projects.map((project, index) => {
            const total = projects.length;
            const remainder = total % 3;

            let gridColumn: string | undefined;
            if (remainder === 1 && index === total - 1) gridColumn = '1 / -1';
            else if (remainder === 2 && index === total - 2) gridColumn = 'span 1';
            else if (remainder === 2 && index === total - 1) gridColumn = 'span 2';

            return (
              <RevealItem
                key={project.id}
                delay={(index % 3) * 80}
                style={gridColumn ? { gridColumn } : undefined}
              >
                <div className="bg-surface-container-low border border-outline-variant/15 group hover:border-primary/40 transition-all terminal-glow flex flex-col h-full">
                  {/* Image */}
                  <div className="relative overflow-hidden h-64">
                    <img
                      alt={project.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 opacity-60 group-hover:opacity-100"
                      src={project.imageUrl}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-5 right-5">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {project.tags.map(tag => (
                          <span key={tag} className="bg-surface-container-highest/80 backdrop-blur-sm text-secondary text-[10px] px-2 py-0.5 border border-outline-variant/20 uppercase font-mono">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow font-body">
                    <div className="text-[10px] text-secondary mb-2 font-mono uppercase tracking-wider">{project.category}</div>
                    <h3 className="text-xl font-bold lowercase tracking-tight mb-3 text-on-surface font-headline group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-on-surface-variant text-sm mb-6 leading-relaxed flex-grow">{project.description}</p>
                    <div className="flex gap-4 font-mono mt-auto">
                      {project.demoLink && (
                        <a href={project.demoLink} className="text-sm text-primary flex items-center gap-1 hover:underline">
                          <span className="material-symbols-outlined text-sm">open_in_new</span> live_demo
                        </a>
                      )}
                      {project.repoLink && (
                        <a href={project.repoLink} className="text-sm text-secondary flex items-center gap-1 hover:underline">
                          <span className="material-symbols-outlined text-sm">code</span> source
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </RevealItem>
            );
          })
        )}
      </section>

      {/* Small Projects Header */}
      <RevealItem>
        <header className="mb-12">
          <h2 className="text-4xl font-bold tracking-tighter text-on-surface mb-4 font-headline">
            Small<span className="text-secondary">Projects</span>
          </h2>
          <div className="h-px w-full bg-outline-variant/20"></div>
        </header>
      </RevealItem>

      {/* Small Projects List */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          { title: 'nlp_text_cleaner', icon: 'data_exploration', desc: 'A fast python script for preemptive text cleaning before language modeling tasks.', tags: ['#PYTHON', '#NLP'] },
          { title: 'docker_gpu_setup', icon: 'memory', desc: 'Boilerplate configuration maps for passing Nvidia GPUs into containerized environments easily.', tags: ['#DOCKER', '#CUDA'] },
          { title: 'go_rate_limiter', icon: 'speed', desc: 'High performance distributed rate limiter written in Go using Redis backend.', tags: ['#GO', '#REDIS'] },
        ].map(({ title, icon, desc, tags }, i) => (
          <RevealItem key={title} delay={i * 80}>
            <div className="group border-l-2 border-outline-variant hover:border-secondary transition-all p-4 bg-surface/50 font-body h-full">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-lg font-bold lowercase text-on-surface font-headline">{title}</h4>
                <span className="material-symbols-outlined text-outline group-hover:text-secondary">{icon}</span>
              </div>
              <p className="text-on-surface-variant text-xs mb-6 leading-relaxed">{desc}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {tags.map(t => <span key={t} className="text-[9px] text-outline-variant font-mono">{t}</span>)}
              </div>
              <a className="text-[10px] text-secondary tracking-widest uppercase hover:text-on-surface flex items-center gap-1 font-mono" href="#">
                view_repository <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
              </a>
            </div>
          </RevealItem>
        ))}
      </section>
    </main>
  );
}
