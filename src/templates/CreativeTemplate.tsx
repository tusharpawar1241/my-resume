import type { ProfileData } from '../types/profile';
import { Mail, Phone, Link, Code } from 'lucide-react';

export default function CreativeTemplate({ data }: { data: ProfileData | null }) {
  if (!data) return null;
  
  return (
    <div className="w-[794px] min-h-[1123px] bg-white text-slate-800 font-sans mx-auto text-[13px] leading-relaxed shadow-sm relative overflow-hidden">
      
      {/* Top Banner accent */}
      <div className="absolute top-0 left-0 w-full h-4 bg-purple-600" />

      <div className="p-12 pb-8 flex flex-col items-center border-b border-slate-100">
        <h1 className="text-4xl font-extrabold tracking-tighter text-slate-900 mb-2 mt-4 text-center">
          {data?.fullName || 'YOUR NAME'}
        </h1>
        
        <div className="flex flex-wrap justify-center gap-4 text-slate-500 font-medium text-xs bg-slate-50 px-6 py-2 rounded-full border border-slate-200 mt-2">
          {data?.email && <span className="flex items-center gap-1"><Mail size={12} className="text-purple-500"/>{data.email}</span>}
          {data?.phone && <span className="flex items-center gap-1"><Phone size={12} className="text-purple-500"/>{data.phone}</span>}
          {data?.linkedin && <span className="flex items-center gap-1"><Link size={12} className="text-purple-500"/>{data.linkedin}</span>}
          {data?.github && <span className="flex items-center gap-1"><Code size={12} className="text-purple-500"/>{data.github}</span>}
        </div>
      </div>

      <div className="flex p-10 gap-10">
        
        {/* Main Column */}
        <div className="flex-[2]">
          {data?.summary && (
            <section className="mb-8">
              <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="text-purple-600">/</span> Profile
              </h2>
              <p className="text-slate-600 font-medium leading-[1.8] bg-purple-50/50 p-4 rounded-xl border border-purple-100/50">
                {data.summary}
              </p>
            </section>
          )}

          {data?.workExperience && data.workExperience.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
                <span className="text-purple-600">/</span> Experience
              </h2>
              <div className="space-y-6">
                {data.workExperience.map((exp, i) => (
                  <div key={exp?.id} className="relative">
                    {/* timeline line */}
                    {i !== data.workExperience.length - 1 && (
                      <div className="absolute left-[3px] top-6 bottom-[-20px] w-0.5 bg-slate-100" />
                    )}
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 mt-2 rounded-full bg-purple-500 shrink-0 relative z-10 shadow-[0_0_0_4px_white]" />
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 text-[15px]">{exp?.title}</h3>
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-2">
                          <span className="text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">{exp?.company}</span>
                          <span>{exp?.dateStr}</span>
                        </div>
                        <p className="text-slate-600 font-medium whitespace-pre-line">{exp?.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Side Column */}
        <div className="flex-1 flex flex-col gap-8">
          {data?.skills && data.skills.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="text-purple-600">/</span> Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((s, i) => (
                  <span key={i} className="bg-purple-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm shadow-purple-500/20">
                    {s}
                  </span>
                ))}
              </div>
            </section>
          )}

          {data?.education && data.education.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="text-purple-600">/</span> Education
              </h2>
              <div className="space-y-5">
                {data.education.map(edu => (
                  <div key={edu?.id} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <h3 className="font-bold text-slate-900">{edu?.degree}</h3>
                    <div className="text-slate-500 text-xs font-medium mt-1">{edu?.school}</div>
                    <div className="text-purple-600 text-xs font-bold mt-2">{edu?.year}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

      </div>
    </div>
  );
}
