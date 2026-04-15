import { useEffect, useState } from 'react';
import AnimateIn from '../components/AnimateIn';
import { fetchExperiences, type Experience } from '../lib/firebase';
import { calculateExperienceTotalDuration, calculateRoleDuration, formatExperiencePeriod } from '../lib/experienceDates';

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchExperiences(false);
      setExperiences(data);
      setLoading(false);
    };

    loadData();
  }, []);

  return (
    <main className="mx-auto min-h-screen max-w-7xl bg-background px-4 pb-20 pt-28 sm:px-6 md:px-12 md:pb-24 md:pt-32">
      <AnimateIn>
        <header className="mb-16 md:mb-20">
          <h1 className="mb-6 break-words text-3xl font-headline font-bold tracking-tighter text-on-surface sm:text-4xl md:text-6xl lg:text-7xl">
            #<span className="text-primary">Experience</span>
          </h1>
          <p className="max-w-3xl text-base leading-relaxed text-on-surface-variant font-body sm:text-lg">
            Career timeline sourced from LinkedIn profile data, stored in Firestore, and rendered here as the portfolio&apos;s working history.
          </p>
        </header>
      </AnimateIn>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-20 font-mono text-secondary animate-pulse">
          <span className="material-symbols-outlined">rotate_right</span> Syncing experience.timeline...
        </div>
      ) : experiences.length === 0 ? (
        <div className="py-12 font-mono text-on-surface-variant">
          No experience records found. Run the Firestore seed script first.
        </div>
      ) : (
        <div className="space-y-6 md:space-y-8">
          {experiences.map((experience, index) => {
            const totalDuration = calculateExperienceTotalDuration(experience);

            return (
            <AnimateIn key={experience.id} delay={index * 70}>
              <article className="relative overflow-hidden border border-outline-variant/20 bg-surface-container-low p-5 sm:p-6 md:p-10">
                <div className="absolute left-0 top-0 h-full w-1 bg-primary/80" />

                <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-2xl">
                    <div className="mb-3 flex flex-wrap items-center gap-3">
                      {experience.category && (
                        <span className="border border-primary/30 bg-primary/15 px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-primary">
                          {experience.category}
                        </span>
                      )}
                      {experience.employmentType && (
                        <span className="border border-secondary/25 bg-secondary/10 px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-secondary">
                          {experience.employmentType}
                        </span>
                      )}
                      {experience.workSetup && (
                        <span className="border border-outline-variant/30 px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-on-surface-variant">
                          {experience.workSetup}
                        </span>
                      )}
                      {totalDuration && (
                        <span className="text-xs font-mono uppercase tracking-wider text-on-surface-variant">
                          {totalDuration}
                        </span>
                      )}
                    </div>

                    <h2 className="mb-3 break-words text-2xl font-headline font-bold leading-tight text-on-surface sm:text-3xl">
                      {experience.company}
                    </h2>

                    {(experience.location || experience.summary) && (
                      <div className="space-y-2">
                        {experience.location && (
                          <div className="flex items-center gap-2 text-sm font-mono text-secondary">
                            <span className="material-symbols-outlined text-base">location_on</span>
                            <span>{experience.location}</span>
                          </div>
                        )}
                        {experience.summary && (
                          <p className="max-w-2xl text-sm leading-relaxed text-on-surface-variant sm:text-base">
                            {experience.summary}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="hidden font-headline text-[64px] font-bold opacity-[0.03] lg:block">
                    EXP
                  </div>
                </div>

                <div className="relative z-10 mt-8 space-y-4">
                  {experience.roles.map((role) => (
                    <div
                      key={`${experience.id}-${role.title}-${role.startDate}-${role.endDate ?? 'present'}`}
                      className="border border-outline-variant/15 bg-surface/60 p-4 sm:p-5"
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div className="min-w-0">
                          <h3 className="break-words text-lg font-headline font-bold text-on-surface sm:text-xl">
                            {role.title}
                          </h3>
                          {role.location && (
                            <div className="mt-2 flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-secondary">
                              <span className="material-symbols-outlined text-sm">pin_drop</span>
                              <span>{role.location}</span>
                            </div>
                          )}
                        </div>

                        <div className="shrink-0 font-mono text-xs uppercase tracking-wider text-on-surface-variant md:text-right">
                          <div>{formatExperiencePeriod(role)}</div>
                          <div className="mt-1 text-outline">{calculateRoleDuration(role)}</div>
                        </div>
                      </div>

                      {role.skills && role.skills.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {role.skills.map((skill) => (
                            <span
                              key={`${experience.id}-${role.title}-${skill}`}
                              className="border border-outline-variant/20 bg-surface-container-high px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-secondary"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </article>
            </AnimateIn>
          )})}
        </div>
      )}
    </main>
  );
}
