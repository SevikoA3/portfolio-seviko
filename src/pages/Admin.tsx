import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, deleteDoc, doc, getDocs, writeBatch } from 'firebase/firestore';
import type {
  Certificate,
  Experience,
  ExperienceRole,
  MoreProject,
  Project,
  Publication,
} from '../lib/types';
import { auth, db } from '../lib/firebase';

type CollectionKey = 'projects' | 'moreProjects' | 'publications' | 'experiences' | 'certificates';
type EditableProject = Omit<Project, 'id'>;
type EditableMoreProject = Omit<MoreProject, 'id'>;
type EditablePublication = Omit<Publication, 'id'>;
type EditableExperience = Omit<Experience, 'id'>;
type EditableCertificate = Omit<Certificate, 'id'>;
type EditableDocument =
  | EditableProject
  | EditableMoreProject
  | EditablePublication
  | EditableExperience
  | EditableCertificate;

type StoredDocument = {
  id: string;
  data: EditableDocument;
};

const COLLECTION_OPTIONS: Array<{ key: CollectionKey; label: string; description: string }> = [
  { key: 'projects', label: 'Projects', description: 'Featured projects on the home page and projects page.' },
  { key: 'moreProjects', label: 'More Projects', description: 'Compact cards with repo links only.' },
  { key: 'publications', label: 'Publications', description: 'Research papers and publication highlights.' },
  { key: 'experiences', label: 'Experiences', description: 'Company entries with nested role timelines.' },
  { key: 'certificates', label: 'Certificates', description: 'Credential cards, highlights, and Drive links.' },
];

