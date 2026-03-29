import type { ProfileData } from '../types/profile';
import { Mail, Phone, Link, Code } from 'lucide-react';

export default function ModernTemplate({ data }: { data: ProfileData | null }) {
  if (!data) return null;
  
  return (
    <div className="w-[794px] min-h-[1123px] flex font-sans mx-auto text-[13px] leading-relaxed shadow-sm bg-white overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-[33%] bg-slate-50 p-8 text-slate-800 flex flex-col gap-8 border-r border-slate-100">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-1">
            {data?.fullName || 'YOUR NAME'}
          </h1>
          <div className="w-12 h-1 bg-brand-500 mt-5 mb-2"></div>
        </div>

        <div>
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Contact</h2>
          <div className="flex flex-col gap-3 text-xs font-medium text-slate-600">
            {data?.email && <span className="flex items-center gap-2 hover:text-brand-600 transition-colors"><Mail size={14} className="text-slate-400 shrink-0"/> <span className="truncate">{data.email}</span></span>}
            {data?.phone && <span className="flex items-center gap-2 hover:text-brand-600 transition-colors"><Phone size={14} className="text-slate-400 shrink-0"/> <span className="truncate">{data.phone}</span></span>}
            {data?.linkedin && <span className="flex items-center gap-2 hover:text-brand-600 transition-colors"><Link size={14} className="text-slate-400 shrink-0"/> <span className="truncate">{data.linkedin}</span></span>}
            {data?.github && <span className="flex items-center gap-2 hover:text-brand-600 transition-colors"><Code size={14} className="text-slate-400 shrink-0"/> <span className="truncate">{data.github}</span></span>}
          </div>
        </div>

        {data?.skills && data.skills.length > 0 && (
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Core Skills</h2>
            <div className="flex flex-col gap-2 text-slate-700 font-medium">
              {data.skills.map((s, i) => (
                <div key={i} className="w-full bg-white border border-slate-200 px-3 py-1.5 rounded-md text-xs shadow-sm">
                  {s}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Content */}
      <div className="w-[67%] bg-white p-8 pl-10 flex flex-col gap-8">
        {data?.summary && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 flex items-center gap-3 mb-3">
              <span className="w-2 h-2 bg-brand-500 rounded-sm"></span> Profile
            </h2>
            <p className="text-slate-600 leading-relaxed font-medium">{data.summary}</p>
          </section>
        )}

        {data?.workExperience && data.workExperience.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 flex items-center gap-3 mb-5">
              <span className="w-2 h-2 bg-brand-500 rounded-sm"></span> Experience
            </h2>
            <div className="space-y-6">
              {data.workExperience.map(exp => (
                <div key={exp?.id} className="relative">
                  <h3 className="font-bold text-slate-900 text-[14px] leading-tight mb-1">{exp?.title}</h3>
                  <div className="flex items-center text-slate-500 text-xs font-semibold mb-2">
                    <span className="text-brand-600 uppercase tracking-wide">{exp?.company}</span>
                    <span className="mx-2 text-slate-300">|</span>
                    <span>{exp?.dateStr}</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-line">{exp?.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {data?.education && data.education.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 flex items-center gap-3 mb-5">
              <span className="w-2 h-2 bg-brand-500 rounded-sm"></span> Education
            </h2>
            <div className="space-y-5">
              {data.education.map(edu => (
                <div key={edu?.id} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-900 text-[14px]">{edu?.degree}</h3>
                    <div className="text-slate-500 text-xs font-semibold mt-1 uppercase tracking-wide">
                      {edu?.school}
                    </div>
                  </div>
                  <span className="bg-slate-50 text-slate-500 px-2 py-1 rounded text-xs font-bold border border-slate-100">
                    {edu?.year}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
