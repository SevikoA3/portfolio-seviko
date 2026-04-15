import { useEffect, useState } from 'react';
import { fetchExperiences, fetchProjects, fetchPublications, type Experience, type Project, type Publication } from '../lib/firebase';
import { Link } from 'react-router-dom';
import AnimateIn from '../components/AnimateIn';
import { calculateExperienceTotalDuration, formatExperiencePeriod } from '../lib/experienceDates';

export default function Home() {
  const [latestProjects, setLatestProjects] = useState<Project[]>([]);
  const [latestPublication, setLatestPublication] = useState<Publication | null>(null);
  const [latestExperiences, setLatestExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [projData, pubData, expData] = await Promise.all([
        fetchProjects(true),
        fetchPublications(true),
        fetchExperiences(true)
      ]);
      setLatestProjects(projData);
      setLatestPublication(pubData.length > 0 ? pubData[0] : null);
      setLatestExperiences(expData);
      setLoading(false);
    };
    loadData();
  }, []);

  const projectsSectionBg = latestExperiences.length > 0
    ? 'bg-background'
    : latestPublication
      ? 'bg-surface-container-low'
      : 'bg-background';

  const aboutSectionBg = latestExperiences.length > 0
    ? 'bg-surface-container-low'
    : latestPublication
      ? 'bg-background'
      : 'bg-surface-container-low';

  const contactSectionBg = latestExperiences.length > 0
    ? 'bg-background'
    : latestPublication
      ? 'bg-surface-container-low'
      : 'bg-background';

  return (
    <main className="overflow-x-clip">

      {/* ── 1. Hero ── bg-background ── */}
      <section className="relative flex min-h-[calc(100vh-4rem)] items-stretch overflow-hidden bg-background px-4 sm:px-6 md:px-12">
        <div className="absolute inset-0 dot-grid z-0"></div>
        <div className="z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 py-20 md:gap-12 md:py-24 lg:grid-cols-2">
          <AnimateIn delay={0}>
            <div className="inline-block border border-secondary text-secondary px-3 py-1 font-label text-[10px] mb-6 tracking-widest uppercase">
              system.status: active_and_available
            </div>
            <h1 className="mb-6 text-4xl font-headline font-bold leading-tight tracking-tighter text-on-surface sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="text-primary italic">AI/ML Engineer</span> &amp;<br />
              Backend Developer
            </h1>
            <p className="mb-10 max-w-xl text-base leading-relaxed text-on-surface-variant font-body sm:text-lg">
              I'm Seviko Attalarik P.H, bridging algorithmic logic and scalable architectures. Crafting high-performance backend systems and machine learning models at the edge of the digital void.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <Link to="/contacts" className="inline-block px-8 py-4 text-center bg-primary text-on-primary font-headline font-bold text-sm hover:brightness-110 transition-all active:scale-95">
                Contact me
              </Link>
              <Link to="/projects" className="inline-block border border-outline-variant px-8 py-4 text-center text-on-surface font-headline font-bold text-sm hover:bg-surface-container-high transition-all active:scale-95">
                View Manifest
              </Link>
            </div>
          </AnimateIn>

          <AnimateIn delay={150} className="hidden items-center justify-center md:flex lg:justify-end">
            <img
              alt="Seviko Attalarik P.H"
              className="h-105 w-auto object-contain lg:h-140"
              src="https://firebasestorage.googleapis.com/v0/b/portfolio-seviko.firebasestorage.app/o/bg%20putih.png?alt=media&token=6cfb4203-5e16-409a-9401-3e7bcb47bb98"
            />
          </AnimateIn>
        </div>
      </section>

      {/* ── 2. Skills ── bg-surface-container-low ── */}
      <section className="bg-surface-container-low px-4 py-20 sm:px-6 md:px-12 md:py-24">
        <div className="max-w-7xl mx-auto">
          <AnimateIn>
            <div className="mb-12 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
              <h2 className="text-3xl font-headline font-bold lowercase tracking-tighter text-on-surface sm:text-4xl">
                #core_competencies
              </h2>
              <div className="h-px w-full grow bg-outline-variant/20"></div>
            </div>
          </AnimateIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: 'deployed_code', title: 'Web Development', tags: ['Node.js', 'Express.js', 'React.js', 'JavaScript', 'TypeScript', 'Postman'] },
              { icon: 'cloud_queue', title: 'Cloud & Infrastructure', tags: ['Google Cloud Platform', 'Firebase', 'Computer Networking', 'Cisco Packet Tracer'] },
              { icon: 'neurology', title: 'AI, Data & Embedded Systems', tags: ['Machine Learning', 'Python', 'Data Structures', 'Algorithms', 'Arduino', 'C++', 'Tensorflow', 'PyTorch', 'Scikit-learn'] },
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
        <section className="bg-background px-4 py-20 sm:px-6 md:px-12 md:py-24">
          <div className="max-w-7xl mx-auto">
            <AnimateIn>
              <div className="mb-12 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
                <h2 className="text-3xl font-headline font-bold lowercase tracking-tighter text-on-surface sm:text-4xl">
                  #latest_publication
                </h2>
                <div className="h-px w-full grow bg-outline-variant/20"></div>
                <Link to="/publications" className="flex items-center gap-2 text-primary font-label text-xs uppercase hover:underline sm:shrink-0">
                  View All <span className="material-symbols-outlined text-sm">arrow_outward</span>
                </Link>
              </div>
            </AnimateIn>
            <AnimateIn delay={100}>
              <div className="flex flex-col items-start gap-6 border border-primary/20 bg-surface-container-low p-5 transition-colors hover:border-primary/50 sm:p-8 md:flex-row md:items-center">
                <div className="bg-primary/10 p-4 rounded-full text-primary shrink-0 hidden md:block">
                  <span className="material-symbols-outlined text-4xl">workspace_premium</span>
                </div>
                <div className="min-w-0 grow">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="bg-primary/20 text-primary font-mono text-[10px] px-2 py-1 uppercase tracking-widest border border-primary/30">{latestPublication.type}</span>
                    <span className="text-on-surface-variant font-mono text-[10px] uppercase tracking-widest">{latestPublication.year}</span>
                  </div>
                  <h3 className="mb-3 wrap-break-words text-xl font-headline font-bold text-on-surface md:text-2xl">
                    {latestPublication.title}
                  </h3>
                  <p className="line-clamp-3 text-on-surface-variant font-body text-sm">
                    {latestPublication.abstract}
                  </p>
                </div>
                <div className="mt-2 w-full shrink-0 md:mt-0 md:w-auto">
                  <Link to="/publications" className="block w-full bg-primary px-6 py-3 text-center text-sm font-bold text-on-primary font-headline transition-all hover:brightness-110 active:scale-95 md:w-auto md:whitespace-nowrap">
                    Read Paper
                  </Link>
                </div>
              </div>
            </AnimateIn>
          </div>
        </section>
      )}

      {/* ── 4. Latest Projects ── bg-surface-container-low ── */}
      {latestExperiences.length > 0 && (
        <section className={`px-4 py-20 sm:px-6 md:px-12 md:py-24 ${latestPublication ? 'bg-surface-container-low' : 'bg-background'}`}>
          <div className="max-w-7xl mx-auto">
            <AnimateIn>
              <div className="mb-12 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
                <h2 className="text-3xl font-headline font-bold lowercase tracking-tighter text-on-surface sm:text-4xl">
                  #experience
                </h2>
                <div className="h-px w-full grow bg-outline-variant/20"></div>
                <Link to="/experience" className="flex items-center gap-2 text-primary font-label text-xs uppercase hover:underline sm:shrink-0">
                  View All <span className="material-symbols-outlined text-sm">arrow_outward</span>
                </Link>
              </div>
            </AnimateIn>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {latestExperiences.map((experience, idx) => {
                const totalDuration = calculateExperienceTotalDuration(experience);

                return (
                <AnimateIn key={experience.id} delay={idx * 80}>
                  <article className="group flex h-full flex-col border border-outline-variant/10 bg-surface p-6 transition-all duration-300 hover:border-primary/50">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      {experience.category && (
                        <span className="border border-primary/30 bg-primary/15 px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-primary">
                          {experience.category}
                        </span>
                      )}
                      {experience.employmentType && (
                        <span className="border border-secondary/25 bg-secondary/10 px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-secondary">
                          {experience.employmentType}
                        </span>
                      )}
                      {totalDuration && (
                        <span className="text-[10px] font-mono uppercase tracking-wider text-outline">
                          {totalDuration}
                        </span>
                      )}
                    </div>

                    <h3 className="mb-3 wrap-break-words text-xl font-headline font-bold text-on-surface transition-colors group-hover:text-primary">
                      {experience.company}
                    </h3>

                    <p className="mb-5 line-clamp-3 text-sm leading-relaxed text-on-surface-variant">
                      {experience.summary ?? `${experience.roles.length} roles recorded in this experience group.`}
                    </p>

                    <div className="mt-auto space-y-3">
                      {experience.roles.slice(0, 2).map((role) => (
                        <div key={`${experience.id}-${role.title}-${role.startDate}-${role.endDate ?? 'present'}`} className="border-l-2 border-secondary/60 pl-3">
                          <div className="text-sm font-headline font-bold text-on-surface">{role.title}</div>
                          <div className="mt-1 text-[10px] font-mono uppercase tracking-wider text-on-surface-variant">
                            {formatExperiencePeriod(role)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </article>
                </AnimateIn>
              )})}
            </div>
          </div>
        </section>
      )}

      <section className={`px-4 py-20 sm:px-6 md:px-12 md:py-24 ${projectsSectionBg}`}>
        <div className="max-w-7xl mx-auto">
          <AnimateIn>
            <div className="mb-12 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
              <h2 className="text-3xl font-headline font-bold lowercase tracking-tighter text-on-surface sm:text-4xl">
                #latest_projects
              </h2>
              <div className="h-px w-full grow bg-outline-variant/20"></div>
              <Link to="/projects" className="flex items-center gap-2 text-primary font-label text-xs uppercase hover:underline sm:shrink-0">
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
                    <div className="p-6 flex flex-col grow">
                      <div className="font-label text-[10px] text-secondary mb-2 uppercase tracking-tighter">{project.category}</div>
                      <h3 className="mb-3 wrap-break-words text-xl font-headline font-bold text-on-surface transition-colors group-hover:text-primary">{project.title}</h3>
                      <p className="mb-6 wrap-break-words text-sm leading-relaxed text-on-surface-variant grow">{project.description}</p>
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
      <section className={`px-4 py-20 sm:px-6 md:px-12 md:py-24 ${aboutSectionBg}`}>
        <AnimateIn>
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <div className="mb-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
                <h2 className="text-3xl font-headline font-bold lowercase tracking-tighter text-on-surface sm:text-4xl">
                  #about
                </h2>
                <div className="h-px w-full grow bg-outline-variant/20"></div>
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
                  <span>origin: [YOGYAKARTA, ID]</span>
                </div>
              </div>
            </div>
          </div>
        </AnimateIn>
      </section>

      {/* ── 6. Contact CTA ── bg-surface-container-low ── */}
      <section className={`relative overflow-hidden border-t border-outline-variant/10 px-4 py-20 sm:px-6 md:px-12 md:py-24 ${contactSectionBg}`}>
        <div className="absolute inset-0 dot-grid opacity-5 z-0"></div>
        <AnimateIn className="relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8 flex items-center justify-center gap-4">
              <h2 className="text-3xl font-headline font-bold lowercase tracking-tighter text-on-surface sm:text-4xl">
                #contact
              </h2>
            </div>
            <p className="text-on-surface-variant font-body mb-10 max-w-xl mx-auto leading-relaxed text-lg">
              Whether you have a specific AI project in mind or need a scalable backend architecture, my inbox is always monitored.
            </p>
            <div className="flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center">
              <div className="flex min-w-0 items-center space-x-3 border border-outline-variant/10 bg-surface-container-highest/50 px-4 py-3 sm:px-6">
                <span className="material-symbols-outlined text-primary">mail</span>
                <span className="break-all text-sm font-mono text-on-surface">attalarik.handoko@gmail.com</span>
              </div>
              <Link to="/contacts" className="bg-primary px-8 py-3 text-center text-sm font-bold uppercase tracking-wider text-on-primary font-headline transition-all hover:brightness-110">
                Full Contact Info
              </Link>
            </div>
          </div>
        </AnimateIn>
      </section>

    </main>
  );
}
