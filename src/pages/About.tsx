export default function About() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 md:px-12 md:pb-24 md:pt-32">
      <h1 className="mb-12 font-headline text-4xl font-bold tracking-tighter text-on-surface sm:text-5xl md:mb-16 md:text-7xl">
        #<span className="text-primary">About</span>
      </h1>
      {/* Hero Bio Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24 md:mb-32 items-start">
        <div className="lg:col-span-7">
          <header className="mb-12 animate-[fadeUp_0.7s_ease_both]">
            <p className="mb-6 font-headline text-4xl font-bold lowercase leading-tight tracking-tighter text-on-surface sm:text-5xl md:text-6xl">
              engineering <span className="text-primary">ideas</span> <br />into scalable systems.
            </p>
          </header>
          <div className="max-w-2xl space-y-6 leading-relaxed text-on-surface-variant font-body animate-[fadeUp_0.7s_0.15s_ease_both]">
            <p className="text-base">
              I work at the intersection of software engineering and machine intelligence, turning abstract ideas into systems that actually scale. My focus is not just building things that work, but building things that remain efficient, maintainable, and predictable under real-world constraints.
            </p>
            <p className="text-base">
              My journey started from curiosity in low-level systems and evolved into designing backend architectures and AI-driven solutions. I care deeply about performance, clarity, and eliminating unnecessary complexity. For me, good engineering is not about adding more layers, but about reducing them until only what truly matters remains.
            </p>
            <p className="text-base">
              I believe every system should have a clear purpose, every abstraction should justify its existence, and every line of code should move the product forward. Simplicity is not a lack of sophistication, it is the result of deliberate thinking.
            </p>
            
            <div className="h-px bg-linear-to-r from-primary/20 to-transparent w-full my-8"></div>
            
            <div className="flex flex-wrap gap-4 font-mono">
              <div className="flex items-center gap-2 text-xs text-on-surface">
                <span className="material-symbols-outlined text-primary text-sm">terminal</span>
                <span>currently_available: true</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-on-surface">
                <span className="material-symbols-outlined text-secondary text-sm">location_on</span>
                <span>origin: [YOGYAKARTA, ID]</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-5 relative animate-[fadeUp_0.7s_0.3s_ease_both]">
          <div className="glass-panel-soft aspect-4/5 border border-outline-variant/15">
            <img 
              className="w-full h-full object-cover grayscale opacity-80 hover:opacity-100 hover:grayscale-0 transition-all duration-700" 
              alt="Seviko Attalarik" 
              src="https://firebasestorage.googleapis.com/v0/b/portfolio-seviko.firebasestorage.app/o/bg%20putih.png?alt=media&token=6cfb4203-5e16-409a-9401-3e7bcb47bb98" 
            />
            <div className="absolute -bottom-4 -right-4 bg-primary text-on-primary p-6 font-bold text-2xl lowercase tracking-tighter hidden md:block font-headline">
              SEVIKO
            </div>
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="relative mb-24 overflow-hidden md:mb-32">
        <div className="relative z-10">
          <div className="mb-10 flex flex-col items-start gap-3 animate-[fadeUp_0.6s_ease_both] sm:mb-12 sm:flex-row sm:items-center sm:gap-4">
            <h2 className="font-headline text-2xl font-bold lowercase tracking-tighter text-on-surface sm:text-3xl">
              education
            </h2>
            <div className="h-px w-full grow bg-outline-variant/20"></div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {[
              {
                school: 'Universitas Pembangunan Nasional Veteran Yogyakarta',
                program: 'Informatics',
                period: 'Aug 2022 - Mar 2026',
                grade: '3.89',
                level: 'Bachelor of Informatics',
              },
              {
                school: 'SMA Negeri 1 Yogyakarta',
                program: 'Senior High School',
                period: 'Jul 2019 - Jun 2022',
                grade: null,
                level: 'High School Diploma',
              },
            ].map((item, i) => (
              <article
                key={item.school}
                className="glass-panel group border border-outline-variant/10 p-6 transition-colors hover:border-primary/40 sm:p-8 animate-[fadeUp_0.6s_ease_both]"
                style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'both' }}
              >
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="mb-2 text-[10px] font-mono uppercase tracking-[0.28em] text-outline">
                      {item.level}
                    </p>
                    <h3 className="text-xl font-headline font-bold lowercase tracking-tighter text-on-surface transition-colors group-hover:text-primary sm:text-2xl">
                      {item.school}
                    </h3>
                  </div>
                  <span className="material-symbols-outlined text-primary transition-transform group-hover:scale-110">
                    school
                  </span>
                </div>

                <div className="space-y-3 font-body text-sm leading-relaxed text-on-surface-variant">
                  <p>
                    <span className="text-on-surface">Program:</span> {item.program}
                  </p>
                  <p>
                    <span className="text-on-surface">Period:</span> {item.period}
                  </p>
                  {item.grade && (
                    <p>
                      <span className="text-on-surface">Grade:</span> {item.grade}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Stack */}
      <section className="relative mb-24 overflow-hidden md:mb-32">
        <div className="relative z-10">
        <div className="mb-10 flex flex-col items-start gap-3 animate-[fadeUp_0.6s_ease_both] sm:mb-12 sm:flex-row sm:items-center sm:gap-4">
          <h2 className="font-headline text-2xl font-bold lowercase tracking-tighter text-on-surface sm:text-3xl">technical_stack</h2>
          <div className="h-px w-full grow bg-outline-variant/20"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          {[
            { icon: 'data_object', num: '01 / core', title: 'languages', tags: ['C++', 'Java', 'JavaScript', 'Python', 'PHP', 'HTML5', 'Kotlin', 'SQL'] },
            { icon: 'deployed_code', num: '02 / frontend', title: 'frontend_&_ui', tags: ['React', 'React Router', 'Tailwind CSS', 'Bootstrap', 'Qt'] },
            { icon: 'dns', num: '03 / backend', title: 'backend_&_runtime', tags: ['Node.js', 'Express.js', 'Nodemon', 'JWT', 'Apache', 'OpenCV'] },
            { icon: 'cloud_queue', num: '04 / infra', title: 'cloud_database_&_tools', tags: ['Firebase', 'Supabase', 'MongoDB', 'Postgres', 'MySQL', 'MariaDB', 'Netlify', 'GitHub Pages', 'Vercel', 'NPM', 'Postman', 'Cisco', 'Arduino', 'ESPRESSIF'] },
          ].map(({ icon, num, title, tags }, i) => (
            <div
              key={title}
              className="glass-panel border border-outline-variant/10 p-8 animate-[fadeUp_0.6s_ease_both]"
              style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'both' }}
            >
              <div className="flex justify-between items-center mb-8">
                <span className="material-symbols-outlined text-primary">{icon}</span>
                <span className="text-[10px] text-outline uppercase tracking-widest font-mono">{num}</span>
              </div>
              <h3 className="text-xl mb-6 lowercase text-on-surface font-headline">{title}</h3>
              <div className="flex flex-wrap gap-2 font-mono">
                {tags.map(t => (
                  <span key={t} className="glass-chip px-3 py-1 text-secondary text-[11px] hover:bg-secondary hover:text-on-secondary transition-colors cursor-default">{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* Fun Facts */}
      <section className="relative mb-24 overflow-hidden md:mb-32">
        <div className="relative z-10">
        <div className="mb-10 flex flex-col items-start gap-3 animate-[fadeUp_0.6s_ease_both] sm:mb-12 sm:flex-row sm:items-center sm:gap-4">
          <h2 className="font-headline text-2xl font-bold lowercase tracking-tighter text-on-surface sm:text-3xl">fun_facts</h2>
          <div className="h-px w-full grow bg-outline-variant/20"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4 font-body">
            {[
              { icon: 'memory', text: 'Obsessed with optimizing models beyond what most people consider "good enough."' },
              { icon: 'keyboard', text: 'Writes scripts to eliminate even the smallest repetitive task.' },
              { icon: 'auto_stories', text: 'Enjoys breaking down complex systems just to rebuild them simpler.' },
              { icon: 'explore', text: 'Prefers understanding fundamentals over chasing trends.' },
            ].map(({ icon, text }, i) => (
              <div
                key={icon}
                className="glass-panel group flex items-center border border-outline-variant/10 p-6 transition-colors hover:border-primary/40 animate-[fadeUp_0.6s_ease_both]"
                style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'both' }}
              >
                <span className="material-symbols-outlined mr-6 text-primary group-hover:scale-110 transition-transform">{icon}</span>
                <p className="text-on-surface italic text-sm">{text}</p>
              </div>
            ))}
          </div>
          
          <div className="glass-panel-soft flex flex-col justify-center px-5 py-8 font-mono animate-[fadeUp_0.6s_0.3s_ease_both] sm:px-8" style={{ animationFillMode: 'both' }}>
            <div className="grid grid-cols-1 gap-4">
              {[
                { label: 'languages_spoken', value: 'id / en' },
                { label: 'focus_area', value: 'deep_learning' },
                { label: 'currently_learning', value: 'web3' },
                { label: 'os_choice', value: 'windows / linux' },
              ].map(({ label, value }) => (
                <div key={label} className="glass-chip border-l-2 border-secondary p-4">
                  <span className="text-xs text-outline block mb-1">{label}</span>
                  <span className="text-on-surface text-sm">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        </div>
      </section>
      </div>
    </main>
  );
}
