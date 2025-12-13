import React, { useState, useEffect, useRef } from 'react';
import { EditorPanel } from './components/EditorPanel';
import { TemplateClassic, TemplateModern, TemplateCreative } from './components/ResumeTemplates';
import { INITIAL_DATA } from './constants';
import { ResumeData, COLORS, FONTS, TemplateType } from './types';
import { IconDownload, IconPrinter, IconUpload, IconMoon, IconSun } from './components/Icons';

/* 
  DEVELOPER NOTE:
  1. To change default theme colors: Edit 'COLORS' in 'types.ts'.
  2. Templates are defined in 'components/ResumeTemplates.tsx'. Add new ones there.
  3. To add a new section: Update 'ResumeData' interface, add to 'INITIAL_DATA', and add a renderer in templates.
*/

declare global {
  interface Window {
    html2pdf: any;
  }
}

const PageBreaks = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-50 overflow-hidden print:hidden">
       {/* Visual dashes every 297mm to indicate page breaks */}
       <div 
         className="w-full h-full opacity-50"
         style={{
           // A4 Height is 297mm. We draw a red line at 296.5mm to act as a margin warning.
           background: 'linear-gradient(to bottom, transparent 296.5mm, dashed 1px #ef4444 296.5mm, transparent 297mm)',
           backgroundSize: '100% 297mm'
         }}
       />
    </div>
  )
}

