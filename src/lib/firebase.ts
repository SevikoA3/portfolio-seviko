import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, limit, orderBy, query } from 'firebase/firestore';

// Replace with your Firebase config or set via .env files
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  demoLink?: string;
  repoLink?: string;
  tags: string[];
  sortOrder: number;
}

export async function fetchProjects(isLatest: boolean = false): Promise<Project[]> {
  try {
    const projectsRef = collection(db, 'projects');
    const q = isLatest
      ? query(projectsRef, orderBy('sortOrder'), limit(3))
      : query(projectsRef, orderBy('sortOrder'));
    const snapshot = await getDocs(q);
    
    const projects: Project[] = [];
    snapshot.forEach((doc) => {
      projects.push({ id: doc.id, ...doc.data() } as Project);
    });
    
    return projects;
  } catch (error) {
    console.error("Error fetching projects: ", error);
    return [];
  }
}

export interface Publication {
  id: string;
  title: string;
  abstract: string;
  type: string;
  year: number;
  link: string;
}

export async function fetchPublications(isLatest: boolean = false): Promise<Publication[]> {
  try {
    const pubRef = collection(db, 'publications');
    const q = isLatest ? query(pubRef, limit(1)) : query(pubRef);
    const snapshot = await getDocs(q);
    
    const pubs: Publication[] = [];
    snapshot.forEach((doc) => {
      pubs.push({ id: doc.id, ...doc.data() } as Publication);
    });
    
    return pubs;
  } catch (error) {
    console.error("Error fetching publications: ", error);
    return [];
  }
}

export interface ExperienceRole {
  title: string;
  startDate: string;
  endDate?: string | null;
  location?: string;
  skills?: string[];
}

export interface Experience {
  id: string;
  company: string;
  location?: string;
  summary?: string;
  category?: string;
  employmentType?: string;
  workSetup?: string;
  roles: ExperienceRole[];
  sortOrder: number;
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
      experiences.push({ id: doc.id, ...doc.data() } as Experience);
    });

    return experiences;
  } catch (error) {
    console.error('Error fetching experiences: ', error);
    return [];
  }
}

export { db };
