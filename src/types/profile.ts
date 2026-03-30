export interface ExperienceEntry {
  id: string;
  title: string;
  company: string;
  dateStr: string;
  description: string;
}

export interface EducationEntry {
  id: string;
  degree: string;
  school: string;
  year: string;
}

export interface ProjectEntry {
  id: string;
  title: string;
  subtitle: string;
  dateStr: string;
  description: string;
}

export interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  summary: string;
  workExperience: ExperienceEntry[];
  projects: ProjectEntry[];
  education: EducationEntry[];
  skills: string[];
  achievements: string;
}
