import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { db } from './firebase';
import type { Project, MoreProject, Publication, Experience, Certificate } from './types';

export async function fetchProjects(isLatest: boolean = false): Promise<Project[]> {
  try {
    const projectsRef = collection(db, 'projects');
    const q = isLatest
      ? query(projectsRef, orderBy('sortOrder'), limit(3))
      : query(projectsRef, orderBy('sortOrder'));
    const snapshot = await getDocs(q);

    const projects: Project[] = [];
    snapshot.forEach((doc) => {
      projects.push({ id: doc.id, ...(doc.data() as any) } as Project);
    });

    return projects;
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

    const moreProjects: MoreProject[] = [];
    snapshot.forEach((doc) => {
      moreProjects.push({ id: doc.id, ...(doc.data() as any) } as MoreProject);
    });

    return moreProjects;
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

    const pubs: Publication[] = [];
    snapshot.forEach((doc) => {
      pubs.push({ id: doc.id, ...(doc.data() as any) } as Publication);
    });

    return pubs;
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

    const experiences: Experience[] = [];
    snapshot.forEach((doc) => {
      experiences.push({ id: doc.id, ...(doc.data() as any) } as Experience);
    });

    return experiences;
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

    const certificates: Certificate[] = [];
    snapshot.forEach((doc) => {
      certificates.push({ id: doc.id, ...(doc.data() as any) } as Certificate);
    });

    return certificates;
  } catch (error) {
    console.error('Error fetching certificates: ', error);
    return [];
  }
}

export { db } from './firebase';
