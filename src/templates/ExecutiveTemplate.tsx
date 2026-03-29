import type { ProfileData } from '../types/profile';

export default function ExecutiveTemplate({ data }: { data: ProfileData | null }) {
  if (!data) return null;
  
  return (
    <div className="w-[794px] h-[1123px] bg-white p-14 text-slate-900 font-serif mx-auto text-[13px] leading-relaxed shadow-sm overflow-hidden relative">
      
      {/* Centered Executive Header */}
      <header className="text-center mb-8">
        <h1 className="text-4xl font-normal uppercase tracking-[0.2em] text-slate-900 mb-3">{data?.fullName || 'YOUR NAME'}</h1>
        
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 text-slate-600 text-xs font-sans tracking-wide">
          {data?.email && <span>{data.email}</span>}
          {data?.email && data?.phone && <span>•</span>}
          {data?.phone && <span>{data.phone}</span>}
          {(data?.email || data?.phone) && data?.linkedin && <span>•</span>}
          {data?.linkedin && <span>{data.linkedin}</span>}
          {data?.linkedin && data?.github && <span>•</span>}
          {data?.github && <span>{data.github}</span>}
        </div>
      </header>

      {/* Heavy Divider */}
      <div className="w-full border-b-2 border-slate-900 mb-8" />

      <main className="flex flex-col gap-6 font-sans">
        {/* Executive Summary */}
        {data?.summary && (
          <section>
            <p className="text-slate-800 leading-[1.8] font-medium text-justify">{data.summary}</p>
          </section>
        )}

        {/* Experience */}
        {data?.workExperience && data.workExperience.length > 0 && (
          <section className="mt-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-2">Professional Experience</h2>
            <div className="w-full border-b border-slate-300 mb-4" />
            
            <div className="space-y-6">
              {data.workExperience.map(exp => (
                <div key={exp?.id}>
                  <div className="flex justify-between items-end mb-1">
                    <h3 className="font-bold text-slate-900 text-lg">{exp?.title}</h3>
                    <span className="font-semibold text-slate-500 text-xs">
                      {exp?.dateStr}
                    </span>
                  </div>
                  <div className="font-bold text-slate-600 uppercase tracking-wider text-xs mb-2">
                    {exp?.company}
                  </div>
                  <p className="text-slate-700 leading-relaxed font-medium pl-4 border-l-2 border-slate-200 whitespace-pre-line">
                    {exp?.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data?.education && data.education.length > 0 && (
          <section className="mt-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-2">Education</h2>
            <div className="w-full border-b border-slate-300 mb-4" />
            
            <div className="space-y-4">
              {data.education.map(edu => (
                <div key={edu?.id} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-900">{edu?.degree}</h3>
                    <div className="text-slate-600 text-sm">{edu?.school}</div>
                  </div>
                  <span className="font-semibold text-slate-500 text-xs">{edu?.year}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {data?.skills && data.skills.length > 0 && (
          <section className="mt-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-2">Core Competencies</h2>
            <div className="w-full border-b border-slate-300 mb-4" />
            
            <div className="flex flex-wrap gap-x-2 gap-y-1">
              {data.skills.map((s, i) => (
                <span key={i} className="text-slate-700 font-medium after:content-['•'] after:ml-2 last:after:content-none last:after:ml-0">
                  {s}
                </span>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