const App = () => {
  const [data, setData] = useState<ResumeData>(INITIAL_DATA);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  // Load from local storage
  useEffect(() => {
    const savedData = localStorage.getItem('resume_data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        
        // MIGRATION LOGIC: Deep merge to ensure new fields (like certifications) exist in old data
        const mergedData = {
          ...INITIAL_DATA,
          ...parsed,
          personal: { ...INITIAL_DATA.personal, ...parsed.personal },
          // Ensure arrays exist. If parsed value is undefined, use empty array (or initial data)
          work: parsed.work || [],
          education: parsed.education || [],
          skills: parsed.skills || [],
          projects: parsed.projects || [],
          certifications: parsed.certifications || [], 
          meta: {
            ...INITIAL_DATA.meta,
            ...parsed.meta,
             // Ensure sectionOrder includes 'certifications' if it was missing in old data
            sectionOrder: parsed.meta?.sectionOrder 
              ? (parsed.meta.sectionOrder.includes('certifications') ? parsed.meta.sectionOrder : [...parsed.meta.sectionOrder, 'certifications'])
              : INITIAL_DATA.meta.sectionOrder
          }
        };

        setData(mergedData);
      } catch (e) {
        console.error("Failed to load save data", e);
      }
    }
    const savedTheme = localStorage.getItem('theme');
    // Default to light mode (only set dark if explicitly saved as 'dark')
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    }
    
    // Onboarding tooltip
    if (localStorage.getItem('onboarding_seen')) {
      setShowTooltip(false);
    }
  }, []);

  // Save to local storage & Body Class for Dark Mode
  useEffect(() => {
    localStorage.setItem('resume_data', JSON.stringify(data));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [data, isDarkMode]);

  const handleDownloadPDF = async () => {
    if (!data.personal.fullName) {
      alert("Please enter your name before exporting.");
      return;
    }

    setIsExporting(true);
    
    const element = document.getElementById('resume-preview');
    if (!element) return;

    // Store original styles to restore later
    const originalTransform = element.style.transform;
    const originalWidth = element.style.width;
    const originalMinHeight = element.style.minHeight;
    const originalBoxShadow = element.style.boxShadow;
    const originalMargin = element.style.margin;

    // Force exact A4 dimensions for capture
    // We remove the scale transform so html2canvas sees the full resolution
    element.style.transform = 'none';
    element.style.width = '210mm';
    // Slightly less than 297mm to prevent a second blank page due to sub-pixel rendering
    element.style.minHeight = '296.8mm'; 
    element.style.boxShadow = 'none';
    element.style.margin = '0';

    // Configuration for html2pdf
    const opt = {
      margin: 0,
      filename: `${data.personal.fullName.replace(/\s+/g, '_')}_Resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      // scrollY: 0 is crucial to prevent capturing scrolled content offset
      html2canvas: { scale: 2, useCORS: true, logging: false, scrollY: 0 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      // Use the html2pdf library loaded from CDN
      if (window.html2pdf) {
        await window.html2pdf().set(opt).from(element).save();
      } else {
        // Fallback to print if library fails to load
        alert("PDF generator loading... Falling back to browser print.");
        window.print();
      }
    } catch (err) {
      console.error("PDF Export failed", err);
      alert("PDF Export failed. Please try printing to PDF instead.");
    } finally {
      // Restore original styles
      element.style.transform = originalTransform;
      element.style.width = originalWidth;
      element.style.minHeight = originalMinHeight;
      element.style.boxShadow = originalBoxShadow;
      element.style.margin = originalMargin;
      setIsExporting(false);
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "resume.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        // Basic schema validation could go here
        if (json.personal && json.work) {
            setData(json);
        } else {
            alert("Invalid JSON file format.");
        }
      } catch (err) {
        alert("Error reading file");
      }
    };
    reader.readAsText(file);
  };

  const dismissTooltip = () => {
    setShowTooltip(false);
    localStorage.setItem('onboarding_seen', 'true');
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden print:h-auto print:overflow-visible">
      {/* HEADER */}
      <header className="flex-none h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 flex items-center justify-between z-20 print:hidden">
        <div className="flex items-center gap-3">
          <svg className="w-8 h-8 text-brand-600 animate-draw" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <span className="text-xl font-bold text-brand-600">
            Free Resume Builder
          </span>
        </div>

        <div className="flex items-center gap-3">
           {/* Theme Toggles */}
           <div className="flex items-center gap-2 mr-4 border-r border-gray-200 dark:border-gray-700 pr-4">
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)} 
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
                aria-label="Toggle Dark Mode"
              >
                {isDarkMode ? <IconSun /> : <IconMoon />}
              </button>
           </div>

           <label className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer transition-colors">
              <IconUpload className="w-4 h-4" />
              <span className="hidden sm:inline">Import</span>
              <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
           </label>
           
           <button onClick={handleExportJSON} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <IconDownload className="w-4 h-4" />
              <span className="hidden sm:inline">Save JSON</span>
           </button>

           <button 
             onClick={handleDownloadPDF} 
             disabled={isExporting}
             className={`flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all transform ${isExporting ? 'opacity-70 cursor-wait' : ''}`}
           >
              {isExporting ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <IconPrinter className="w-4 h-4" />
              )}
              <span>{isExporting ? 'Generating...' : 'Download PDF'}</span>
           </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex overflow-hidden print:h-auto print:overflow-visible print:block">
        
        {/* LEFT PANEL: EDITOR */}
        <div className="w-full md:w-[450px] lg:w-[500px] flex-none bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col print:hidden z-10">
           {/* Visual Settings Toolbar */}
           <div className="p-4 border-b border-gray-200 dark:border-gray-800 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Template</label>
                <div className="flex gap-2">
                  {(['classic', 'modern', 'creative'] as TemplateType[]).map(t => (
                    <button 
                      key={t}
                      onClick={() => setData({...data, meta: {...data.meta, template: t}})}
                      className={`w-8 h-8 rounded border-2 transition-all ${data.meta.template === t ? 'border-brand-500 bg-brand-50' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}
                      title={t}
                    >
                      <div className={`w-full h-full transform scale-50 ${t === 'classic' ? 'bg-gray-400' : t === 'modern' ? 'bg-blue-400' : 'bg-purple-400 rounded-full'}`}></div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Accent Color</label>
                <div className="flex gap-2 flex-wrap">
                  {COLORS.map(c => (
                     <button
                       key={c.name}
                       onClick={() => setData({...data, meta: {...data.meta, accentColor: c.value}})}
                       className={`w-6 h-6 rounded-full transition-transform hover:scale-110 ${data.meta.accentColor === c.value ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-gray-900' : ''}`}
                       style={{ backgroundColor: c.value }}
                       title={c.name}
                     />
                  ))}
                </div>
              </div>
              <div className="col-span-2">
                 <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Typography</label>
                 <select 
                    value={data.meta.fontFamily}
                    onChange={(e) => setData({...data, meta: {...data.meta, fontFamily: e.target.value}})}
                    className="w-full text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-2"
                 >
                    {FONTS.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
                 </select>
              </div>
           </div>

           {/* Form Editor */}
           <div className="flex-1 overflow-hidden p-4">
              <EditorPanel data={data} onChange={setData} />
           </div>
        </div>

        {/* RIGHT PANEL: PREVIEW */}
        <div className="flex-1 bg-gray-100 dark:bg-black/50 overflow-y-auto p-8 md:p-12 flex justify-center custom-scrollbar print:p-0 print:overflow-visible print:bg-white print:block print:w-full print:h-auto">
           <div 
             id="resume-preview" 
             className="relative bg-white shadow-2xl print:shadow-none w-[210mm] min-h-[296.5mm] h-fit transition-all duration-500 ease-in-out transform origin-top print:w-full print:h-auto print:scale-100 print:transform-none"
             style={{ 
               transform: 'scale(var(--preview-scale, 1))' 
             }}
           >
              <PageBreaks />
              {data.meta.template === 'classic' && <TemplateClassic data={data} />}
              {data.meta.template === 'modern' && <TemplateModern data={data} />}
              {data.meta.template === 'creative' && <TemplateCreative data={data} />}
           </div>
        </div>
      </main>

      {/* Tooltip Overlay */}
      {showTooltip && (
        <div className="fixed bottom-6 right-6 max-w-sm bg-brand-600 text-white p-6 rounded-xl shadow-2xl z-50 animate-fade-in print:hidden">
           <h3 className="font-bold text-lg mb-2">👋 Welcome to Free Resume Builder!</h3>
           <p className="text-sm opacity-90 mb-4">
             Edit your details on the left, and watch your resume update instantly on the right. 
             <br/><br/>
             ✨ <strong>Pro Tip:</strong> Drag and drop sections in the sidebar to reorder them!
           </p>
           <button onClick={dismissTooltip} className="bg-white text-brand-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-100 transition-colors">
             Got it!
           </button>
        </div>
      )}
    </div>
  );
};

export default App;