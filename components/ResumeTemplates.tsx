import React from 'react';
import { ResumeData, SectionType } from '../types';
import { IconMail, IconPhone, IconMapPin, IconGlobe, IconLink } from './Icons';

interface TemplateProps {
  data: ResumeData;
}

const ContactLine = ({ data, dark = false }: { data: ResumeData, dark?: boolean }) => {
  const { email, phone, location, website } = data.personal;
  const color = dark ? 'text-white/80' : 'text-gray-600';
  const iconClass = "w-3.5 h-3.5 mr-1 opacity-70";
  
  return (
    <div className={`flex flex-wrap gap-3 text-xs mt-2 ${color}`}>
      {email && <div className="flex items-center"><IconMail className={iconClass} /> {email}</div>}
      {phone && <div className="flex items-center"><IconPhone className={iconClass} /> {phone}</div>}
      {location && <div className="flex items-center"><IconMapPin className={iconClass} /> {location}</div>}
      {website && <div className="flex items-center"><IconGlobe className={iconClass} /> {website}</div>}
    </div>
  );
};

// --- Template: CLASSIC ---
export const TemplateClassic: React.FC<TemplateProps> = ({ data }) => {
  const { personal, meta } = data;
  
  return (
    <div className={`h-full p-6 bg-white text-gray-900 ${meta.fontFamily}`}>
      <header className="border-b-2 pb-4 mb-5" style={{ borderColor: meta.accentColor }}>
        <h1 className="text-3xl font-bold uppercase tracking-wide leading-tight" style={{ color: meta.accentColor }}>
          {personal.fullName}
        </h1>
        <p className="text-lg mt-1 font-light text-gray-800">{personal.jobTitle}</p>
        <ContactLine data={data} />
      </header>

      <section className="mb-5">
        <h3 className="text-sm font-bold uppercase mb-2 border-b border-gray-200 pb-1 text-gray-800" style={{ pageBreakAfter: 'avoid' }}>Professional Summary</h3>
        <p className="text-xs leading-relaxed text-gray-700 text-justify">{personal.summary}</p>
      </section>

      {meta.sectionOrder.map(section => {
        if (section === 'work') return (
          <section key="work" className="mb-5">
            <h3 className="text-sm font-bold uppercase mb-3 border-b border-gray-200 pb-1 text-gray-800" style={{ pageBreakAfter: 'avoid' }}>Experience</h3>
            {data.work.map(job => (
              <div key={job.id} className="mb-3 break-inside-avoid" style={{ pageBreakInside: 'avoid' }}>
                <div className="flex justify-between items-baseline">
                  <h4 className="font-bold text-sm text-gray-900">{job.position}</h4>
                  <span className="text-xs text-gray-500 italic font-medium">
                    {job.startDate} — {job.current ? 'Present' : job.endDate}
                  </span>
                </div>
                <div className="text-xs font-bold mb-1" style={{ color: meta.accentColor }}>{job.company}</div>
                <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed text-justify">{job.description}</p>
              </div>
            ))}
          </section>
        );
        if (section === 'projects') return (
          <section key="projects" className="mb-5">
            <h3 className="text-sm font-bold uppercase mb-3 border-b border-gray-200 pb-1 text-gray-800" style={{ pageBreakAfter: 'avoid' }}>Projects</h3>
            {data.projects.map(project => (
              <div key={project.id} className="mb-3 break-inside-avoid" style={{ pageBreakInside: 'avoid' }}>
                 <div className="flex justify-between items-baseline">
                   <h4 className="font-bold text-sm text-gray-900">{project.name}</h4>
                   {project.link && (
                     <a href={project.link.startsWith('http') ? project.link : `https://${project.link}`} target="_blank" rel="noopener noreferrer" className="text-xs flex items-center hover:underline" style={{ color: meta.accentColor }}>
                       <IconLink className="w-3 h-3 mr-1" /> {project.link.replace(/^https?:\/\//, '')}
                     </a>
                   )}
                 </div>
                 <p className="text-xs text-gray-700 mt-1 leading-relaxed text-justify">{project.description}</p>
              </div>
            ))}
          </section>
        );
        if (section === 'education') return (
          <section key="edu" className="mb-5">
             <h3 className="text-sm font-bold uppercase mb-3 border-b border-gray-200 pb-1 text-gray-800" style={{ pageBreakAfter: 'avoid' }}>Education</h3>
             {data.education.map(edu => (
               <div key={edu.id} className="mb-3 break-inside-avoid" style={{ pageBreakInside: 'avoid' }}>
                 <div className="flex justify-between items-baseline">
                   <h4 className="font-bold text-sm text-gray-900">{edu.school}</h4>
                   <span className="text-xs text-gray-500 italic font-medium">
                     {edu.startDate} — {edu.current ? 'Present' : edu.endDate}
                   </span>
                 </div>
                 <div className="text-xs text-gray-700">{edu.degree}, {edu.field}</div>
               </div>
             ))}
          </section>
        );
        if (section === 'certifications' && data.certifications?.length > 0) return (
          <section key="certs" className="mb-5">
             <h3 className="text-sm font-bold uppercase mb-3 border-b border-gray-200 pb-1 text-gray-800" style={{ pageBreakAfter: 'avoid' }}>Certifications</h3>
             {data.certifications.map(cert => (
               <div key={cert.id} className="mb-2 break-inside-avoid" style={{ pageBreakInside: 'avoid' }}>
                 <div className="flex justify-between items-baseline">
                   <h4 className="font-bold text-sm text-gray-900">{cert.name}</h4>
                   <span className="text-xs text-gray-500 italic font-medium">{cert.date}</span>
                 </div>
                 <div className="text-xs flex items-center gap-2">
                    <span className="text-gray-700">{cert.issuer}</span>
                    {cert.link && (
                      <a href={cert.link.startsWith('http') ? cert.link : `https://${cert.link}`} target="_blank" rel="noopener noreferrer" className="text-xs hover:underline" style={{ color: meta.accentColor }}>
                        (View)
                      </a>
                    )}
                 </div>
               </div>
             ))}
          </section>
        );
        if (section === 'skills') return (
          <section key="skills" className="mb-5">
            <h3 className="text-sm font-bold uppercase mb-3 border-b border-gray-200 pb-1 text-gray-800" style={{ pageBreakAfter: 'avoid' }}>Skills</h3>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {data.skills.map(skill => (
                <div key={skill.id} className="flex items-center text-xs break-inside-avoid">
                  <span className="w-1.5 h-1.5 rounded-full mr-2" style={{ backgroundColor: meta.accentColor }}></span>
                  <span className="font-medium text-gray-800">{skill.name}</span>
                </div>
              ))}
            </div>
          </section>
        );
        return null;
      })}
    </div>
  );
};

// --- Template: MODERN ---
export const TemplateModern: React.FC<TemplateProps> = ({ data }) => {
  const { personal, meta } = data;
  
  return (
    <div className={`h-full grid grid-cols-[30%_70%] min-h-full ${meta.fontFamily}`}>
      {/* Left Sidebar */}
      <aside className="p-6 text-white h-full" style={{ backgroundColor: meta.accentColor }}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold leading-tight mb-1">{personal.fullName}</h1>
          <p className="text-white/80 font-medium text-sm">{personal.jobTitle}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider mb-3 border-b border-white/20 pb-1">Contact</h3>
          <ContactLine data={data} dark={true} />
        </div>

        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider mb-3 border-b border-white/20 pb-1">Education</h3>
          {data.education.map(edu => (
            <div key={edu.id} className="mb-3">
              <div className="font-bold text-sm">{edu.degree}</div>
              <div className="text-xs text-white/90">{edu.school}</div>
              <div className="text-xs text-white/70 italic mt-0.5">{edu.startDate.split('-')[0]} - {edu.endDate ? edu.endDate.split('-')[0] : 'Present'}</div>
            </div>
          ))}
        </div>

        {data.certifications?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3 border-b border-white/20 pb-1">Certifications</h3>
            {data.certifications.map(cert => (
              <div key={cert.id} className="mb-3">
                <div className="font-bold text-sm">{cert.name}</div>
                <div className="text-xs text-white/90">{cert.issuer}</div>
                <div className="flex justify-between items-center mt-0.5">
                  <span className="text-xs text-white/70 italic">{cert.date}</span>
                  {cert.link && (
                     <a href={cert.link} target="_blank" className="text-xs text-white/80 hover:text-white hover:underline">Link ↗</a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider mb-3 border-b border-white/20 pb-1">Skills</h3>
          <div className="space-y-2">
             {data.skills.map(skill => (
               <div key={skill.id}>
                 <div className="flex justify-between text-xs mb-0.5">
                   <span>{skill.name}</span>
                 </div>
                 <div className="h-1 bg-white/20 rounded overflow-hidden">
                   <div className="h-full bg-white transition-all duration-1000 ease-out" style={{ width: `${skill.level}%` }}></div>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="p-6 bg-white h-full">
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase tracking-widest mb-3 text-gray-800 border-b border-gray-100 pb-1" style={{ pageBreakAfter: 'avoid' }}>Profile</h2>
          <p className="text-xs text-gray-600 leading-relaxed text-justify">{personal.summary}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase tracking-widest mb-4 text-gray-800 border-b border-gray-100 pb-1" style={{ pageBreakAfter: 'avoid' }}>Experience</h2>
          <div className="border-l-2 border-gray-200 ml-1 pl-5 space-y-5">
            {data.work.map(job => (
              <div key={job.id} className="relative group break-inside-avoid" style={{ pageBreakInside: 'avoid' }}>
                <div className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full border-2 bg-white" style={{ borderColor: meta.accentColor }}></div>
                <div className="flex justify-between items-baseline mb-0.5">
                   <h3 className="text-sm font-bold text-gray-900">{job.position}</h3>
                   <span className="text-xs font-bold px-2 py-0.5 rounded bg-gray-50 text-gray-600">
                     {job.startDate} — {job.current ? 'Present' : job.endDate}
                   </span>
                </div>
                <div className="text-xs font-medium mb-2" style={{ color: meta.accentColor }}>{job.company}</div>
                <p className="text-xs text-gray-600 whitespace-pre-line text-justify">{job.description}</p>
              </div>
            ))}
          </div>
        </section>

        {data.projects.length > 0 && (
          <section>
            <h2 className="text-lg font-bold uppercase tracking-widest mb-4 text-gray-800 border-b border-gray-100 pb-1" style={{ pageBreakAfter: 'avoid' }}>Projects</h2>
            <div className="grid grid-cols-1 gap-4">
              {data.projects.map(project => (
                <div key={project.id} className="border-l-4 pl-4 break-inside-avoid" style={{ borderColor: meta.accentColor, pageBreakInside: 'avoid' }}>
                  <div className="flex justify-between items-center mb-0.5">
                    <h3 className="font-bold text-sm text-gray-900">{project.name}</h3>
                    {project.link && (
                      <a href={project.link.startsWith('http') ? project.link : `https://${project.link}`} target="_blank" rel="noopener noreferrer" className="text-xs flex items-center hover:underline text-gray-500">
                         <IconLink className="w-3 h-3 mr-1" /> Link
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 text-justify">{project.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

// --- Template: CREATIVE ---
export const TemplateCreative: React.FC<TemplateProps> = ({ data }) => {
  const { personal, meta } = data;
  
  return (
    <div className={`h-full p-8 bg-white relative overflow-hidden ${meta.fontFamily}`}>
       {/* Decorative Circles */}
       <div className="absolute top-0 right-0 w-64 h-64 rounded-full -mr-20 -mt-20 opacity-10" style={{ backgroundColor: meta.accentColor }}></div>
       <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full -ml-10 -mb-10 opacity-5" style={{ backgroundColor: meta.accentColor }}></div>

       <header className="relative z-10 text-center mb-8">
         <h1 className="text-4xl font-bold mb-1 text-gray-800">{personal.fullName}</h1>
         <p className="text-sm font-medium tracking-widest uppercase mb-3" style={{ color: meta.accentColor }}>{personal.jobTitle}</p>
         <div className="flex justify-center">
            <ContactLine data={data} />
         </div>
       </header>

       <div className="grid grid-cols-2 gap-8 relative z-10">
          <div className="space-y-6">
             <section className="bg-gray-50 p-5 rounded-lg border-l-4" style={{ borderColor: meta.accentColor }}>
               <h3 className="font-bold text-gray-900 mb-2 flex items-center text-sm">
                 <span className="mr-2 text-lg">⚡</span> Summary
               </h3>
               <p className="text-xs text-gray-600 italic leading-relaxed text-justify">{personal.summary}</p>
             </section>

             <section>
               <h3 className="font-bold text-gray-900 text-sm mb-3 border-b pb-1" style={{ pageBreakAfter: 'avoid' }}>Experience</h3>
               {data.work.map(job => (
                 <div key={job.id} className="mb-5 last:mb-0 break-inside-avoid" style={{ pageBreakInside: 'avoid' }}>
                    <h4 className="font-bold text-sm">{job.position}</h4>
                    <div className="text-xs font-medium opacity-80 mb-1">{job.company} | {job.startDate} - {job.current ? 'Present' : job.endDate}</div>
                    <p className="text-xs text-gray-600 text-justify">{job.description}</p>
                 </div>
               ))}
             </section>
             
             {data.projects.length > 0 && (
               <section>
                 <h3 className="font-bold text-gray-900 text-sm mb-3 border-b pb-1" style={{ pageBreakAfter: 'avoid' }}>Projects</h3>
                 {data.projects.map(project => (
                   <div key={project.id} className="mb-4 last:mb-0 break-inside-avoid" style={{ pageBreakInside: 'avoid' }}>
                      <div className="flex items-center justify-between">
                         <h4 className="font-bold text-sm">{project.name}</h4>
                         {project.link && <a href={project.link} target="_blank" className="text-xs opacity-60 hover:opacity-100">↗</a>}
                      </div>
                      <p className="text-xs text-gray-600 mt-1 text-justify">{project.description}</p>
                   </div>
                 ))}
               </section>
             )}
          </div>

          <div className="space-y-6">
             <section>
               <h3 className="font-bold text-gray-900 text-sm mb-3 border-b pb-1" style={{ pageBreakAfter: 'avoid' }}>Education</h3>
               {data.education.map(edu => (
                 <div key={edu.id} className="mb-3 bg-gray-50 p-3 rounded-lg break-inside-avoid" style={{ pageBreakInside: 'avoid' }}>
                    <h4 className="font-bold text-sm">{edu.school}</h4>
                    <div className="text-xs" style={{ color: meta.accentColor }}>{edu.degree}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{edu.startDate} - {edu.endDate}</div>
                 </div>
               ))}
             </section>

             {data.certifications?.length > 0 && (
               <section>
                 <h3 className="font-bold text-gray-900 text-sm mb-3 border-b pb-1" style={{ pageBreakAfter: 'avoid' }}>Certifications</h3>
                 {data.certifications.map(cert => (
                   <div key={cert.id} className="mb-3 bg-gray-50 p-3 rounded-lg break-inside-avoid" style={{ pageBreakInside: 'avoid' }}>
                      <h4 className="font-bold text-sm">{cert.name}</h4>
                      <div className="text-xs opacity-80">{cert.issuer}</div>
                      <div className="flex justify-between items-center mt-0.5">
                         <span className="text-xs text-gray-500">{cert.date}</span>
                         {cert.link && <a href={cert.link} target="_blank" className="text-xs text-gray-500 hover:text-gray-900">View ↗</a>}
                      </div>
                   </div>
                 ))}
               </section>
             )}

             <section>
               <h3 className="font-bold text-gray-900 text-sm mb-3 border-b pb-1" style={{ pageBreakAfter: 'avoid' }}>Skills</h3>
               <div className="flex flex-wrap gap-2">
                 {data.skills.map(skill => (
                   <span key={skill.id} className="px-2 py-1 bg-gray-900 text-white rounded-full text-xs font-bold shadow-sm flex items-center break-inside-avoid">
                     {skill.name}
                     {skill.level > 80 && <span className="ml-1 text-yellow-400">★</span>}
                   </span>
                 ))}
               </div>
             </section>
          </div>
       </div>
    </div>
  );
};