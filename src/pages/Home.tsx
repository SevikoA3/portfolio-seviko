import { useEffect, useState } from 'react';
import { fetchCertificates, fetchExperiences, fetchProjects, fetchPublications } from '../lib/api';
import type { Certificate, Experience, Project, Publication } from '../lib/types';
import { Link } from 'react-router-dom';
import AnimateIn from '../components/AnimateIn';
import { calculateExperienceTotalDuration, formatExperiencePeriod } from '../lib/experienceDates';
import { getResponsiveImageSrcSet, getResponsiveImageUrl } from '../lib/imageUrl';

export default function Home() {
  const [latestProjects, setLatestProjects] = useState<Project[]>([]);
  const [latestPublication, setLatestPublication] = useState<Publication | null>(null);
  const [latestExperiences, setLatestExperiences] = useState<Experience[]>([]);
  const [latestCertificates, setLatestCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [projData, pubData, expData, certData] = await Promise.all([
        fetchProjects(true),
        fetchPublications(true),
        fetchExperiences(true),
        fetchCertificates(true)
      ]);
      setLatestProjects(projData);
      setLatestPublication(pubData.length > 0 ? pubData[0] : null);
      setLatestExperiences(expData);
      setLatestCertificates(certData);
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

const HERO_IMAGE_URL = 'https://firebasestorage.googleapis.com/v0/b/portfolio-seviko.firebasestorage.app/o/bg%20putih.png?alt=media&token=6cfb4203-5e16-409a-9401-3e7bcb47bb98';

  return (
    <main className="overflow-x-clip">

      {/* ── 1. Hero ── bg-background ── */}
      <section className="relative flex min-h-[calc(100vh-4rem)] items-stretch overflow-hidden bg-background px-4 sm:px-6 md:px-12">
        <div className="z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-7 py-10 sm:gap-10 sm:py-14 md:gap-12 md:py-[clamp(3rem,10vh,6rem)] lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <AnimateIn delay={0}>
            <div className="mb-6 inline-flex items-center gap-2 border border-secondary/40 px-3 py-1 font-label text-[10px] uppercase tracking-widest text-secondary">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-secondary shadow-[0_0_12px_rgba(156,239,255,0.8)]" />
              available for selected projects
            </div>
            <h1 className="mb-6 text-4xl font-headline font-bold leading-tight tracking-tighter text-on-surface sm:text-5xl md:text-6xl">
              <span className="text-primary italic">AI/ML Engineer</span> &amp;<br />
              Backend Developer
            </h1>
            <p className="mb-10 max-w-xl text-base leading-relaxed text-on-surface-variant font-body sm:text-lg">
              I&apos;m Seviko, an AI/ML engineer and backend developer who turns complex ideas into reliable products, from research prototypes to systems people can use.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <Link to="/contacts" className="inline-block bg-primary px-8 py-4 text-center text-sm font-bold text-on-primary transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-95">
                Contact me
              </Link>
              <Link to="/projects" className="inline-block border border-outline-variant px-8 py-4 text-center text-sm font-bold text-on-surface transition-all hover:bg-surface-container-high focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-95">
                View my work
              </Link>
            </div>
          </AnimateIn>

          <div className="relative mx-auto flex w-full max-w-[min(100%,32rem)] items-end justify-center sm:max-w-96 md:w-[min(100%,calc(100dvh-11rem))] md:max-w-[40rem] lg:mx-0 lg:max-w-[40rem] lg:justify-self-end">
            <img
              alt="Seviko Attalarik P.H"
              width={1024}
              height={1024}
              sizes="(min-width: 1024px) 40vw, (min-width: 640px) 45vw, 80vw"
              className={`h-auto w-full object-contain drop-shadow-[0_24px_60px_rgba(0,0,0,0.45)] transition-opacity duration-500 ${heroImageLoaded ? 'opacity-100' : 'opacity-0'}`}
              decoding="async"
              fetchPriority="high"
              loading="eager"
              onLoad={() => setHeroImageLoaded(true)}
              src={HERO_IMAGE_URL}
            />
            {heroImageLoaded && (
              <div aria-hidden="true" className="absolute -bottom-1 left-[14%] right-[14%] h-1 rounded-full bg-linear-to-r from-transparent via-primary to-transparent shadow-[0_0_22px_rgba(180,145,255,0.75)]" />
            )}
          </div>
        </div>
      </section>

      {/* ── 2. Skills ── bg-surface-container-low ── */}
      <section className="relative overflow-hidden bg-surface-container-low px-4 py-20 sm:px-6 md:px-12 md:py-24">
        <div className="relative z-10 max-w-7xl mx-auto">
          <AnimateIn>
            <div className="mb-12 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
              <h2 className="text-3xl font-headline font-bold lowercase tracking-tighter text-on-surface sm:text-4xl">
                Core competencies
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
                <div className="group h-full border border-outline-variant/10 bg-[rgba(13,13,28,0.72)] p-8 motion-safe:transition-[transform,border-color,box-shadow] motion-safe:duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_18px_50px_rgba(7,10,24,0.24)]">
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
        <section className="relative overflow-hidden bg-background px-4 py-20 sm:px-6 md:px-12 md:py-24">
          <div className="relative z-10 max-w-7xl mx-auto">
            <AnimateIn>
              <div className="mb-12 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
                <h2 className="text-3xl font-headline font-bold lowercase tracking-tighter text-on-surface sm:text-4xl">
                  Latest publication
                </h2>
                <div className="h-px w-full grow bg-outline-variant/20"></div>
                <Link to="/publications" className="flex items-center gap-2 text-primary font-label text-xs uppercase hover:underline sm:shrink-0">
                  View All <span className="material-symbols-outlined text-sm">arrow_outward</span>
                </Link>
              </div>
            </AnimateIn>
            <AnimateIn delay={100}>
              <div className="flex flex-col items-start gap-6 border border-primary/20 bg-[rgba(18,18,35,0.74)] p-5 motion-safe:transition-[transform,border-color,box-shadow] motion-safe:duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_18px_50px_rgba(7,10,24,0.24)] sm:p-8 md:flex-row md:items-center">
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
                  <Link to="/publications" className="block w-full bg-primary px-6 py-3 text-center text-sm font-bold text-on-primary transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-95 md:w-auto md:whitespace-nowrap">
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
        <section className={`relative overflow-hidden px-4 py-20 sm:px-6 md:px-12 md:py-24 ${latestPublication ? 'bg-surface-container-low' : 'bg-background'}`}>
          <div className="relative z-10 max-w-7xl mx-auto">
            <AnimateIn>
              <div className="mb-12 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
                <h2 className="text-3xl font-headline font-bold lowercase tracking-tighter text-on-surface sm:text-4xl">
                  Experience
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
                  <article className="group flex h-full flex-col border border-outline-variant/10 bg-[rgba(13,13,28,0.72)] p-6 motion-safe:transition-[transform,border-color,box-shadow] motion-safe:duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_18px_50px_rgba(7,10,24,0.24)]">
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
                          <span className="text-[10px] font-mono uppercase tracking-wider text-on-surface-variant">
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

                    <div className="space-y-3">
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

      {latestCertificates.length > 0 && (
        <section className="relative overflow-hidden bg-background px-4 py-20 sm:px-6 md:px-12 md:py-24">
          <div className="relative z-10 max-w-7xl mx-auto">
            <AnimateIn>
              <div className="mb-12 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
                <h2 className="text-3xl font-headline font-bold lowercase tracking-tighter text-on-surface sm:text-4xl">
                  Certificates
                </h2>
                <div className="h-px w-full grow bg-outline-variant/20"></div>
                <Link to="/certificates" className="flex items-center gap-2 text-primary font-label text-xs uppercase hover:underline sm:shrink-0">
                  View All <span className="material-symbols-outlined text-sm">arrow_outward</span>
                </Link>
              </div>
            </AnimateIn>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {latestCertificates.map((certificate, idx) => (
                <AnimateIn key={certificate.id} delay={idx * 80}>
                  <article className="group flex h-full flex-col overflow-hidden border border-outline-variant/10 bg-[rgba(13,13,28,0.72)] motion-safe:transition-[transform,border-color,box-shadow] motion-safe:duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-[0_18px_50px_rgba(7,10,24,0.24)]">
                    <div className="aspect-4/3 overflow-hidden bg-[rgba(18,18,35,0.62)]">
                      <img
                        alt={certificate.title}
                        loading="lazy"
                        decoding="async"
                        width={640}
                        height={480}
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        srcSet={getResponsiveImageSrcSet(certificate.thumbnailUrl, [320, 640, 960])}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        src={getResponsiveImageUrl(certificate.thumbnailUrl, 640)}
                      />
                    </div>
                    <div className="flex grow flex-col p-6">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span className="border border-primary/30 bg-primary/15 px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-primary">
                          {certificate.category}
                        </span>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-on-surface-variant">
                          {certificate.issuedAtLabel}
                        </span>
                      </div>
                      <h3 className="mb-3 wrap-break-words text-xl font-headline font-bold text-on-surface transition-colors group-hover:text-primary">
                        {certificate.title}
                      </h3>
                      <p className="mb-4 text-sm text-on-surface-variant">
                        {certificate.issuer}
                      </p>
                      <p className="grow text-sm leading-relaxed text-on-surface-variant">
                        {certificate.summary}
                      </p>
                      <div className="mt-6">
                        <Link to="/certificates" className="inline-flex items-center gap-2 text-primary font-label text-xs uppercase hover:underline">
                          View certificate <span className="material-symbols-outlined text-sm">arrow_outward</span>
                        </Link>
                      </div>
                    </div>
                  </article>
                </AnimateIn>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className={`relative overflow-hidden px-4 py-20 sm:px-6 md:px-12 md:py-24 ${projectsSectionBg}`}>
        <div className="relative z-10 max-w-7xl mx-auto">
          <AnimateIn>
            <div className="mb-12 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
              <h2 className="text-3xl font-headline font-bold lowercase tracking-tighter text-on-surface sm:text-4xl">
                Latest projects
              </h2>
              <div className="h-px w-full grow bg-outline-variant/20"></div>
              <Link to="/projects" className="flex items-center gap-2 text-primary font-label text-xs uppercase hover:underline sm:shrink-0">
                View All <span className="material-symbols-outlined text-sm">arrow_outward</span>
              </Link>
            </div>
          </AnimateIn>

          {loading ? (
            <div className="flex justify-center py-20 text-secondary items-center animate-pulse gap-2">
              <span className="material-symbols-outlined animate-spin">progress_activity</span> Loading selected work...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {latestProjects.map((project, idx) => (
                <AnimateIn key={project.id} delay={idx * 80}>
                  <div className="group flex h-full flex-col border border-outline-variant/10 bg-[rgba(13,13,28,0.72)] transition-colors duration-300 hover:border-primary/60">
                    <div className="aspect-video overflow-hidden bg-[rgba(18,18,35,0.62)]">
                      <img
                        alt={project.title}
                        loading="lazy"
                        decoding="async"
                        width={640}
                        height={360}
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        src={getResponsiveImageUrl(project.imageUrl, 640)}
                      />
                    </div>
                    <div className="p-6 flex flex-col grow">
                      <div className="font-label text-[10px] text-secondary mb-2 uppercase tracking-tighter">{project.category}</div>
                      <h3 className="mb-3 wrap-break-words text-xl font-headline font-bold text-on-surface transition-colors group-hover:text-primary">{project.title}</h3>
                      <p className="mb-6 wrap-break-words text-sm leading-relaxed text-on-surface-variant grow">{project.description}</p>
                      <div className="mt-auto flex flex-wrap gap-2">
                        {project.tags.map(tag => (
                          <span key={tag} className="text-[9px] font-label uppercase text-on-surface-variant">{tag}</span>
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
      <section className={`relative overflow-hidden px-4 py-20 sm:px-6 md:px-12 md:py-24 ${aboutSectionBg}`}>
        <AnimateIn>
          <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <div className="mb-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
                <h2 className="text-3xl font-headline font-bold lowercase tracking-tighter text-on-surface sm:text-4xl">
                  About
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
              <div className="w-full max-w-sm border border-outline-variant/20 bg-[rgba(13,13,28,0.72)] p-6">
                <div className="flex items-center gap-3 text-sm text-on-surface font-mono mb-4">
                  <span className="material-symbols-outlined text-primary text-base">terminal</span>
                  <span>Currently available</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-on-surface font-mono">
                  <span className="material-symbols-outlined text-secondary text-base">location_on</span>
                  <span>Based in Yogyakarta, Indonesia</span>
                </div>
              </div>
            </div>
          </div>
        </AnimateIn>
      </section>

      {/* ── 6. Contact CTA ── bg-surface-container-low ── */}
      <section className={`relative overflow-hidden border-t border-outline-variant/10 px-4 py-20 sm:px-6 md:px-12 md:py-24 ${contactSectionBg}`}>
        <AnimateIn className="relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8 flex items-center justify-center gap-4">
              <h2 className="text-3xl font-headline font-bold lowercase tracking-tighter text-on-surface sm:text-4xl">
                Contact
              </h2>
            </div>
            <p className="text-on-surface-variant font-body mb-10 max-w-xl mx-auto leading-relaxed text-lg">
              Whether you have a specific AI project in mind or need a scalable backend architecture, my inbox is always monitored.
            </p>
            <div className="flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center">
              <div className="flex min-w-0 items-center space-x-3 border border-outline-variant/10 bg-[rgba(29,30,50,0.52)] px-4 py-3 sm:px-6">
                <span className="material-symbols-outlined text-primary">mail</span>
                <span className="break-all text-sm font-mono text-on-surface">attalarik.handoko@gmail.com</span>
              </div>
              <Link to="/contacts" className="bg-primary px-8 py-3 text-center text-sm font-bold uppercase tracking-wider text-on-primary transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                Let&apos;s talk
              </Link>
            </div>
          </div>
        </AnimateIn>
      </section>

    </main>
  );
}
