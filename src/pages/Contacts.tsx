export default function Contacts() {
  return (
    <main className="relative min-h-screen overflow-x-clip bg-background font-body">
      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 md:px-12 md:pb-24 md:pt-32">
        {/* Header Section */}
        <header className="mb-16 md:mb-20">
          <h1 className="mb-4 wrap-break-words font-headline text-3xl font-bold tracking-tighter text-on-surface sm:text-4xl md:text-6xl lg:text-7xl">
            #<span className="text-primary">Contacts</span>
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
            Let&apos;s bridge the gap between data logic and execution. I&apos;m currently open to new collaborations and high-impact machine learning projects.
          </p>
        </header>

        {/* Contact Layout */}
        <div className="max-w-5xl">
        
        {/* Primary Contact Card */}
        <section className="glass-panel group relative mb-6 border border-outline-variant/10 p-5 sm:p-7 md:p-10">
          <div className="mb-10 flex items-start justify-between gap-4 sm:mb-12">
            <h2 className="font-headline text-xl font-bold lowercase text-on-surface sm:text-2xl">interested in working together?</h2>
            <span className="material-symbols-outlined text-outline-variant">arrow_outward</span>
          </div>
          <p className="text-on-surface-variant mb-10 max-w-2xl leading-relaxed">
            Whether you have a specific AI project in mind, need a scalable backend architecture, or just want to discuss the future of tech, my inbox is always monitored.
          </p>
          <div className="w-full font-mono">
            <div className="glass-chip flex w-full min-w-0 items-center space-x-4 border border-outline-variant/5 p-4">
              <span className="material-symbols-outlined text-primary">mail</span>
              <span className="min-w-0 flex-1 break-all text-sm text-on-surface md:text-left">attalarik.handoko@gmail.com</span>
            </div>
          </div>
        </section>

        {/* Socials Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <a href="https://www.instagram.com/sevikoarik_/" target="_blank" rel="noopener noreferrer" className="glass-panel-soft flex min-h-28 flex-col items-center justify-center border border-outline-variant/5 p-6 transition-colors group hover:border-primary/20 hover:bg-surface-container-highest md:p-7">
            <span className="material-symbols-outlined text-2xl mb-3 text-slate-500 group-hover:text-primary">photo_camera</span>
            <span className="text-[10px] uppercase tracking-[0.18em] font-mono text-on-surface">instagram</span>
          </a>
          <a href="https://github.com/SevikoA3" target="_blank" rel="noopener noreferrer" className="glass-panel-soft flex min-h-28 flex-col items-center justify-center border border-outline-variant/5 p-6 transition-colors group hover:border-primary/20 hover:bg-surface-container-highest md:p-7">
            <span className="material-symbols-outlined text-2xl mb-3 text-slate-500 group-hover:text-primary">terminal</span>
            <span className="text-[10px] uppercase tracking-[0.18em] font-mono text-on-surface">github</span>
          </a>
          <a href="https://www.linkedin.com/in/seviko/" target="_blank" rel="noopener noreferrer" className="glass-panel-soft flex min-h-28 flex-col items-center justify-center border border-outline-variant/5 p-6 transition-colors group hover:border-primary/20 hover:bg-surface-container-highest md:p-7">
            <span className="material-symbols-outlined text-2xl mb-3 text-slate-500 group-hover:text-primary">work</span>
            <span className="text-[10px] uppercase tracking-[0.18em] font-mono text-on-surface">linkedin</span>
          </a>
        </section>
        </div>

        {/* Availability Banner */}
        <div className="mt-16 flex flex-col items-start gap-4 md:mt-20 sm:flex-row sm:items-center sm:gap-6">
          <div className="flex items-center space-x-2 min-w-0">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
            </span>
            <span className="text-[10px] text-secondary font-mono tracking-[0.2em] sm:text-xs sm:tracking-widest">AVAILABILITY: OPEN FOR WORK</span>
          </div>
          <div className="h-px flex-1 self-stretch bg-outline-variant/10 sm:self-auto"></div>
        </div>
      </div>
    </main>
  );
}
