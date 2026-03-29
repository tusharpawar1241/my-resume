import type { ProfileData } from '../types/profile';
import { Mail, Phone, Link, Code } from 'lucide-react';

export default function ClassicTemplate({ data }: { data: ProfileData | null }) {
  if (!data) return null;
  
  return (
    <div className="w-[794px] min-h-[1123px] bg-white p-12 text-slate-900 font-sans mx-auto text-[13px] leading-relaxed shadow-sm">
      {/* Name and Contact */}
      <div className="border-b-2 border-slate-900 pb-4 mb-6">
        <h1 className="text-3xl font-bold uppercase tracking-widest mb-2 text-slate-900">{data?.fullName || 'YOUR NAME'}</h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-600 font-medium text-xs">
          {data?.email && <span className="flex items-center gap-1"><Mail size={12} />{data.email}</span>}
          {data?.phone && <span className="flex items-center gap-1"><Phone size={12} />{data.phone}</span>}
          {data?.linkedin && <span className="flex items-center gap-1"><Link size={12} />{data.linkedin}</span>}
          {data?.github && <span className="flex items-center gap-1"><Code size={12} />{data.github}</span>}
        </div>
      </div>

      {/* Summary */}
      {data?.summary && (
        <div className="mb-6">
          <h2 className="text-base font-bold uppercase tracking-widest border-b border-slate-300 pb-1 mb-3 text-slate-900">Summary</h2>
          <p className="whitespace-pre-wrap">{data.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data?.workExperience && data.workExperience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold uppercase tracking-widest border-b border-slate-300 pb-1 mb-3 text-slate-900">Experience</h2>
          <div className="space-y-4">
            {data.workExperience.map(exp => (
              <div key={exp?.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-[14px]">{exp?.title}</h3>
                  <span className="text-slate-600 font-medium">{exp?.dateStr}</span>
                </div>
                <div className="text-slate-700 italic mb-2">{exp?.company}</div>
                <div className="whitespace-pre-wrap pl-4 border-l-2 border-slate-200 text-slate-700">{exp?.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {data?.projects && (
        <div className="mb-6">
          <h2 className="text-base font-bold uppercase tracking-widest border-b border-slate-300 pb-1 mb-3 text-slate-900">Projects</h2>
          <div className="whitespace-pre-wrap">{data.projects}</div>
        </div>
      )}

      {/* Education & Skills */}
      <div className="grid grid-cols-2 gap-8">
        {data?.education && data.education.length > 0 && (
          <div>
            <h2 className="text-base font-bold uppercase tracking-widest border-b border-slate-300 pb-1 mb-3 text-slate-900">Education</h2>
            <div className="space-y-3">
              {data.education.map(edu => (
                <div key={edu?.id}>
                  <div className="font-bold">{edu?.degree}</div>
                  <div className="text-slate-700">{edu?.school}</div>
                  <div className="text-slate-500 text-xs">{edu?.year}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {data?.skills && data.skills.length > 0 && (
          <div>
            <h2 className="text-base font-bold uppercase tracking-widest border-b border-slate-300 pb-1 mb-3 text-slate-900">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map(skill => (
                <span key={skill} className="bg-slate-100 text-slate-800 px-2 py-1 rounded text-xs font-semibold">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Achievements */}
      {data?.achievements && (
        <div className="mt-6">
          <h2 className="text-base font-bold uppercase tracking-widest border-b border-slate-300 pb-1 mb-3 text-slate-900">Achievements</h2>
          <div className="whitespace-pre-wrap">{data.achievements}</div>
        </div>
      )}
    </div>
  );
}
