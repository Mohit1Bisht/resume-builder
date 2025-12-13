import React, { useState } from 'react';
import { ResumeData, SectionType, ExperienceItem, EducationItem, SkillItem, ProjectItem, CertificationItem } from '../types';
import { IconGripVertical, IconTrash, IconPlus } from './Icons';

interface EditorPanelProps {
  data: ResumeData;
  onChange: (newData: ResumeData) => void;
}

const SectionWrapper = ({ title, children, isOpen: defaultOpen = false }: { title: string, children?: React.ReactNode, isOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm transition-all duration-300 mb-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center text-left hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
      >
        <span className="font-semibold text-gray-700 dark:text-gray-200">{title}</span>
        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''} text-gray-400`}>▼</span>
      </button>
      <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
        <div className="p-4 space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
};

const InputGroup = ({ label, value, onChange, type = "text", placeholder = "", rows = 1, maxLength }: { label: string, value: string, onChange: (val: string) => void, type?: string, placeholder?: string, rows?: number, maxLength?: number }) => (
  <div className="mb-3">
    <div className="flex justify-between">
      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">{label}</label>
      {maxLength && <span className="text-xs text-gray-400">{value.length}/{maxLength}</span>}
    </div>
    {rows > 1 ? (
      <textarea
        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all resize-y text-sm"
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
      />
    ) : (
      <input
        type={type}
        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    )}
  </div>
);

export const EditorPanel: React.FC<EditorPanelProps> = ({ data, onChange }) => {
  const updatePersonal = (field: keyof typeof data.personal, value: string) => {
    onChange({ ...data, personal: { ...data.personal, [field]: value } });
  };

  // Generic helpers for array manipulation
  const addItem = <T extends { id: string }>(
    key: 'work' | 'education' | 'skills' | 'projects' | 'certifications',
    newItem: T
  ) => {
    // Ensure array exists
    const list = data[key] || [];
    onChange({ ...data, [key]: [...list, newItem] });
  };

  const removeItem = (key: 'work' | 'education' | 'skills' | 'projects' | 'certifications', id: string) => {
    const list = data[key] as any[] || [];
    onChange({ ...data, [key]: list.filter(item => item.id !== id) });
  };

  const updateItem = (key: 'work' | 'education' | 'skills' | 'projects' | 'certifications', id: string, field: string, value: any) => {
    const list = data[key] as any[] || [];
    onChange({
      ...data,
      [key]: list.map(item => item.id === id ? { ...item, [field]: value } : item)
    });
  };

  // Drag and Drop Handlers for Section Ordering
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("text/plain", index.toString());
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData("text/plain"));
    if (sourceIndex === targetIndex) return;

    const newOrder = [...data.meta.sectionOrder];
    const [removed] = newOrder.splice(sourceIndex, 1);
    newOrder.splice(targetIndex, 0, removed);
    
    onChange({ ...data, meta: { ...data.meta, sectionOrder: newOrder } });
  };


  return (
    <div className="h-full flex flex-col pr-2">
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-20">
        
        {/* Personal Details */}
        <SectionWrapper title="Personal Information" isOpen={true}>
          <div className="grid grid-cols-2 gap-4">
            <InputGroup label="Full Name" value={data.personal.fullName} onChange={(v) => updatePersonal('fullName', v)} />
            <InputGroup label="Job Title" value={data.personal.jobTitle} onChange={(v) => updatePersonal('jobTitle', v)} />
          </div>
          <InputGroup label="Email" value={data.personal.email} onChange={(v) => updatePersonal('email', v)} type="email" />
          <InputGroup label="Phone" value={data.personal.phone} onChange={(v) => updatePersonal('phone', v)} type="tel" />
          <div className="grid grid-cols-2 gap-4">
            <InputGroup label="Location" value={data.personal.location} onChange={(v) => updatePersonal('location', v)} />
            <InputGroup label="Website" value={data.personal.website} onChange={(v) => updatePersonal('website', v)} />
          </div>
          <InputGroup 
            label="Professional Summary" 
            value={data.personal.summary} 
            onChange={(v) => updatePersonal('summary', v)} 
            rows={4} 
            maxLength={500}
            placeholder="Write a short professional bio..."
          />
        </SectionWrapper>

        {/* Dynamic Sections based on order */}
        {data.meta.sectionOrder.map((section, index) => {
          return (
             <div 
               key={section}
               draggable
               onDragStart={(e) => handleDragStart(e, index)}
               onDragOver={handleDragOver}
               onDrop={(e) => handleDrop(e, index)}
               className="group relative"
             >
               <div className="absolute -left-6 top-4 p-2 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity text-gray-400">
                  <IconGripVertical />
               </div>

               {section === 'work' && (
                 <SectionWrapper title="Experience">
                   {data.work.map(job => (
                     <div key={job.id} className="p-4 border border-gray-100 dark:border-gray-700 rounded-lg bg-gray-50/50 dark:bg-gray-800 mb-4 animate-fade-in relative group/item">
                       <button onClick={() => removeItem('work', job.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover/item:opacity-100"><IconTrash className="w-4 h-4" /></button>
                       <InputGroup label="Company" value={job.company} onChange={(v) => updateItem('work', job.id, 'company', v)} />
                       <InputGroup label="Position" value={job.position} onChange={(v) => updateItem('work', job.id, 'position', v)} />
                       <div className="grid grid-cols-2 gap-4">
                         <InputGroup label="Start Date" value={job.startDate} onChange={(v) => updateItem('work', job.id, 'startDate', v)} type="month" />
                         <div className="flex flex-col">
                            {!job.current && <InputGroup label="End Date" value={job.endDate} onChange={(v) => updateItem('work', job.id, 'endDate', v)} type="month" />}
                            <label className="flex items-center mt-2 text-xs text-gray-500 cursor-pointer">
                              <input type="checkbox" checked={job.current} onChange={(e) => updateItem('work', job.id, 'current', e.target.checked)} className="mr-2 rounded text-brand-500 focus:ring-brand-500" />
                              I currently work here
                            </label>
                         </div>
                       </div>
                       <InputGroup label="Description" value={job.description} onChange={(v) => updateItem('work', job.id, 'description', v)} rows={3} placeholder="• Bullet points..." />
                     </div>
                   ))}
                   <button 
                     onClick={() => addItem<ExperienceItem>('work', { id: Date.now().toString(), company: 'New Company', position: 'Position', startDate: '', endDate: '', current: false, description: '' })}
                     className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-brand-500 hover:text-brand-500 transition-all flex justify-center items-center gap-2 font-medium text-sm"
                   >
                     <IconPlus className="w-4 h-4" /> Add Position
                   </button>
                 </SectionWrapper>
               )}

               {section === 'projects' && (
                 <SectionWrapper title="Projects">
                   {data.projects.map(project => (
                     <div key={project.id} className="p-4 border border-gray-100 dark:border-gray-700 rounded-lg bg-gray-50/50 dark:bg-gray-800 mb-4 animate-fade-in relative group/item">
                       <button onClick={() => removeItem('projects', project.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover/item:opacity-100"><IconTrash className="w-4 h-4" /></button>
                       <InputGroup label="Project Name" value={project.name} onChange={(v) => updateItem('projects', project.id, 'name', v)} />
                       <InputGroup label="Link URL" value={project.link} onChange={(v) => updateItem('projects', project.id, 'link', v)} placeholder="e.g. github.com/myproject" />
                       <InputGroup label="Description" value={project.description} onChange={(v) => updateItem('projects', project.id, 'description', v)} rows={2} placeholder="Brief description..." />
                     </div>
                   ))}
                   <button 
                     onClick={() => addItem<ProjectItem>('projects', { id: Date.now().toString(), name: 'New Project', link: '', description: '' })}
                     className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-brand-500 hover:text-brand-500 transition-all flex justify-center items-center gap-2 font-medium text-sm"
                   >
                     <IconPlus className="w-4 h-4" /> Add Project
                   </button>
                 </SectionWrapper>
               )}

               {section === 'education' && (
                 <SectionWrapper title="Education">
                   {data.education.map(edu => (
                     <div key={edu.id} className="p-4 border border-gray-100 dark:border-gray-700 rounded-lg bg-gray-50/50 dark:bg-gray-800 mb-4 animate-fade-in relative group/item">
                       <button onClick={() => removeItem('education', edu.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover/item:opacity-100"><IconTrash className="w-4 h-4" /></button>
                       <InputGroup label="School / University" value={edu.school} onChange={(v) => updateItem('education', edu.id, 'school', v)} />
                       <InputGroup label="Degree" value={edu.degree} onChange={(v) => updateItem('education', edu.id, 'degree', v)} />
                       <InputGroup label="Field of Study" value={edu.field} onChange={(v) => updateItem('education', edu.id, 'field', v)} />
                       <div className="grid grid-cols-2 gap-4">
                         <InputGroup label="Start Date" value={edu.startDate} onChange={(v) => updateItem('education', edu.id, 'startDate', v)} type="month" />
                         <InputGroup label="End Date" value={edu.endDate} onChange={(v) => updateItem('education', edu.id, 'endDate', v)} type="month" />
                       </div>
                     </div>
                   ))}
                    <button 
                     onClick={() => addItem<EducationItem>('education', { id: Date.now().toString(), school: 'University', degree: 'Degree', field: 'Major', startDate: '', endDate: '', current: false })}
                     className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-brand-500 hover:text-brand-500 transition-all flex justify-center items-center gap-2 font-medium text-sm"
                   >
                     <IconPlus className="w-4 h-4" /> Add Education
                   </button>
                 </SectionWrapper>
               )}

               {section === 'certifications' && (
                 <SectionWrapper title="Certifications">
                   {/* Handle case where data.certifications might be undefined during migration */}
                   {(data.certifications || []).map(cert => (
                     <div key={cert.id} className="p-4 border border-gray-100 dark:border-gray-700 rounded-lg bg-gray-50/50 dark:bg-gray-800 mb-4 animate-fade-in relative group/item">
                       <button onClick={() => removeItem('certifications', cert.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover/item:opacity-100"><IconTrash className="w-4 h-4" /></button>
                       <InputGroup label="Certification Name" value={cert.name} onChange={(v) => updateItem('certifications', cert.id, 'name', v)} />
                       <InputGroup label="Issued By" value={cert.issuer} onChange={(v) => updateItem('certifications', cert.id, 'issuer', v)} />
                       <div className="grid grid-cols-2 gap-4">
                          <InputGroup label="Date" value={cert.date} onChange={(v) => updateItem('certifications', cert.id, 'date', v)} type="month" />
                          <InputGroup label="Link" value={cert.link} onChange={(v) => updateItem('certifications', cert.id, 'link', v)} placeholder="Credential URL" />
                       </div>
                     </div>
                   ))}
                    <button 
                     onClick={() => addItem<CertificationItem>('certifications', { id: Date.now().toString(), name: 'Certificate Name', issuer: 'Issuer Organization', date: '', link: '' })}
                     className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-brand-500 hover:text-brand-500 transition-all flex justify-center items-center gap-2 font-medium text-sm"
                   >
                     <IconPlus className="w-4 h-4" /> Add Certification
                   </button>
                 </SectionWrapper>
               )}

               {section === 'skills' && (
                 <SectionWrapper title="Skills">
                    <div className="grid grid-cols-1 gap-3">
                      {data.skills.map(skill => (
                        <div key={skill.id} className="flex gap-2 items-center animate-fade-in">
                          <IconGripVertical className="text-gray-300 w-4 h-4 cursor-move" />
                          <input 
                            className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded text-sm focus:ring-2 focus:ring-brand-500"
                            value={skill.name}
                            onChange={(e) => updateItem('skills', skill.id, 'name', e.target.value)}
                            placeholder="Skill Name"
                          />
                           <input 
                            type="range"
                            min="0"
                            max="100"
                            step="10"
                            className="w-24 accent-brand-600"
                            value={skill.level}
                            onChange={(e) => updateItem('skills', skill.id, 'level', parseInt(e.target.value))}
                            title={`Proficiency: ${skill.level}%`}
                          />
                          <button onClick={() => removeItem('skills', skill.id)} className="text-gray-400 hover:text-red-500"><IconTrash className="w-4 h-4" /></button>
                        </div>
                      ))}
                    </div>
                    <button 
                     onClick={() => addItem<SkillItem>('skills', { id: Date.now().toString(), name: '', level: 50 })}
                     className="w-full mt-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-brand-500 hover:text-brand-500 transition-all flex justify-center items-center gap-2 font-medium text-sm"
                   >
                     <IconPlus className="w-4 h-4" /> Add Skill
                   </button>
                 </SectionWrapper>
               )}
             </div>
          );
        })}

        <div className="text-center text-xs text-gray-400 mt-6">
          Drag sections by the left handle to reorder.<br/>
          Changes are auto-saved locally.
        </div>
      </div>
    </div>
  );
};