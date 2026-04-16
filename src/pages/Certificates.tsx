import { useEffect, useState } from 'react';
import AnimateIn from '../components/AnimateIn';
import OrnamentLayer from '../components/OrnamentLayer';
import { fetchCertificates, type Certificate } from '../lib/firebase';

function formatFileTypeLabel(fileType: Certificate['fileType']) {
  return fileType === 'pdf' ? 'PDF Document' : 'Image File';
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchCertificates(false);
      setCertificates(data);
      setLoading(false);
    };

    loadData();
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <OrnamentLayer variant="page" tone="primary" pattern="drift" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 md:px-12 md:pb-24 md:pt-32">
        <AnimateIn>
          <header className="mb-16 md:mb-20">
            <h1 className="mb-6 wrap-break-words text-3xl font-headline font-bold tracking-tighter text-on-surface sm:text-4xl md:text-6xl lg:text-7xl">
              #<span className="text-primary">Certificates</span>
            </h1>
            <p className="max-w-3xl text-base leading-relaxed text-on-surface-variant font-body sm:text-lg">
              A cleaner vault of certifications, awards, and competition milestones. Every entry links back to the original Drive file, with thumbnails mirrored in Firebase Storage for faster browsing.
            </p>
          </header>
        </AnimateIn>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-20 font-mono text-secondary animate-pulse">
            <span className="material-symbols-outlined">rotate_right</span> Syncing certificate.vault...
          </div>
        ) : certificates.length === 0 ? (
          <div className="py-12 font-mono text-on-surface-variant">
            No certificate records found. Run the Firestore seed script first.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            {certificates.map((certificate, index) => (
              <AnimateIn key={certificate.id} delay={index * 70}>
                <article className="group overflow-hidden rounded-[24px] border border-outline-variant/15 bg-surface-container-low transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-[0_20px_60px_rgba(7,10,24,0.28)]">
                  <div className="border-b border-outline-variant/10 bg-linear-to-br from-[#15152b] via-[#111222] to-[#0b0d19] p-4 sm:p-5">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-primary/30 bg-primary/12 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.18em] text-primary">
                        {certificate.category}
                      </span>
                      <span className="rounded-full border border-secondary/20 bg-secondary/8 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.18em] text-secondary">
                        {formatFileTypeLabel(certificate.fileType)}
                      </span>
                    </div>

                    <div className="overflow-hidden rounded-[24px] border border-white/8 bg-[#090b15]">
                      <div className="relative aspect-[16/8.5] overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(193,155,255,0.14),_transparent_52%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0))]" />
                        <img
                          alt={certificate.title}
                          className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                          src={certificate.thumbnailUrl}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6">
                    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="mb-2 text-[11px] font-mono uppercase tracking-[0.24em] text-outline">
                          {certificate.issuedAtLabel}
                        </p>
                        <h2 className="max-w-xl wrap-break-words text-xl font-headline font-bold leading-tight text-on-surface sm:text-2xl">
                          {certificate.title}
                        </h2>
                      </div>

                      <a
                        href={certificate.driveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex shrink-0 items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-2 text-[11px] uppercase tracking-[0.18em] text-primary transition-colors hover:bg-primary/16"
                      >
                        <span className="material-symbols-outlined text-sm">open_in_new</span>
                        view
                      </a>
                    </div>

                    <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="rounded-[18px] border border-outline-variant/15 bg-surface/70 p-3.5">
                        <div className="mb-2 text-[10px] font-mono uppercase tracking-[0.22em] text-secondary">
                          issuer
                        </div>
                        <p className="text-sm leading-6 text-on-surface">
                          {certificate.issuer}
                        </p>
                      </div>

                      <div className="rounded-[18px] border border-outline-variant/15 bg-surface/70 p-3.5">
                        <div className="mb-2 text-[10px] font-mono uppercase tracking-[0.22em] text-secondary">
                          archive data
                        </div>
                        <p className="text-sm leading-6 text-on-surface">
                          {certificate.issuedAtLabel}
                        </p>
                        {certificate.credentialId && (
                          <p className="mt-2 break-all text-sm leading-6 text-on-surface-variant">
                            {certificate.credentialId}
                          </p>
                        )}
                      </div>
                    </div>

                    <p className="mb-5 max-w-3xl text-sm leading-7 text-on-surface-variant">
                      {certificate.summary}
                    </p>

                    <div className="mb-6 flex flex-wrap gap-2">
                      {certificate.highlights.map((item) => (
                        <span
                          key={`${certificate.id}-${item}`}
                          className="rounded-full border border-outline-variant/15 bg-surface-container-high px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.14em] text-secondary"
                        >
                          {item}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <a
                        href={certificate.driveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-on-primary transition-all hover:brightness-110"
                      >
                        <span className="material-symbols-outlined text-sm">open_in_new</span>
                        view credential
                      </a>

                      <a
                        href={`https://drive.google.com/thumbnail?id=${certificate.driveFileId}&sz=w2000`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-outline-variant/20 bg-surface-container-high px-4 py-2.5 text-[11px] uppercase tracking-[0.18em] text-secondary transition-colors hover:border-secondary/30 hover:text-on-surface"
                      >
                        <span className="material-symbols-outlined text-sm">image</span>
                        open preview
                      </a>
                    </div>
                  </div>
                </article>
              </AnimateIn>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
