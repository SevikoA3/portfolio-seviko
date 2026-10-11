import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import type { Query } from 'firebase/firestore';
import { db } from './firebase';
import type { Project, MoreProject, Publication, Experience, Certificate } from './types';

const queryCache = new Map<string, { expiresAt: number; request: ReturnType<typeof getDocs> }>();

export function invalidatePublicDataCache() {
  queryCache.clear();
}

function getCachedDocs(key: string, q: Query) {
  const cached = queryCache.get(key);
  if (cached && cached.expiresAt > Date.now()) return cached.request;

  const request = getDocs(q).then((snapshot) => {
    const entry = queryCache.get(key);
    if (entry?.request === request) {
      // shortcut: public data can lag by 60 seconds; use live listeners if immediate updates are required.
      entry.expiresAt = Date.now() + 60_000;
    }
    return snapshot;
  }, (error) => {
    if (queryCache.get(key)?.request === request) queryCache.delete(key);
    throw error;
  });
  queryCache.set(key, { expiresAt: Infinity, request });
  return request;
}

function mapSnapshot<T extends { id: string }>(snapshot: Awaited<ReturnType<typeof getDocs>>): T[] {
  const items: T[] = [];
  snapshot.forEach((documentSnapshot) => {
    items.push({ id: documentSnapshot.id, ...(documentSnapshot.data() as Omit<T, 'id'>) } as T);
  });
  return items;
}

export async function fetchProjects(isLatest: boolean = false): Promise<Project[]> {
  try {
    const projectsRef = collection(db, 'projects');
    const q = isLatest
      ? query(projectsRef, orderBy('sortOrder'), limit(3))
      : query(projectsRef, orderBy('sortOrder'));
    const snapshot = await getCachedDocs(`projects:${isLatest}`, q);
    return mapSnapshot<Project>(snapshot);
  } catch (error) {
    console.error('Error fetching projects: ', error);
    return [];
  }
}

export async function fetchMoreProjects(): Promise<MoreProject[]> {
  try {
    const moreProjectsRef = collection(db, 'moreProjects');
    const q = query(moreProjectsRef, orderBy('sortOrder'));
    const snapshot = await getCachedDocs('moreProjects', q);
    return mapSnapshot<MoreProject>(snapshot);
  } catch (error) {
    console.error('Error fetching more projects: ', error);
    return [];
  }
}

export async function fetchPublications(isLatest: boolean = false): Promise<Publication[]> {
  try {
    const pubRef = collection(db, 'publications');
    const q = isLatest ? query(pubRef, limit(1)) : query(pubRef);
    const snapshot = await getCachedDocs(`publications:${isLatest}`, q);
    return mapSnapshot<Publication>(snapshot);
  } catch (error) {
    console.error('Error fetching publications: ', error);
    return [];
  }
}

export async function fetchExperiences(isLatest: boolean = false): Promise<Experience[]> {
  try {
    const experienceRef = collection(db, 'experiences');
    const q = isLatest
      ? query(experienceRef, orderBy('sortOrder'), limit(3))
      : query(experienceRef, orderBy('sortOrder'));
    const snapshot = await getCachedDocs(`experiences:${isLatest}`, q);
    return mapSnapshot<Experience>(snapshot);
  } catch (error) {
    console.error('Error fetching experiences: ', error);
    return [];
  }
}

export async function fetchCertificates(isLatest: boolean = false): Promise<Certificate[]> {
  try {
    const certificatesRef = collection(db, 'certificates');
    const q = isLatest
      ? query(certificatesRef, orderBy('sortOrder'), limit(3))
      : query(certificatesRef, orderBy('sortOrder'));
    const snapshot = await getCachedDocs(`certificates:${isLatest}`, q);
    return mapSnapshot<Certificate>(snapshot);
  } catch (error) {
    console.error('Error fetching certificates: ', error);
    return [];
  }
}

export { db } from './firebase';