function cloneData<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function parseLines(value: string): string[] {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatLines(value?: string[] | null): string {
  return value?.join('\n') ?? '';
}

function createEmptyDocument(collectionKey: CollectionKey): EditableDocument {
  switch (collectionKey) {
    case 'projects':
      return {
        title: '',
        description: '',
        category: '',
        imageUrl: '',
        demoLink: '',
        repoLink: '',
        tags: [],
        sortOrder: 0,
      } satisfies EditableProject;
    case 'moreProjects':
      return {
        title: '',
        description: '',
        category: '',
        repoLink: '',
        tags: [],
        sortOrder: 0,
      } satisfies EditableMoreProject;
    case 'publications':
      return {
        title: '',
        abstract: '',
        type: '',
        year: new Date().getFullYear(),
        link: '',
      } satisfies EditablePublication;
    case 'experiences':
      return {
        company: '',
        location: '',
        summary: '',
        category: '',
        employmentType: '',
        workSetup: '',
        roles: [
          {
            title: '',
            startDate: '',
            endDate: '',
            location: '',
            skills: [],
          },
        ],
        sortOrder: 0,
      } satisfies EditableExperience;
    case 'certificates':
      return {
        title: '',
        issuer: '',
        category: '',
        issuedAtLabel: '',
        issuedAt: '',
        credentialId: '',
        summary: '',
        highlights: [],
        driveUrl: '',
        driveFileId: '',
        thumbnailUrl: '',
        fileType: 'pdf',
        sortOrder: 0,
      } satisfies EditableCertificate;
  }
}

function hydrateDocument(collectionKey: CollectionKey, rawData: Partial<EditableDocument> | undefined): EditableDocument {
  const base = createEmptyDocument(collectionKey);
  const data = (rawData ?? {}) as Record<string, unknown>;

  switch (collectionKey) {
    case 'projects':
      return {
        ...(base as EditableProject),
        ...(data as Partial<EditableProject>),
        tags: Array.isArray((data as Partial<EditableProject>).tags)
          ? ((data as Partial<EditableProject>).tags as string[])
          : [],
      };
    case 'moreProjects':
      return {
        ...(base as EditableMoreProject),
        ...(data as Partial<EditableMoreProject>),
        tags: Array.isArray((data as Partial<EditableMoreProject>).tags)
          ? ((data as Partial<EditableMoreProject>).tags as string[])
          : [],
      };
    case 'publications':
      return {
        ...(base as EditablePublication),
        ...(data as Partial<EditablePublication>),
      };
    case 'experiences': {
      const baseExperience = base as EditableExperience;
      const input = data as Partial<EditableExperience>;
      const roles = Array.isArray(input.roles) ? input.roles : baseExperience.roles;

      return {
        ...baseExperience,
        ...input,
        roles: roles.map((role) => ({
          title: role?.title ?? '',
          startDate: role?.startDate ?? '',
          endDate: role?.endDate ?? '',
          location: role?.location ?? '',
          skills: Array.isArray(role?.skills) ? role.skills : [],
        })),
      };
    }
    case 'certificates':
      return {
        ...(base as EditableCertificate),
        ...(data as Partial<EditableCertificate>),
        highlights: Array.isArray((data as Partial<EditableCertificate>).highlights)
          ? ((data as Partial<EditableCertificate>).highlights as string[])
          : [],
      };
  }
}

function getDocumentTitle(collectionKey: CollectionKey, documentData: EditableDocument): string {
  switch (collectionKey) {
    case 'projects':
      return (documentData as EditableProject).title;
    case 'moreProjects':
      return (documentData as EditableMoreProject).title;
    case 'publications':
      return (documentData as EditablePublication).title;
    case 'certificates':
      return (documentData as EditableCertificate).title;
    case 'experiences':
      return (documentData as EditableExperience).company;
  }
}

function sortDocuments(collectionKey: CollectionKey, documents: StoredDocument[]): StoredDocument[] {
  const sorted = [...documents];

  sorted.sort((left, right) => {
    if ('sortOrder' in left.data && 'sortOrder' in right.data) {
      const bySortOrder = (left.data.sortOrder ?? 0) - (right.data.sortOrder ?? 0);
      if (bySortOrder !== 0) {
        return bySortOrder;
      }
    }

    if (collectionKey === 'publications') {
      const leftYear = 'year' in left.data ? left.data.year : 0;
      const rightYear = 'year' in right.data ? right.data.year : 0;
      if (leftYear !== rightYear) {
        return rightYear - leftYear;
      }
    }

    return getDocumentTitle(collectionKey, left.data)
      .toLowerCase()
      .localeCompare(getDocumentTitle(collectionKey, right.data).toLowerCase());
  });

  return sorted;
}

function sanitizeOptionalText(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
}

function normalizeDocument(collectionKey: CollectionKey, documentData: EditableDocument): EditableDocument {
  switch (collectionKey) {
    case 'projects': {
      const project = documentData as EditableProject;
      return {
        ...project,
        title: project.title.trim(),
        description: project.description.trim(),
        category: project.category.trim(),
        imageUrl: project.imageUrl.trim(),
        demoLink: sanitizeOptionalText(project.demoLink ?? ''),
        repoLink: sanitizeOptionalText(project.repoLink ?? ''),
        tags: project.tags.map((tag) => tag.trim()).filter(Boolean),
        sortOrder: Number(project.sortOrder) || 0,
      };
    }
    case 'moreProjects': {
      const project = documentData as EditableMoreProject;
      return {
        ...project,
        title: project.title.trim(),
        description: project.description.trim(),
        category: project.category.trim(),
        repoLink: project.repoLink.trim(),
        tags: project.tags.map((tag) => tag.trim()).filter(Boolean),
        sortOrder: Number(project.sortOrder) || 0,
      };
    }
    case 'publications': {
      const publication = documentData as EditablePublication;
      return {
        ...publication,
        title: publication.title.trim(),
        abstract: publication.abstract.trim(),
        type: publication.type.trim(),
        year: Number(publication.year) || new Date().getFullYear(),
        link: publication.link.trim(),
      };
    }
    case 'experiences': {
      const experience = documentData as EditableExperience;
      return {
        ...experience,
        company: experience.company.trim(),
        location: sanitizeOptionalText(experience.location ?? ''),
        summary: sanitizeOptionalText(experience.summary ?? ''),
        category: sanitizeOptionalText(experience.category ?? ''),
        employmentType: sanitizeOptionalText(experience.employmentType ?? ''),
        workSetup: sanitizeOptionalText(experience.workSetup ?? ''),
        roles: experience.roles.map((role) => ({
          title: role.title.trim(),
          startDate: role.startDate.trim(),
          endDate: sanitizeOptionalText(role.endDate ?? ''),
          location: sanitizeOptionalText(role.location ?? ''),
          skills: role.skills?.map((skill) => skill.trim()).filter(Boolean),
        })),
        sortOrder: Number(experience.sortOrder) || 0,
      };
    }
    case 'certificates': {
      const certificate = documentData as EditableCertificate;
      return {
        ...certificate,
        title: certificate.title.trim(),
        issuer: certificate.issuer.trim(),
        category: certificate.category.trim(),
        issuedAtLabel: certificate.issuedAtLabel.trim(),
        issuedAt: sanitizeOptionalText(certificate.issuedAt ?? ''),
        credentialId: sanitizeOptionalText(certificate.credentialId ?? ''),
        summary: certificate.summary.trim(),
        highlights: certificate.highlights.map((item) => item.trim()).filter(Boolean),
        driveUrl: certificate.driveUrl.trim(),
        driveFileId: certificate.driveFileId.trim(),
        thumbnailUrl: certificate.thumbnailUrl.trim(),
        fileType: certificate.fileType,
        sortOrder: Number(certificate.sortOrder) || 0,
      };
    }
  }
}

function validateDocument(collectionKey: CollectionKey, documentData: EditableDocument): string | null {
  switch (collectionKey) {
    case 'projects': {
      const project = documentData as EditableProject;
      if (!project.title.trim() || !project.description.trim() || !project.imageUrl.trim()) {
        return 'Project needs at least a title, description, and image URL.';
      }
      return null;
    }
    case 'moreProjects': {
      const project = documentData as EditableMoreProject;
      if (!project.title.trim() || !project.description.trim() || !project.repoLink.trim()) {
        return 'More project needs at least a title, description, and repo link.';
      }
      return null;
    }
    case 'publications': {
      const publication = documentData as EditablePublication;
      if (!publication.title.trim() || !publication.abstract.trim() || !publication.link.trim()) {
        return 'Publication needs a title, abstract, and link.';
      }
      return null;
    }
    case 'experiences': {
      const experience = documentData as EditableExperience;
      if (!experience.company.trim()) {
        return 'Experience needs a company name.';
      }
      if (experience.roles.length === 0) {
        return 'Experience needs at least one role.';
      }
      if (experience.roles.some((role) => !role.title.trim() || !role.startDate.trim())) {
        return 'Each role needs at least a title and start date.';
      }
      return null;
    }
    case 'certificates': {
      const certificate = documentData as EditableCertificate;
      if (!certificate.title.trim() || !certificate.issuer.trim() || !certificate.driveUrl.trim()) {
        return 'Certificate needs a title, issuer, and Drive URL.';
      }
      return null;
    }
  }
}

function AdminField({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: 'text' | 'url' | 'number';
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.18em] text-secondary">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full border border-outline-variant/25 bg-surface-container px-4 py-3 text-sm text-on-surface outline-none transition-colors focus:border-primary"
      />
    </label>
  );
}

function AdminTextarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 5,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.18em] text-secondary">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full border border-outline-variant/25 bg-surface-container px-4 py-3 text-sm leading-6 text-on-surface outline-none transition-colors focus:border-primary"
      />
    </label>
  );
}

function AdminLoginForm({
  email,
  password,
  error,
  busy,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: {
  email: string;
  password: string;
  error: string | null;
  busy: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-on-surface">
      <div className="absolute inset-0 dot-grid opacity-15" />
      <div className="relative mx-auto flex min-h-screen max-w-5xl items-center px-4 py-12 sm:px-6 md:px-10">
        <div className="grid w-full gap-8 rounded-4xl border border-outline-variant/20 bg-surface-container-low/95 p-6 shadow-[0_28px_120px_rgba(2,6,23,0.48)] backdrop-blur md:grid-cols-[1.15fr_0.85fr] md:p-10">
          <div className="space-y-6">
            <div className="inline-flex items-center rounded-full border border-secondary/20 bg-secondary/10 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-secondary">
              hidden admin route
            </div>
            <div>
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.26em] text-outline">
                portfolio control node
              </p>
              <h1 className="max-w-xl text-3xl font-bold tracking-tighter text-on-surface font-headline sm:text-4xl md:text-5xl">
                Secure editor for your Firestore content.
              </h1>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-on-surface-variant sm:text-base">
              Login memakai Firebase email/password. Setelah masuk, panel ini cek custom claim `admin`
              supaya editor hanya aktif untuk akun yang memang kamu izinkan di rules.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4 rounded-[28px] border border-outline-variant/15 bg-surface/75 p-6">
            <div>
              <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.22em] text-outline">
                sign in
              </p>
              <h2 className="text-2xl font-bold tracking-tight text-on-surface font-headline">
                Admin access
              </h2>
            </div>

            <AdminField label="Email" value={email} onChange={onEmailChange} />
            <label className="block">
              <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.18em] text-secondary">
                Password
              </span>
              <input
                type="password"
                value={password}
                onChange={(event) => onPasswordChange(event.target.value)}
                className="w-full border border-outline-variant/25 bg-surface-container px-4 py-3 text-sm text-on-surface outline-none transition-colors focus:border-primary"
                placeholder="your password"
                autoComplete="current-password"
              />
            </label>

            {error && (
              <div className="border border-error/35 bg-error/10 px-4 py-3 text-sm leading-6 text-on-surface">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full bg-primary px-4 py-3 text-sm font-bold uppercase tracking-[0.18em] text-on-primary transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? 'signing in...' : 'enter admin panel'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function ExperienceRolesEditor({
  value,
  onChange,
}: {
  value: ExperienceRole[];
  onChange: (nextValue: ExperienceRole[]) => void;
}) {
  const roles = value ?? [];

  const updateRole = (index: number, updater: (role: ExperienceRole) => ExperienceRole) => {
    onChange(roles.map((role, roleIndex) => (roleIndex === index ? updater(role) : role)));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-secondary">roles</p>
          <p className="mt-1 text-sm text-on-surface-variant">One company can contain multiple roles and periods.</p>
        </div>
        <button
          type="button"
          onClick={() =>
            onChange([
              ...roles,
              {
                title: '',
                startDate: '',
                endDate: '',
                location: '',
                skills: [],
              },
            ])
          }
          className="border border-secondary/30 bg-secondary/10 px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-secondary transition-colors hover:bg-secondary/16"
        >
          add role
        </button>
      </div>

      {roles.map((role, index) => (
        <div key={`${role.title}-${index}`} className="space-y-4 border border-outline-variant/15 bg-surface/60 p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="font-headline text-lg font-bold text-on-surface">Role {index + 1}</div>
            <button
              type="button"
              onClick={() => onChange(roles.filter((_, roleIndex) => roleIndex !== index))}
              className="text-[11px] uppercase tracking-[0.18em] text-error transition-colors hover:text-on-surface"
            >
              remove
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <AdminField
              label="Role Title"
              value={role.title}
              onChange={(nextValue) => updateRole(index, (current) => ({ ...current, title: nextValue }))}
            />
            <AdminField
              label="Location"
              value={role.location ?? ''}
              onChange={(nextValue) => updateRole(index, (current) => ({ ...current, location: nextValue }))}
            />
            <AdminField
              label="Start Date"
              value={role.startDate}
              onChange={(nextValue) => updateRole(index, (current) => ({ ...current, startDate: nextValue }))}
              placeholder="YYYY-MM"
            />
            <AdminField
              label="End Date"
              value={role.endDate ?? ''}
              onChange={(nextValue) => updateRole(index, (current) => ({ ...current, endDate: nextValue }))}
              placeholder="leave empty for present"
            />
          </div>

          <AdminTextarea
            label="Skills"
            value={formatLines(role.skills)}
            onChange={(nextValue) =>
              updateRole(index, (current) => ({
                ...current,
                skills: parseLines(nextValue),
              }))
            }
            placeholder="One skill per line"
            rows={4}
          />
        </div>
      ))}
    </div>
  );
}

function SortableDocumentItem({ id, item, isSelected, activeCollection, onSelect }: { id: string, item: StoredDocument, isSelected: boolean, activeCollection: CollectionKey, onSelect: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    position: 'relative' as const,
  };

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      type="button"
      onClick={onSelect}
      className={`w-full border px-4 py-3 text-left transition-colors ${
        isDragging ? 'opacity-50 border-secondary ' : ''
      }${
        isSelected && !isDragging
          ? 'border-primary/35 bg-primary/10 text-on-surface'
          : 'border-outline-variant/15 bg-surface text-on-surface-variant hover:border-primary/25 hover:text-on-surface'
      }`}
    >
      <div className="font-headline text-base font-bold">
        {getDocumentTitle(activeCollection, item.data) || 'Untitled item'}
      </div>
      <div className="mt-1 break-all font-mono text-[10px] uppercase tracking-[0.16em] text-outline">
        {item.id}
      </div>
    </button>
  );
}

export default function AdminPage() {
  const [authReady, setAuthReady] = useState(false);
  const [authBusy, setAuthBusy] = useState(false);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [saveBusy, setSaveBusy] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [panelError, setPanelError] = useState<string | null>(null);
  const [panelMessage, setPanelMessage] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeCollection, setActiveCollection] = useState<CollectionKey>('projects');
  const [documents, setDocuments] = useState<StoredDocument[]>([]);
  const [selectedId, setSelectedId] = useState<string | 'new' | null>(null);
  const [draft, setDraft] = useState<EditableDocument | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const activeCollectionMeta = useMemo(
    () => COLLECTION_OPTIONS.find((option) => option.key === activeCollection)!,
    [activeCollection]
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setPanelMessage(null);
      setPanelError(null);

      if (!currentUser) {
        setIsAdmin(false);
        setAuthReady(true);
        return;
      }

      try {
        const tokenResult = await currentUser.getIdTokenResult(true);
        setIsAdmin(tokenResult.claims.admin === true);
      } catch (error) {
        console.error('Unable to read auth claims', error);
        setIsAdmin(false);
      } finally {
        setAuthReady(true);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!authReady || !user || !isAdmin) {
      setDocuments([]);
      setSelectedId(null);
      setDraft(null);
      return;
    }

    const loadDocuments = async () => {
      setDocumentsLoading(true);
      setPanelError(null);
      setPanelMessage(null);

      try {
        const snapshot = await getDocs(collection(db, activeCollection));
        const nextDocuments = sortDocuments(
          activeCollection,
          snapshot.docs.map((documentSnapshot) => ({
            id: documentSnapshot.id,
            data: hydrateDocument(
              activeCollection,
              cloneData(documentSnapshot.data() as Partial<EditableDocument>)
            ),
          }))
        );

        setDocuments(nextDocuments);
        setSelectedId((currentSelectedId) => {
          if (currentSelectedId && currentSelectedId !== 'new') {
            const existing = nextDocuments.find((item) => item.id === currentSelectedId);
            if (existing) {
              setDraft(cloneData(existing.data));
              return currentSelectedId;
            }
          }

          if (nextDocuments.length > 0) {
            setDraft(cloneData(nextDocuments[0].data));
            return nextDocuments[0].id;
          }

          setDraft(createEmptyDocument(activeCollection));
          return 'new';
        });
      } catch (error) {
        console.error('Unable to load documents', error);
        setPanelError('Tidak bisa mengambil data koleksi ini. Pastikan rules write/read admin sudah aktif.');
      } finally {
        setDocumentsLoading(false);
      }
    };

    void loadDocuments();
  }, [activeCollection, authReady, isAdmin, user]);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthBusy(true);
    setAuthError(null);

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      setPassword('');
    } catch (error) {
      console.error('Unable to sign in', error);
      setAuthError('Login gagal. Cek email/password dan pastikan akun ini memang terdaftar di Firebase Auth.');
    } finally {
      setAuthBusy(false);
    }
  };

  const handleSelectDocument = (nextId: string | 'new') => {
    setPanelError(null);
    setPanelMessage(null);
    setSelectedId(nextId);

    if (nextId === 'new') {
      const empty = createEmptyDocument(activeCollection);
      if ('sortOrder' in empty) {
        const nextOrder = documents.reduce((max, item) => {
          const order = 'sortOrder' in item.data ? Number(item.data.sortOrder) : 0;
          return typeof order === 'number' && order > max ? order : max;
        }, 0) + 1;
        (empty as Extract<EditableDocument, { sortOrder: number }>).sortOrder = nextOrder;
      }
      setDraft(empty);
      return;
    }

    const selectedDocument = documents.find((item) => item.id === nextId);
    if (selectedDocument) {
      setDraft(cloneData(selectedDocument.data));
    }
  };

  const refreshDocuments = async (preferredId?: string) => {
    const snapshot = await getDocs(collection(db, activeCollection));
    const nextDocuments = sortDocuments(
      activeCollection,
      snapshot.docs.map((documentSnapshot) => ({
        id: documentSnapshot.id,
        data: hydrateDocument(
          activeCollection,
          cloneData(documentSnapshot.data() as Partial<EditableDocument>)
        ),
      }))
    );

    setDocuments(nextDocuments);

    if (preferredId) {
      const matched = nextDocuments.find((item) => item.id === preferredId);
      if (matched) {
        setSelectedId(matched.id);
        setDraft(cloneData(matched.data));
        return;
      }
    }

    if (nextDocuments.length > 0) {
      setSelectedId(nextDocuments[0].id);
      setDraft(cloneData(nextDocuments[0].data));
      return;
    }

    setSelectedId('new');
    setDraft(createEmptyDocument(activeCollection));
  };

  const handleSave = async () => {
    if (!draft) {
      return;
    }

    const validationError = validateDocument(activeCollection, draft);
    if (validationError) {
      setPanelError(validationError);
      setPanelMessage(null);
      return;
    }

    const normalizedDraft = normalizeDocument(activeCollection, cloneData(draft));
    setSaveBusy(true);
    setPanelError(null);
    setPanelMessage(null);

    try {
      const isNew = selectedId === 'new' || !selectedId;
      const targetDocRef = isNew ? doc(collection(db, activeCollection)) : doc(db, activeCollection, selectedId);
      
      const batch = writeBatch(db);
      batch.set(targetDocRef, normalizedDraft);

      // Auto-adjust sortOrder for other documents if applicable
      if ('sortOrder' in normalizedDraft) {
        const newOrder = Number(normalizedDraft.sortOrder);
        const oldOrder = isNew 
          ? undefined 
          : documents.find(d => d.id === selectedId)?.data && 'sortOrder' in documents.find(d => d.id === selectedId)!.data 
            ? Number((documents.find(d => d.id === selectedId)!.data as { sortOrder?: number }).sortOrder)
            : undefined;

        if (oldOrder !== newOrder) {
          const siblings = documents.filter(d => d.id !== selectedId);
          for (const sibling of siblings) {
            const siblingOrder = 'sortOrder' in sibling.data ? Number(sibling.data.sortOrder) : 0;
            let updatedSiblingOrder = siblingOrder;

            if (oldOrder === undefined) {
              // New item inserted at newOrder
              if (siblingOrder >= newOrder) updatedSiblingOrder = siblingOrder + 1;
            } else {
              // Existing item moved
              if (oldOrder > newOrder) {
                // Moved up in the list (e.g. 5 to 2). Items between 2 and 4 go down to 3 and 5.
                if (siblingOrder >= newOrder && siblingOrder < oldOrder) {
                  updatedSiblingOrder = siblingOrder + 1;
                }
              } else if (oldOrder < newOrder) {
                // Moved down in the list (e.g. 2 to 5). Items between 3 and 5 go up to 2 and 4.
                if (siblingOrder > oldOrder && siblingOrder <= newOrder) {
                  updatedSiblingOrder = siblingOrder - 1;
                }
              }
            }

            if (updatedSiblingOrder !== siblingOrder) {
              const sibRef = doc(db, activeCollection, sibling.id);
              batch.update(sibRef, { sortOrder: updatedSiblingOrder });
            }
          }
        }
      }

      await batch.commit();
      await refreshDocuments(targetDocRef.id);
      
      setPanelMessage(isNew ? 'Item baru berhasil dibuat.' : 'Perubahan berhasil disimpan & urutan disesuaikan.');
    } catch (error) {
      console.error('Unable to save document', error);
      setPanelError('Simpan gagal. Kalau rules sudah pakai `request.auth.token.admin == true`, cek claim admin akun ini.');
    } finally {
      setSaveBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedId || selectedId === 'new') {
      setDraft(createEmptyDocument(activeCollection));
      setPanelMessage('Draft dikosongkan.');
      setPanelError(null);
      return;
    }

    const confirmed = window.confirm('Hapus item ini dari Firestore? Aksi ini tidak bisa dibatalkan.');
    if (!confirmed) {
      return;
    }

    setSaveBusy(true);
    setPanelError(null);
    setPanelMessage(null);

    try {
      await deleteDoc(doc(db, activeCollection, selectedId));
      await refreshDocuments();
      setPanelMessage('Item berhasil dihapus.');
    } catch (error) {
      console.error('Unable to delete document', error);
      setPanelError('Hapus gagal. Pastikan akun ini benar-benar punya akses admin.');
    } finally {
      setSaveBusy(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id || !('sortOrder' in createEmptyDocument(activeCollection))) {
      return;
    }

    const oldIndex = documents.findIndex(item => item.id === active.id);
    const newIndex = documents.findIndex(item => item.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const draggedItem = documents[oldIndex];
      const targetItem = documents[newIndex];

      if ('sortOrder' in draggedItem.data && 'sortOrder' in targetItem.data) {
        const oldOrder = Number(draggedItem.data.sortOrder);
        const newOrder = Number(targetItem.data.sortOrder);
        
        // Optimistic UI updates
        setDocuments((items) => arrayMove(items, oldIndex, newIndex));

        try {
          setSaveBusy(true);
          const batch = writeBatch(db);
          batch.update(doc(db, activeCollection, draggedItem.id), { sortOrder: newOrder });

          const siblings = documents.filter(d => d.id !== draggedItem.id);
          for (const sibling of siblings) {
              const siblingOrder = 'sortOrder' in sibling.data ? Number(sibling.data.sortOrder) : 0;
              let updatedSiblingOrder = siblingOrder;

              // Existing item moved
              if (oldOrder > newOrder) {
                if (siblingOrder >= newOrder && siblingOrder < oldOrder) {
                  updatedSiblingOrder = siblingOrder + 1;
                }
              } else if (oldOrder < newOrder) {
                if (siblingOrder > oldOrder && siblingOrder <= newOrder) {
                  updatedSiblingOrder = siblingOrder - 1;
                }
              }

              if (updatedSiblingOrder !== siblingOrder) {
                const sibRef = doc(db, activeCollection, sibling.id);
                batch.update(sibRef, { sortOrder: updatedSiblingOrder });
              }
          }
          await batch.commit();
          await refreshDocuments(selectedId || undefined);
          setPanelMessage('Urutan berhasil diperbarui.');
        } catch (error) {
          console.error('Update order failed', error);
          setPanelError('Gagal memperbarui urutan. Cek permission.');
          await refreshDocuments(selectedId || undefined); // Reset on fail
        } finally {
          setSaveBusy(false);
        }
      }
    }
  };

  if (!authReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 text-secondary">
        <div className="font-mono text-sm uppercase tracking-[0.24em]">booting admin auth...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <AdminLoginForm
        email={email}
        password={password}
        error={authError}
        busy={authBusy}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onSubmit={handleLogin}
      />
    );
  }

  if (!isAdmin) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-background px-4 py-12 text-on-surface sm:px-6 md:px-10">
        <div className="absolute inset-0 dot-grid opacity-10" />
        <div className="relative mx-auto max-w-3xl rounded-4xl border border-error/25 bg-surface-container-low/95 p-8 shadow-[0_24px_100px_rgba(2,6,23,0.5)]">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.28em] text-error">access denied</p>
          <h1 className="mb-4 text-3xl font-bold tracking-tight font-headline">Akun ini belum punya claim admin.</h1>
          <p className="mb-6 text-sm leading-7 text-on-surface-variant">
            Login berhasil sebagai <span className="text-on-surface">{user.email}</span>, tapi Firestore rules kamu
            akan tetap menolak write kalau `request.auth.token.admin` belum bernilai `true`.
          </p>
          <div className="mb-6 rounded-3xl border border-outline-variant/18 bg-surface/70 p-5 text-sm leading-7 text-on-surface-variant">
            Setelah claim di-set, logout lalu login lagi supaya token yang baru ikut terbaca di browser.
          </div>
          <button
            type="button"
            onClick={() => void signOut(auth)}
            className="border border-outline-variant/25 bg-surface px-4 py-3 text-[11px] uppercase tracking-[0.18em] text-secondary transition-colors hover:border-secondary/35 hover:text-on-surface"
          >
            logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-on-surface">
      <div className="border-b border-outline-variant/15 bg-surface-container-low/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 md:flex-row md:items-end md:justify-between md:px-10">
          <div>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.28em] text-secondary">portfolio admin</p>
            <h1 className="text-3xl font-bold tracking-tighter font-headline sm:text-4xl">
              Hidden Firestore editor
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-on-surface-variant">
              Signed in as <span className="text-on-surface">{user.email}</span>. Semua perubahan di sini langsung
              menulis ke Firestore koleksi publik.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => handleSelectDocument('new')}
              className="border border-primary/25 bg-primary/10 px-4 py-3 text-[11px] uppercase tracking-[0.18em] text-primary transition-colors hover:bg-primary/16"
            >
              new item
            </button>
            <button
              type="button"
              onClick={() => void signOut(auth)}
              className="border border-outline-variant/25 bg-surface px-4 py-3 text-[11px] uppercase tracking-[0.18em] text-secondary transition-colors hover:border-secondary/35 hover:text-on-surface"
            >
              logout
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 md:grid-cols-[280px_minmax(0,1fr)] md:px-10 md:py-8">
        <aside className="space-y-4">
          <div className="rounded-[28px] border border-outline-variant/15 bg-surface-container-low p-4">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.24em] text-outline">collections</p>
            <div className="space-y-2">
              {COLLECTION_OPTIONS.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setActiveCollection(option.key)}
                  className={`w-full border px-4 py-3 text-left transition-colors ${
                    activeCollection === option.key
                      ? 'border-primary/35 bg-primary/10 text-on-surface'
                      : 'border-outline-variant/15 bg-surface text-on-surface-variant hover:border-secondary/25 hover:text-on-surface'
                  }`}
                >
                  <div className="font-headline text-lg font-bold">{option.label}</div>
                  <div className="mt-1 text-xs leading-5 opacity-80">{option.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-outline-variant/15 bg-surface-container-low p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-outline">documents</p>
                <p className="mt-1 text-sm text-on-surface-variant">{activeCollectionMeta.label}</p>
              </div>
              {documentsLoading && <span className="text-[11px] uppercase tracking-[0.18em] text-secondary">loading</span>}
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleSelectDocument('new')}
                className={`w-full border px-4 py-3 text-left transition-colors ${
                  selectedId === 'new'
                    ? 'border-secondary/35 bg-secondary/10 text-on-surface'
                    : 'border-outline-variant/15 bg-surface text-on-surface-variant hover:border-secondary/25 hover:text-on-surface'
                }`}
              >
                <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-secondary">new draft</div>
                <div className="mt-1 text-sm">Create empty item</div>
              </button>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={documents.map(d => d.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {documents.map((item) => (
                    <SortableDocumentItem
                      key={item.id}
                      id={item.id}
                      item={item}
                      isSelected={selectedId === item.id}
                      activeCollection={activeCollection}
                      onSelect={() => handleSelectDocument(item.id)}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </div>
          </div>
        </aside>

        <section className="rounded-4xl border border-outline-variant/15 bg-surface-container-low p-5 sm:p-6 md:p-8">
          <div className="mb-6 flex flex-col gap-4 border-b border-outline-variant/12 pb-6 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.24em] text-secondary">
                editing {activeCollection}
              </p>
              <h2 className="text-2xl font-bold tracking-tight text-on-surface font-headline">
                {selectedId === 'new' ? 'New item draft' : getDocumentTitle(activeCollection, draft ?? createEmptyDocument(activeCollection))}
              </h2>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={saveBusy || !draft}
                className="bg-primary px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-on-primary transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saveBusy ? 'saving...' : 'save changes'}
              </button>
              <button
                type="button"
                onClick={() => void handleDelete()}
                disabled={saveBusy}
                className="border border-error/25 bg-error/10 px-4 py-3 text-[11px] uppercase tracking-[0.18em] text-error transition-colors hover:bg-error/16 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {selectedId === 'new' ? 'reset draft' : 'delete item'}
              </button>
            </div>
          </div>

          {panelError && (
            <div className="mb-5 border border-error/25 bg-error/10 px-4 py-3 text-sm leading-6 text-on-surface">
              {panelError}
            </div>
          )}

          {panelMessage && (
            <div className="mb-5 border border-secondary/25 bg-secondary/10 px-4 py-3 text-sm leading-6 text-on-surface">
              {panelMessage}
            </div>
          )}

          {!draft ? (
            <div className="py-16 text-center font-mono text-sm uppercase tracking-[0.22em] text-outline">
              select a document to start editing
            </div>
          ) : (
            <div className="space-y-5">
              {activeCollection === 'projects' && (
                <>
                  <div className="grid gap-4 md:grid-cols-2">
                    <AdminField
                      label="Title"
                      value={(draft as EditableProject).title}
                      onChange={(value) =>
                        setDraft((current) => ({ ...(current as EditableProject), title: value }))
                      }
                    />
                    <AdminField
                      label="Category"
                      value={(draft as EditableProject).category}
                      onChange={(value) =>
                        setDraft((current) => ({ ...(current as EditableProject), category: value }))
                      }
                    />
                    <AdminField
                      label="Image URL"
                      type="url"
                      value={(draft as EditableProject).imageUrl}
                      onChange={(value) =>
                        setDraft((current) => ({ ...(current as EditableProject), imageUrl: value }))
                      }
                    />
                    <AdminField
                      label="Sort Order"
                      type="number"
                      value={(draft as EditableProject).sortOrder}
                      onChange={(value) =>
                        setDraft((current) => ({ ...(current as EditableProject), sortOrder: Number(value) || 0 }))
                      }
                    />
                    <AdminField
                      label="Demo Link"
                      type="url"
                      value={(draft as EditableProject).demoLink ?? ''}
                      onChange={(value) =>
                        setDraft((current) => ({ ...(current as EditableProject), demoLink: value }))
                      }
                    />
                    <AdminField
                      label="Repo Link"
                      type="url"
                      value={(draft as EditableProject).repoLink ?? ''}
                      onChange={(value) =>
                        setDraft((current) => ({ ...(current as EditableProject), repoLink: value }))
                      }
                    />
                  </div>
                  <AdminTextarea
                    label="Description"
                    value={(draft as EditableProject).description}
                    onChange={(value) =>
                      setDraft((current) => ({ ...(current as EditableProject), description: value }))
                    }
                    rows={6}
                  />
                  <AdminTextarea
                    label="Tags"
                    value={formatLines((draft as EditableProject).tags)}
                    onChange={(value) =>
                      setDraft((current) => ({ ...(current as EditableProject), tags: parseLines(value) }))
                    }
                    placeholder="One tag per line"
                    rows={5}
                  />
                </>
              )}

              {activeCollection === 'moreProjects' && (
                <>
                  <div className="grid gap-4 md:grid-cols-2">
                    <AdminField
                      label="Title"
                      value={(draft as EditableMoreProject).title}
                      onChange={(value) =>
                        setDraft((current) => ({ ...(current as EditableMoreProject), title: value }))
                      }
                    />
                    <AdminField
                      label="Category"
                      value={(draft as EditableMoreProject).category}
                      onChange={(value) =>
                        setDraft((current) => ({ ...(current as EditableMoreProject), category: value }))
                      }
                    />
                    <AdminField
                      label="Repo Link"
                      type="url"
                      value={(draft as EditableMoreProject).repoLink}
                      onChange={(value) =>
                        setDraft((current) => ({ ...(current as EditableMoreProject), repoLink: value }))
                      }
                    />
                    <AdminField
                      label="Sort Order"
                      type="number"
                      value={(draft as EditableMoreProject).sortOrder}
                      onChange={(value) =>
                        setDraft((current) => ({
                          ...(current as EditableMoreProject),
                          sortOrder: Number(value) || 0,
                        }))
                      }
                    />
                  </div>
                  <AdminTextarea
                    label="Description"
                    value={(draft as EditableMoreProject).description}
                    onChange={(value) =>
                      setDraft((current) => ({ ...(current as EditableMoreProject), description: value }))
                    }
                    rows={6}
                  />
                  <AdminTextarea
                    label="Tags"
                    value={formatLines((draft as EditableMoreProject).tags)}
                    onChange={(value) =>
                      setDraft((current) => ({ ...(current as EditableMoreProject), tags: parseLines(value) }))
                    }
                    placeholder="One tag per line"
                    rows={5}
                  />
                </>
              )}

              {activeCollection === 'publications' && (
                <>
                  <div className="grid gap-4 md:grid-cols-2">
                    <AdminField
                      label="Title"
                      value={(draft as EditablePublication).title}
                      onChange={(value) =>
                        setDraft((current) => ({ ...(current as EditablePublication), title: value }))
                      }
                    />
                    <AdminField
                      label="Type"
                      value={(draft as EditablePublication).type}
                      onChange={(value) =>
                        setDraft((current) => ({ ...(current as EditablePublication), type: value }))
                      }
                    />
                    <AdminField
                      label="Year"
                      type="number"
                      value={(draft as EditablePublication).year}
                      onChange={(value) =>
                        setDraft((current) => ({
                          ...(current as EditablePublication),
                          year: Number(value) || new Date().getFullYear(),
                        }))
                      }
                    />
                    <AdminField
                      label="Link"
                      type="url"
                      value={(draft as EditablePublication).link}
                      onChange={(value) =>
                        setDraft((current) => ({ ...(current as EditablePublication), link: value }))
                      }
                    />
                  </div>
                  <AdminTextarea
                    label="Abstract"
                    value={(draft as EditablePublication).abstract}
                    onChange={(value) =>
                      setDraft((current) => ({ ...(current as EditablePublication), abstract: value }))
                    }
                    rows={9}
                  />
                </>
              )}

              {activeCollection === 'experiences' && (
                <>
                  <div className="grid gap-4 md:grid-cols-2">
                    <AdminField
                      label="Company"
                      value={(draft as EditableExperience).company}
                      onChange={(value) =>
                        setDraft((current) => ({ ...(current as EditableExperience), company: value }))
                      }
                    />
                    <AdminField
                      label="Location"
                      value={(draft as EditableExperience).location ?? ''}
                      onChange={(value) =>
                        setDraft((current) => ({ ...(current as EditableExperience), location: value }))
                      }
                    />
                    <AdminField
                      label="Category"
                      value={(draft as EditableExperience).category ?? ''}
                      onChange={(value) =>
                        setDraft((current) => ({ ...(current as EditableExperience), category: value }))
                      }
                    />
                    <AdminField
                      label="Employment Type"
                      value={(draft as EditableExperience).employmentType ?? ''}
                      onChange={(value) =>
                        setDraft((current) => ({ ...(current as EditableExperience), employmentType: value }))
                      }
                    />
                    <AdminField
                      label="Work Setup"
                      value={(draft as EditableExperience).workSetup ?? ''}
                      onChange={(value) =>
                        setDraft((current) => ({ ...(current as EditableExperience), workSetup: value }))
                      }
                    />
                    <AdminField
                      label="Sort Order"
                      type="number"
                      value={(draft as EditableExperience).sortOrder}
                      onChange={(value) =>
                        setDraft((current) => ({ ...(current as EditableExperience), sortOrder: Number(value) || 0 }))
                      }
                    />
                  </div>
                  <AdminTextarea
                    label="Summary"
                    value={(draft as EditableExperience).summary ?? ''}
                    onChange={(value) =>
                      setDraft((current) => ({ ...(current as EditableExperience), summary: value }))
                    }
                    rows={6}
                  />
                  <ExperienceRolesEditor
                    value={(draft as EditableExperience).roles}
                    onChange={(value) =>
                      setDraft((current) => ({ ...(current as EditableExperience), roles: value }))
                    }
                  />
                </>
              )}

              {activeCollection === 'certificates' && (
                <>
                  <div className="grid gap-4 md:grid-cols-2">
                    <AdminField
                      label="Title"
                      value={(draft as EditableCertificate).title}
                      onChange={(value) =>
                        setDraft((current) => ({ ...(current as EditableCertificate), title: value }))
                      }
                    />
                    <AdminField
                      label="Issuer"
                      value={(draft as EditableCertificate).issuer}
                      onChange={(value) =>
                        setDraft((current) => ({ ...(current as EditableCertificate), issuer: value }))
                      }
                    />
                    <AdminField
                      label="Category"
                      value={(draft as EditableCertificate).category}
                      onChange={(value) =>
                        setDraft((current) => ({ ...(current as EditableCertificate), category: value }))
                      }
                    />
                    <AdminField
                      label="Issued At Label"
                      value={(draft as EditableCertificate).issuedAtLabel}
                      onChange={(value) =>
                        setDraft((current) => ({ ...(current as EditableCertificate), issuedAtLabel: value }))
                      }
                    />
                    <AdminField
                      label="Issued At"
                      value={(draft as EditableCertificate).issuedAt ?? ''}
                      onChange={(value) =>
                        setDraft((current) => ({ ...(current as EditableCertificate), issuedAt: value }))
                      }
                      placeholder="YYYY-MM-DD or YYYY-MM"
                    />
                    <AdminField
                      label="Credential ID"
                      value={(draft as EditableCertificate).credentialId ?? ''}
                      onChange={(value) =>
                        setDraft((current) => ({ ...(current as EditableCertificate), credentialId: value }))
                      }
                    />
                    <AdminField
                      label="Drive URL"
                      type="url"
                      value={(draft as EditableCertificate).driveUrl}
                      onChange={(value) =>
                        setDraft((current) => ({ ...(current as EditableCertificate), driveUrl: value }))
                      }
                    />
                    <AdminField
                      label="Drive File ID"
                      value={(draft as EditableCertificate).driveFileId}
                      onChange={(value) =>
                        setDraft((current) => ({ ...(current as EditableCertificate), driveFileId: value }))
                      }
                    />
                    <AdminField
                      label="Thumbnail URL"
                      type="url"
                      value={(draft as EditableCertificate).thumbnailUrl}
                      onChange={(value) =>
                        setDraft((current) => ({ ...(current as EditableCertificate), thumbnailUrl: value }))
                      }
                    />
                    <AdminField
                      label="Sort Order"
                      type="number"
                      value={(draft as EditableCertificate).sortOrder}
                      onChange={(value) =>
                        setDraft((current) => ({
                          ...(current as EditableCertificate),
                          sortOrder: Number(value) || 0,
                        }))
                      }
                    />
                  </div>

                  <label className="block">
                    <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.18em] text-secondary">
                      File Type
                    </span>
                    <select
                      value={(draft as EditableCertificate).fileType}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...(current as EditableCertificate),
                          fileType: event.target.value as EditableCertificate['fileType'],
                        }))
                      }
                      className="w-full border border-outline-variant/25 bg-surface-container px-4 py-3 text-sm text-on-surface outline-none transition-colors focus:border-primary"
                    >
                      <option value="pdf">pdf</option>
                      <option value="image">image</option>
                    </select>
                  </label>

                  <AdminTextarea
                    label="Summary"
                    value={(draft as EditableCertificate).summary}
                    onChange={(value) =>
                      setDraft((current) => ({ ...(current as EditableCertificate), summary: value }))
                    }
                    rows={6}
                  />
                  <AdminTextarea
                    label="Highlights"
                    value={formatLines((draft as EditableCertificate).highlights)}
                    onChange={(value) =>
                      setDraft((current) => ({ ...(current as EditableCertificate), highlights: parseLines(value) }))
                    }
                    placeholder="One highlight per line"
                    rows={5}
                  />
                </>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
