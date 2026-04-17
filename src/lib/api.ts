import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { db } from './firebase';
import type { Project, MoreProject, Publication, Experience, Certificate } from './types';

function mapSnapshot<T>(snapshot: Awaited<ReturnType<typeof getDocs>>): T[] {
  const items: T[] = [];
  snapshot.forEach((documentSnapshot) => {
    items.push({ id: documentSnapshot.id, ...(documentSnapshot.data() as any) } as T);
  });
  return items;
}

export async function fetchProjects(isLatest: boolean = false): Promise<Project[]> {
  try {
    const projectsRef = collection(db, 'projects');
    const q = isLatest
      ? query(projectsRef, orderBy('sortOrder'), limit(3))
      : query(projectsRef, orderBy('sortOrder'));
    const snapshot = await getDocs(q);
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
    const snapshot = await getDocs(q);
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
    const snapshot = await getDocs(q);
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
    const snapshot = await getDocs(q);
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
    const snapshot = await getDocs(q);
    return mapSnapshot<Certificate>(snapshot);
  } catch (error) {
    console.error('Error fetching certificates: ', error);
    return [];
  }
}

export { db } from './firebase';
