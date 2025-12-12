export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  summary: string;
  jobTitle: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface EducationItem {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  current: boolean;
}

export interface SkillItem {
  id: string;
  name: string;
  level: number; // 0-100
}

export interface ProjectItem {
  id: string;
  name: string;
  link: string;
  description: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link: string;
}

export type TemplateType = 'classic' | 'modern' | 'creative';
export type SectionType = 'work' | 'education' | 'skills' | 'projects' | 'certifications';

export interface ResumeData {
  personal: PersonalInfo;
  work: ExperienceItem[];
  education: EducationItem[];
  skills: SkillItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  meta: {
    template: TemplateType;
    accentColor: string;
    fontFamily: string;
    sectionOrder: SectionType[];
  };
}

export const FONTS = [
  { name: 'Modern Sans', value: 'font-sans' },
  { name: 'Classic Serif', value: 'font-serif' },
  { name: 'Bold Display', value: 'font-display' },
  { name: 'Tech Mono', value: 'font-mono' },
];

export const COLORS = [
  { name: 'Blue', value: '#0ea5e9' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Violet', value: '#8b5cf6' },
  { name: 'Rose', value: '#f43f5e' },
  { name: 'Slate', value: '#475569' },
  { name: 'Amber', value: '#f59e0b' },
];