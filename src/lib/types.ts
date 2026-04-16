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

export interface MoreProject {
  id: string;
  title: string;
  description: string;
  category: string;
  repoLink: string;
  tags: string[];
  sortOrder: number;
}

export interface Publication {
  id: string;
  title: string;
  abstract: string;
  type: string;
  year: number;
  link: string;
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

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  category: string;
  issuedAtLabel: string;
  issuedAt?: string;
  credentialId?: string;
  summary: string;
  highlights: string[];
  driveUrl: string;
  driveFileId: string;
  thumbnailUrl: string;
  fileType: 'pdf' | 'image';
  sortOrder: number;
}
