export default function Contacts() {
  return (
    <main className="pt-32 pb-20 px-8 max-w-7xl mx-auto min-h-screen relative overflow-hidden font-body">
      {/* Background Texture */}
      <div className="absolute inset-0 dot-grid -z-10"></div>
      
      {/* Header Section */}
      <header className="mb-20">
        <div className="inline-block bg-surface-container-high px-3 py-1 mb-6 border-l-2 border-primary">
          <span className="text-xs text-secondary uppercase tracking-widest font-mono">establishing_connection...</span>
        </div>
        <h1 className="font-headline text-5xl md:text-7xl font-bold lowercase tracking-tighter text-on-surface mb-4">
          #contacts
        </h1>
        <p className="text-slate-400 max-w-xl text-lg leading-relaxed">
          Let's bridge the gap between data logic and execution. I'm currently open to new collaborations and high-impact machine learning projects.
        </p>
      </header>

      {/* Bento Grid Contact Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Primary Contact Card */}
        <section className="md:col-span-7 bg-surface-container-low p-8 relative group border border-outline-variant/10">
          <div className="flex justify-between items-start mb-12">
            <h2 className="font-headline text-2xl font-bold lowercase text-on-surface">interested in working together?</h2>
            <span className="material-symbols-outlined text-outline-variant">arrow_outward</span>
          </div>
          <p className="text-on-surface-variant mb-10 max-w-md">
            Whether you have a specific AI project in mind, need a scalable backend architecture, or just want to discuss the future of tech, my inbox is always monitored.
          </p>
          <div className="space-y-4 font-mono">
            <div className="flex items-center space-x-4 p-4 bg-surface-container-highest/30 border border-outline-variant/5">
              <span className="material-symbols-outlined text-primary">mail</span>
              <span className="text-sm text-on-surface">seviko.attalarik@example.com</span>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-surface-container-highest/30 border border-outline-variant/5">
              <span className="material-symbols-outlined text-secondary">alternate_email</span>
              <span className="text-sm text-on-surface">seviko_dev (discord)</span>
            </div>
          </div>
        </section>

        {/* Map/Location Card */}
        <section className="md:col-span-5 bg-surface-container-high overflow-hidden relative border border-outline-variant/10">
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container-high via-transparent to-transparent z-10"></div>
          <img 
            className="w-full h-full object-cover opacity-40 grayscale" 
            alt="Jakarta" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGtcxqwlZX-Y9A-9nsaL-GK91e1Voc4DZ7hlVUCXIoaQ68tiE2WOnFUqqwATB7Z-pnySTJXBq0SUkHpOjVnmZzLHvrz78rtTgrz7xI1r3_A_D5p7a1qtSZLLruNFTpEHttjQ7sIInD6rXvdWPoWAG0a4dR025RRXLt3GihZV5Vi7X3-tqI5RVphIZFS2n6oPwetjDOqBnQzksaKO4Y2bg6j5TUASHhr-or5zNd7ssLOa-zbJNxIgwPQ84hNs8Y_YLwZQJc92Gy9LU" 
          />
          <div className="absolute bottom-6 left-6 z-20">
            <div className="text-[10px] text-primary uppercase tracking-[0.2em] mb-1 font-mono">location_status</div>
            <div className="font-headline text-xl font-bold lowercase text-on-surface">remote / jakarta, id</div>
          </div>
        </section>

        {/* Socials Grid */}
        <section className="md:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          <a href="#" className="bg-surface-container-high p-6 flex flex-col items-center justify-center border border-outline-variant/5 hover:bg-surface-container-highest transition-colors group">
            <span className="material-symbols-outlined text-2xl mb-3 text-slate-500 group-hover:text-primary">monitoring</span>
            <span className="text-[10px] uppercase tracking-tighter font-mono text-on-surface">twitter</span>
          </a>
          <a href="#" className="bg-surface-container-high p-6 flex flex-col items-center justify-center border border-outline-variant/5 hover:bg-surface-container-highest transition-colors group">
            <span className="material-symbols-outlined text-2xl mb-3 text-slate-500 group-hover:text-primary">terminal</span>
            <span className="text-[10px] uppercase tracking-tighter font-mono text-on-surface">github</span>
          </a>
          <a href="#" className="bg-surface-container-high p-6 flex flex-col items-center justify-center border border-outline-variant/5 hover:bg-surface-container-highest transition-colors group">
            <span className="material-symbols-outlined text-2xl mb-3 text-slate-500 group-hover:text-primary">work</span>
            <span className="text-[10px] uppercase tracking-tighter font-mono text-on-surface">linkedin</span>
          </a>
          <a href="#" className="bg-surface-container-high p-6 flex flex-col items-center justify-center border border-outline-variant/5 hover:bg-surface-container-highest transition-colors group">
            <span className="material-symbols-outlined text-2xl mb-3 text-slate-500 group-hover:text-primary">article</span>
            <span className="text-[10px] uppercase tracking-tighter font-mono text-on-surface">medium</span>
          </a>
        </section>
      </div>

      {/* Availability Banner */}
      <div className="mt-20 flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
          </span>
          <span className="text-xs text-secondary font-mono tracking-widest">AVAILABILITY: OPEN FOR WORK</span>
        </div>
        <div className="h-px flex-1 bg-outline-variant/10"></div>
      </div>
    </main>
  );
}
