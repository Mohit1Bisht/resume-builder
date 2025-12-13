import React from 'react';
import { ResumeData, SectionType } from '../types';
import { IconMail, IconPhone, IconMapPin, IconGlobe, IconLink } from './Icons';

interface TemplateProps {
  data: ResumeData;
}

const ContactLine = ({ data, dark = false }: { data: ResumeData, dark?: boolean }) => {
  const { email, phone, location, website } = data.personal;
  const color = dark ? 'text-white/80' : 'text-gray-600';
  const iconClass = "w-3 h-3 mr-1 opacity-70";
  
  return (
    <div className={`flex flex-wrap gap-2.5 text-[10px] mt-1.5 ${color}`}>
      {email && <div className="flex items-center"><IconMail className={iconClass} /> {email}</div>}
      {phone && <div className="flex items-center"><IconPhone className={iconClass} /> {phone}</div>}
      {location && <div className="flex items-center"><IconMapPin className={iconClass} /> {location}</div>}
      {website && <div className="flex items-center"><IconGlobe className={iconClass} /> {website}</div>}
    </div>
  );
};

// --- Template: CLASSIC (Compact) ---
export const TemplateClassic: React.FC<TemplateProps> = ({ data }) => {
  const { personal, meta } = data;
  
  return (
    <div className={`h-full p-6 bg-white text-gray-900 ${meta.fontFamily}`}>
      <header className="border-b pb-3 mb-4" style={{ borderColor: meta.accentColor }}>
        <h1 className="text-2xl font-bold uppercase tracking-wide leading-none" style={{ color: meta.accentColor }}>
          {personal.fullName}
        </h1>
        <p className="text-base mt-1 font-light text-gray-800">{personal.jobTitle}</p>
        <ContactLine data={data} />
      </header>

      <section className="mb-4">
        <h3 className="text-xs font-bold uppercase mb-1.5 border-b border-gray-200 pb-0.5 text-gray-800" style={{ pageBreakAfter: 'avoid' }}>Professional Summary</h3>
        <p className="text-[11px] leading-snug text-gray-700 text-justify">{personal.summary}</p>
      </section>

      {meta.sectionOrder.map(section => {
        if (section === 'work') return (
          <section key="work" className="mb-4">
            <h3 className="text-xs font-bold uppercase mb-2 border-b border-gray-200 pb-0.5 text-gray-800" style={{ pageBreakAfter: 'avoid' }}>Experience</h3>
            {data.work.map(job => (
              <div key={job.id} className="mb-2.5 break-inside-avoid" style={{ pageBreakInside: 'avoid' }}>
                <div className="flex justify-between items-baseline">
                  <h4 className="font-bold text-xs text-gray-900">{job.position}</h4>
                  <span className="text-[10px] text-gray-500 italic font-medium">
                    {job.startDate} — {job.current ? 'Present' : job.endDate}
                  </span>
                </div>
                <div className="text-[10px] font-bold mb-0.5" style={{ color: meta.accentColor }}>{job.company}</div>
                <p className="text-[11px] text-gray-700 whitespace-pre-line leading-snug text-justify">{job.description}</p>
              </div>
            ))}
          </section>
        );
        if (section === 'projects') return (
          <section key="projects" className="mb-4">
            <h3 className="text-xs font-bold uppercase mb-2 border-b border-gray-200 pb-0.5 text-gray-800" style={{ pageBreakAfter: 'avoid' }}>Projects</h3>
            {data.projects.map(project => (
              <div key={project.id} className="mb-2.5 break-inside-avoid" style={{ pageBreakInside: 'avoid' }}>
                 <div className="flex justify-between items-baseline">
                   <h4 className="font-bold text-xs text-gray-900">{project.name}</h4>
                   {project.link && (
                     <a href={project.link.startsWith('http') ? project.link : `https://${project.link}`} target="_blank" rel="noopener noreferrer" className="text-[10px] flex items-center hover:underline" style={{ color: meta.accentColor }}>
                       <IconLink className="w-2.5 h-2.5 mr-1" /> {project.link.replace(/^https?:\/\//, '')}
                     </a>
                   )}
                 </div>
                 <p className="text-[11px] text-gray-700 mt-0.5 leading-snug text-justify">{project.description}</p>
              </div>
            ))}
          </section>
        );
        if (section === 'education') return (
          <section key="edu" className="mb-4">
             <h3 className="text-xs font-bold uppercase mb-2 border-b border-gray-200 pb-0.5 text-gray-800" style={{ pageBreakAfter: 'avoid' }}>Education</h3>
             {data.education.map(edu => (
               <div key={edu.id} className="mb-2 break-inside-avoid" style={{ pageBreakInside: 'avoid' }}>
                 <div className="flex justify-between items-baseline">
                   <h4 className="font-bold text-xs text-gray-900">{edu.school}</h4>
                   <span className="text-[10px] text-gray-500 italic font-medium">
                     {edu.startDate} — {edu.current ? 'Present' : edu.endDate}
                   </span>
                 </div>
                 <div className="text-[10px] text-gray-700">{edu.degree}, {edu.field}</div>
               </div>
             ))}
          </section>
        );
        if (section === 'certifications' && data.certifications?.length > 0) return (
          <section key="certs" className="mb-4">
             <h3 className="text-xs font-bold uppercase mb-2 border-b border-gray-200 pb-0.5 text-gray-800" style={{ pageBreakAfter: 'avoid' }}>Certifications</h3>
             {data.certifications.map(cert => (
               <div key={cert.id} className="mb-2 break-inside-avoid" style={{ pageBreakInside: 'avoid' }}>
                 <div className="flex justify-between items-baseline">
                   <h4 className="font-bold text-xs text-gray-900">{cert.name}</h4>
                   <span className="text-[10px] text-gray-500 italic font-medium">{cert.date}</span>
                 </div>
                 <div className="text-[10px] flex items-center gap-2">
                    <span className="text-gray-700">{cert.issuer}</span>
                    {cert.link && (
                      <a href={cert.link.startsWith('http') ? cert.link : `https://${cert.link}`} target="_blank" rel="noopener noreferrer" className="text-[10px] hover:underline" style={{ color: meta.accentColor }}>
                        (View)
                      </a>
                    )}
                 </div>
               </div>
             ))}
          </section>
        );
        if (section === 'skills') return (
          <section key="skills" className="mb-4">
            <h3 className="text-xs font-bold uppercase mb-2 border-b border-gray-200 pb-0.5 text-gray-800" style={{ pageBreakAfter: 'avoid' }}>Skills</h3>
            <div className="flex flex-wrap gap-x-3 gap-y-1.5">
              {data.skills.map(skill => (
                <div key={skill.id} className="flex items-center text-[11px] break-inside-avoid">
                  <span className="w-1 h-1 rounded-full mr-1.5" style={{ backgroundColor: meta.accentColor }}></span>
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

// --- Template: MODERN (Compact) ---
export const TemplateModern: React.FC<TemplateProps> = ({ data }) => {
  const { personal, meta } = data;
  
  return (
    <div className={`h-full grid grid-cols-[28%_72%] min-h-full ${meta.fontFamily}`}>
      {/* Left Sidebar */}
      <aside className="p-5 text-white h-full" style={{ backgroundColor: meta.accentColor }}>
        <div className="mb-5">
          <h1 className="text-xl font-bold leading-tight mb-1">{personal.fullName}</h1>
          <p className="text-white/90 font-medium text-[11px]">{personal.jobTitle}</p>
        </div>

        <div className="mb-5">
          <h3 className="text-[10px] font-bold uppercase tracking-wider mb-2 border-b border-white/20 pb-1">Contact</h3>
          <ContactLine data={data} dark={true} />
        </div>

        <div className="mb-5">
          <h3 className="text-[10px] font-bold uppercase tracking-wider mb-2 border-b border-white/20 pb-1">Education</h3>
          {data.education.map(edu => (
            <div key={edu.id} className="mb-2.5">
              <div className="font-bold text-[11px]">{edu.degree}</div>
              <div className="text-[10px] text-white/90">{edu.school}</div>
              <div className="text-[10px] text-white/70 italic mt-0.5">{edu.startDate.split('-')[0]} - {edu.endDate ? edu.endDate.split('-')[0] : 'Present'}</div>
            </div>
          ))}
        </div>

        {data.certifications?.length > 0 && (
          <div className="mb-5">
            <h3 className="text-[10px] font-bold uppercase tracking-wider mb-2 border-b border-white/20 pb-1">Certifications</h3>
            {data.certifications.map(cert => (
              <div key={cert.id} className="mb-2.5">
                <div className="font-bold text-[11px]">{cert.name}</div>
                <div className="text-[10px] text-white/90">{cert.issuer}</div>
                <div className="flex justify-between items-center mt-0.5">
                  <span className="text-[10px] text-white/70 italic">{cert.date}</span>
                  {cert.link && (
                     <a href={cert.link} target="_blank" className="text-[10px] text-white/80 hover:text-white hover:underline">Link ↗</a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-wider mb-2 border-b border-white/20 pb-1">Skills</h3>
          <div className="space-y-1.5">
             {data.skills.map(skill => (
               <div key={skill.id}>
                 <div className="flex justify-between text-[10px] mb-0.5">
                   <span>{skill.name}</span>
                 </div>
                 <div className="h-0.5 bg-white/20 rounded overflow-hidden">
                   <div className="h-full bg-white transition-all duration-1000 ease-out" style={{ width: `${skill.level}%` }}></div>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="p-5 bg-white h-full">
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-widest mb-2 text-gray-800 border-b border-gray-100 pb-1" style={{ pageBreakAfter: 'avoid' }}>Profile</h2>
          <p className="text-[11px] text-gray-600 leading-snug text-justify">{personal.summary}</p>
        </section>

        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-widest mb-3 text-gray-800 border-b border-gray-100 pb-1" style={{ pageBreakAfter: 'avoid' }}>Experience</h2>
          <div className="border-l-2 border-gray-200 ml-1 pl-4 space-y-3">
            {data.work.map(job => (
              <div key={job.id} className="relative group break-inside-avoid" style={{ pageBreakInside: 'avoid' }}>
                <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full border-2 bg-white" style={{ borderColor: meta.accentColor }}></div>
                <div className="flex justify-between items-baseline mb-0.5">
                   <h3 className="text-sm font-bold text-gray-900">{job.position}</h3>
                   <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-50 text-gray-600">
                     {job.startDate} — {job.current ? 'Present' : job.endDate}
                   </span>
                </div>
                <div className="text-[11px] font-medium mb-1" style={{ color: meta.accentColor }}>{job.company}</div>
                <p className="text-[11px] text-gray-600 whitespace-pre-line text-justify leading-snug">{job.description}</p>
              </div>
            ))}
          </div>
        </section>

        {data.projects.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-3 text-gray-800 border-b border-gray-100 pb-1" style={{ pageBreakAfter: 'avoid' }}>Projects</h2>
            <div className="grid grid-cols-1 gap-3">
              {data.projects.map(project => (
                <div key={project.id} className="border-l-4 pl-3 break-inside-avoid" style={{ borderColor: meta.accentColor, pageBreakInside: 'avoid' }}>
                  <div className="flex justify-between items-center mb-0.5">
                    <h3 className="font-bold text-xs text-gray-900">{project.name}</h3>
                    {project.link && (
                      <a href={project.link.startsWith('http') ? project.link : `https://${project.link}`} target="_blank" rel="noopener noreferrer" className="text-[10px] flex items-center hover:underline text-gray-500">
                         <IconLink className="w-2.5 h-2.5 mr-1" /> Link
                      </a>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-600 text-justify leading-snug">{project.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

// --- Template: CREATIVE (Compact) ---
export const TemplateCreative: React.FC<TemplateProps> = ({ data }) => {
  const { personal, meta } = data;
  
  return (
    <div className={`h-full p-6 bg-white relative overflow-hidden ${meta.fontFamily}`}>
       {/* Decorative Circles */}
       <div className="absolute top-0 right-0 w-56 h-56 rounded-full -mr-20 -mt-20 opacity-10" style={{ backgroundColor: meta.accentColor }}></div>
       <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full -ml-10 -mb-10 opacity-5" style={{ backgroundColor: meta.accentColor }}></div>

       <header className="relative z-10 text-center mb-6">
         <h1 className="text-3xl font-bold mb-1 text-gray-800">{personal.fullName}</h1>
         <p className="text-xs font-medium tracking-widest uppercase mb-2" style={{ color: meta.accentColor }}>{personal.jobTitle}</p>
         <div className="flex justify-center">
            <ContactLine data={data} />
         </div>
       </header>

       <div className="grid grid-cols-2 gap-5 relative z-10">
          <div className="space-y-4">
             <section className="bg-gray-50 p-4 rounded-lg border-l-4" style={{ borderColor: meta.accentColor }}>
               <h3 className="font-bold text-gray-900 mb-1 flex items-center text-xs">
                 <span className="mr-1.5 text-base">⚡</span> Summary
               </h3>
               <p className="text-[11px] text-gray-600 italic leading-snug text-justify">{personal.summary}</p>
             </section>

             <section>
               <h3 className="font-bold text-gray-900 text-xs mb-2 border-b pb-1" style={{ pageBreakAfter: 'avoid' }}>Experience</h3>
               {data.work.map(job => (
                 <div key={job.id} className="mb-3 last:mb-0 break-inside-avoid" style={{ pageBreakInside: 'avoid' }}>
                    <h4 className="font-bold text-xs">{job.position}</h4>
                    <div className="text-[10px] font-medium opacity-80 mb-0.5">{job.company} | {job.startDate} - {job.current ? 'Present' : job.endDate}</div>
                    <p className="text-[11px] text-gray-600 text-justify leading-snug">{job.description}</p>
                 </div>
               ))}
             </section>
             
             {data.projects.length > 0 && (
               <section>
                 <h3 className="font-bold text-gray-900 text-xs mb-2 border-b pb-1" style={{ pageBreakAfter: 'avoid' }}>Projects</h3>
                 {data.projects.map(project => (
                   <div key={project.id} className="mb-3 last:mb-0 break-inside-avoid" style={{ pageBreakInside: 'avoid' }}>
                      <div className="flex items-center justify-between">
                         <h4 className="font-bold text-xs">{project.name}</h4>
                         {project.link && <a href={project.link} target="_blank" className="text-[10px] opacity-60 hover:opacity-100">↗</a>}
                      </div>
                      <p className="text-[11px] text-gray-600 mt-0.5 text-justify leading-snug">{project.description}</p>
                   </div>
                 ))}
               </section>
             )}
          </div>

          <div className="space-y-4">
             <section>
               <h3 className="font-bold text-gray-900 text-xs mb-2 border-b pb-1" style={{ pageBreakAfter: 'avoid' }}>Education</h3>
               {data.education.map(edu => (
                 <div key={edu.id} className="mb-2 bg-gray-50 p-2.5 rounded-lg break-inside-avoid" style={{ pageBreakInside: 'avoid' }}>
                    <h4 className="font-bold text-xs">{edu.school}</h4>
                    <div className="text-[10px]" style={{ color: meta.accentColor }}>{edu.degree}</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">{edu.startDate} - {edu.endDate}</div>
                 </div>
               ))}
             </section>

             {data.certifications?.length > 0 && (
               <section>
                 <h3 className="font-bold text-gray-900 text-xs mb-2 border-b pb-1" style={{ pageBreakAfter: 'avoid' }}>Certifications</h3>
                 {data.certifications.map(cert => (
                   <div key={cert.id} className="mb-2 bg-gray-50 p-2.5 rounded-lg break-inside-avoid" style={{ pageBreakInside: 'avoid' }}>
                      <h4 className="font-bold text-xs">{cert.name}</h4>
                      <div className="text-[10px] opacity-80">{cert.issuer}</div>
                      <div className="flex justify-between items-center mt-0.5">
                         <span className="text-[10px] text-gray-500">{cert.date}</span>
                         {cert.link && <a href={cert.link} target="_blank" className="text-[10px] text-gray-500 hover:text-gray-900">View ↗</a>}
                      </div>
                   </div>
                 ))}
               </section>
             )}

             <section>
               <h3 className="font-bold text-gray-900 text-xs mb-2 border-b pb-1" style={{ pageBreakAfter: 'avoid' }}>Skills</h3>
               <div className="flex flex-wrap gap-1.5">
                 {data.skills.map(skill => (
                   <span key={skill.id} className="px-2 py-0.5 bg-gray-900 text-white rounded-full text-[10px] font-bold shadow-sm flex items-center break-inside-avoid">
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