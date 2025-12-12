import { ResumeData } from './types';

export const INITIAL_DATA: ResumeData = {
  personal: {
    fullName: 'Alex J. Developer',
    jobTitle: 'Senior Frontend Engineer',
    email: 'alex.dev@example.com',
    phone: '(555) 123-4567',
    location: 'San Francisco, CA',
    website: 'github.com/alexdev',
    summary: 'Creative and detail-oriented Frontend Engineer with 6+ years of experience building scalable web applications. Passionate about UI/UX, accessibility, and performance optimization. Proven track record of leading teams and delivering high-quality code.',
  },
  work: [
    {
      id: '1',
      company: 'Tech Solutions Inc.',
      position: 'Senior React Developer',
      startDate: '2021-03',
      endDate: '',
      current: true,
      description: '• Led the migration of a legacy monolithic application to a micro-frontend architecture using React and TypeScript.\n• Improved site performance by 40% through code splitting and lazy loading.\n• Mentored 3 junior developers and established code quality standards.',
    },
    {
      id: '2',
      company: 'Creative Agency',
      position: 'Frontend Developer',
      startDate: '2018-06',
      endDate: '2021-02',
      current: false,
      description: '• Developed responsive websites for high-profile clients using HTML5, CSS3, and JavaScript.\n• Collaborated with designers to implement pixel-perfect user interfaces.',
    },
  ],
  education: [
    {
      id: '1',
      school: 'University of Technology',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      startDate: '2014-09',
      endDate: '2018-05',
      current: false,
    },
  ],
  skills: [
    { id: '1', name: 'React & TypeScript', level: 95 },
    { id: '2', name: 'Node.js', level: 80 },
    { id: '3', name: 'UI/UX Design', level: 85 },
    { id: '4', name: 'AWS', level: 70 },
    { id: '5', name: 'Tailwind CSS', level: 90 },
  ],
  projects: [
    {
      id: '1',
      name: 'E-Commerce Dashboard',
      link: 'github.com/alexdev/dashboard',
      description: 'Built a comprehensive analytics dashboard for online retailers using React, D3.js, and Firebase. Features real-time data visualization and export capabilities.',
    },
    {
      id: '2',
      name: 'Task Master App',
      link: 'taskmaster.app',
      description: 'A productivity application focused on simple task management. Developed with React Native for cross-platform support on iOS and Android.',
    }
  ],
  meta: {
    template: 'modern',
    accentColor: '#0ea5e9',
    fontFamily: 'font-sans',
    sectionOrder: ['work', 'projects', 'education', 'skills'],
  },
};