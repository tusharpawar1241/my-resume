import type { ProfileData } from '../types/profile';
import { Mail, Phone, Link, Code } from 'lucide-react';

export default function ClassicTemplate({ data }: { data: ProfileData | null }) {
  if (!data) return null;
  
  return (
    <div className="w-[794px] min-h-[1123px] bg-white p-16 text-slate-900 font-serif mx-auto text-[12px] leading-relaxed shadow-sm overflow-hidden relative">
      
      {/* Header / Identity (Centered Harvard Style) */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-slate-900 uppercase">
          {data?.fullName || 'YOUR NAME'}
        </h1>
        
        <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-slate-600 font-medium text-[11px] uppercase tracking-wide">
          {data?.email && (
            <span className="flex items-center gap-1.5 underline decoration-slate-300 underline-offset-2">
              <Mail size={10} />{data.email}
            </span>
          )}
          {data?.phone && (
            <span className="flex items-center gap-1.5 focus-within:">
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              <Phone size={10} />{data.phone}
            </span>
          )}
          {data?.linkedin && (
            <span className="flex items-center gap-1.5">
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              <Link size={10} />{data.linkedin.replace(/^https?:\/\//, '')}
            </span>
          )}
          {data?.github && (
            <span className="flex items-center gap-1.5">
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              <Code size={10} />{data.github.replace(/^https?:\/\//, '')}
            </span>
          )}
        </div>
      </div>

      {/* Summary / Profile Section */}
      {data?.summary && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-center border-b-[1.5px] border-slate-900 pb-1.5 mb-4 text-slate-900">
            Professional Summary
          </h2>
          <p className="text-justify text-slate-800 leading-relaxed indent-8 font-medium">
            {data.summary}
          </p>
        </section>
      )}

      {/* Experience Section (Single Column) */}
      {data?.workExperience && data.workExperience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-center border-b-[1.5px] border-slate-900 pb-1.5 mb-5 text-slate-900">
            Professional Experience
          </h2>
          <div className="space-y-6">
            {data.workExperience.map(exp => (
              <div key={exp?.id} className="group">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-[14px] text-slate-900 uppercase tracking-tight">
                    {exp?.company}
                  </h3>
                  <span className="text-slate-700 font-bold italic text-xs">{exp?.dateStr}</span>
                </div>
                <div className="flex justify-between items-center mb-2.5">
                  <div className="text-slate-800 font-bold italic">{exp?.title}</div>
                </div>
                <div className="whitespace-pre-wrap text-slate-700 leading-snug pl-2 border-l border-slate-100">
                  {exp?.description}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects Section */}
      {data?.projects && data.projects.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-center border-b-[1.5px] border-slate-900 pb-1.5 mb-5 text-slate-900">
            Academic & Independent Projects
          </h2>
          <div className="space-y-6">
            {data.projects.map(proj => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-[14px] text-slate-900 tracking-tight">
                    {proj.title}
                  </h3>
                  <span className="text-slate-700 font-bold italic text-xs">{proj.dateStr}</span>
                </div>
                <div className="text-slate-800 italic mb-2.5">{proj.subtitle}</div>
                <div className="whitespace-pre-wrap text-slate-700 leading-snug pl-2 border-l border-slate-100">
                  {proj.description}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education Section (Single Column Harvard Style) */}
      {data?.education && data.education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-center border-b-[1.5px] border-slate-900 pb-1.5 mb-5 text-slate-900">
            Education
          </h2>
          <div className="space-y-5">
            {data.education.map(edu => (
              <div key={edu?.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-[14px] text-slate-900 uppercase tracking-tight">
                    {edu?.school}
                  </h3>
                  <span className="text-slate-700 font-bold italic text-xs">{edu?.year}</span>
                </div>
                <div className="text-slate-800 font-bold italic">{edu?.degree}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills & Certifications Section (Single Column Center Alignment) */}
      {data?.skills && data.skills.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-center border-b-[1.5px] border-slate-900 pb-1.5 mb-4 text-slate-900">
            Technical Skills & Certifications
          </h2>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-slate-800 font-bold italic">
            {data.skills.map(skill => (
              <span key={skill} className="flex items-center gap-2">
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Achievements Section */}
      {data?.achievements && (
        <section>
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-center border-b-[1.5px] border-slate-900 pb-1.5 mb-4 text-slate-900">
            Additional Honors & Awards
          </h2>
          <div className="whitespace-pre-wrap text-slate-800 text-center italic">
            {data.achievements}
          </div>
        </section>
      )}
      
    </div>
  );
}
