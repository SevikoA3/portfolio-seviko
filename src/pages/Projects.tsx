import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from 'react';
import { fetchMoreProjects, fetchProjects, type MoreProject, type Project } from '../lib/firebase';

/** Lightweight scroll-reveal for items that need custom inline style */
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
      ([e]) => {
        setInView(e.isIntersecting);
      },
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
  const [moreProjects, setMoreProjects] = useState<MoreProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [projectData, moreProjectData] = await Promise.all([fetchProjects(false), fetchMoreProjects()]);
      setProjects(projectData);
      setMoreProjects(moreProjectData);
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 pb-20 pt-28 sm:px-6 md:px-12 md:pb-24 md:pt-32">
      <RevealItem>
        <header className="mb-16 md:mb-20">
          <h1 className="mb-6 text-4xl font-bold tracking-tighter text-on-surface font-headline sm:text-5xl md:text-7xl">
            #<span className="text-primary">Projects</span>
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-on-surface-variant font-body sm:text-lg">
            A curated set of web, mobile, backend, and machine learning projects pulled from Firestore.
          </p>
        </header>
      </RevealItem>

      <section className="mb-24 grid grid-cols-1 gap-6 md:mb-32 md:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <div className="col-span-full flex items-center justify-center gap-2 py-20 text-secondary font-mono animate-pulse">
            <span className="material-symbols-outlined">rotate_right</span> Loading database...
          </div>
        ) : projects.length === 0 ? (
          <div className="col-span-full py-12 text-center text-on-surface-variant font-mono">
            No projects found. Add some via Firebase Console.
          </div>
        ) : (
          projects.map((project, index) => (
            <RevealItem key={project.id} delay={(index % 3) * 80}>
              <article className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-outline-variant/15 bg-surface-container-low transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-[0_24px_80px_rgba(7,10,24,0.38)]">
                <div className="relative h-48 overflow-hidden border-b border-outline-variant/10 bg-[#0d1020]">
                  <img
                    alt={project.title}
                    className="h-full w-full object-cover opacity-90 transition-all duration-500 group-hover:scale-[1.03] group-hover:opacity-100"
                    src={project.imageUrl}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#111322] via-[#111322]/35 to-transparent" />
                  <div className="absolute left-5 top-5">
                    <span className="inline-flex items-center rounded-full border border-white/12 bg-black/25 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.18em] text-white/78 backdrop-blur-sm">
                      {project.category}
                    </span>
                  </div>
                </div>

                <div className="flex grow flex-col p-6 sm:p-7 font-body">
                  <h3 className="mb-3 wrap-break-words text-2xl font-bold leading-tight tracking-tight text-on-surface font-headline transition-colors group-hover:text-primary">
                    {project.title}
                  </h3>
                  <p className="mb-6 wrap-break-words text-sm leading-7 text-on-surface-variant grow">
                    {project.description}
                  </p>
                  <div className="mb-6 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-outline-variant/15 bg-surface-container-high px-3 py-1 text-[10px] font-mono uppercase tracking-[0.14em] text-secondary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto flex flex-wrap gap-3 font-mono">
                    {project.demoLink && (
                      <a
                        href={project.demoLink}
                        className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-primary transition-colors hover:bg-primary/16"
                      >
                        <span className="material-symbols-outlined text-sm">open_in_new</span>
                        live demo
                      </a>
                    )}
                    {project.repoLink && (
                      <a
                        href={project.repoLink}
                        className="inline-flex items-center gap-2 rounded-full border border-outline-variant/20 bg-surface-container-high px-4 py-2 text-xs uppercase tracking-[0.18em] text-secondary transition-colors hover:border-secondary/30 hover:text-on-surface"
                      >
                        <span className="material-symbols-outlined text-sm">code</span>
                        source
                      </a>
                    )}
                  </div>
                </div>
              </article>
            </RevealItem>
          ))
        )}
      </section>

      <RevealItem>
        <header className="mb-12 md:mb-14">
          <h2 className="mb-4 text-3xl font-bold tracking-tighter text-on-surface font-headline sm:text-4xl">
            ##<span className="text-secondary">More_Projects</span>
          </h2>
          <div className="h-px w-full bg-outline-variant/20"></div>
        </header>
      </RevealItem>

      <RevealItem>
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {moreProjects.map((project, index) => (
            <RevealItem key={project.repoLink} delay={(index % 3) * 80}>
              <article className="flex h-full flex-col rounded-[22px] border border-outline-variant/15 bg-surface-container-low p-5 transition-all duration-300 hover:-translate-y-1 hover:border-secondary/35 hover:shadow-[0_20px_56px_rgba(7,10,24,0.18)]">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <span className="inline-flex items-center rounded-full border border-outline-variant/15 bg-surface-container-high px-3 py-1 text-[9px] font-mono uppercase tracking-[0.16em] text-secondary">
                    {project.category}
                  </span>
                  <a
                    href={project.repoLink}
                    className="inline-flex items-center gap-2 rounded-full border border-outline-variant/20 bg-surface-container-high px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-secondary transition-colors hover:border-secondary/30 hover:text-on-surface"
                  >
                    <span className="material-symbols-outlined text-sm">code</span>
                    source
                  </a>
                </div>

                <h3 className="mb-2 text-xl font-bold leading-tight tracking-tight text-on-surface font-headline">
                  {project.title}
                </h3>
                <p className="mb-4 grow text-sm leading-6 text-on-surface-variant font-body">
                  {project.description}
                </p>
                <div className="mt-auto flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-outline-variant/15 bg-surface-container-high px-2.5 py-1 text-[9px] font-mono uppercase tracking-[0.12em] text-secondary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            </RevealItem>
          ))}
        </section>
      </RevealItem>
    </main>
  );
}
