import { useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Plus, Edit2, Trash2, X, GraduationCap, Award, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ProfileData, EducationEntry } from '../../../types/profile';

const generateId = (prefix: string) => `${prefix}-${Math.random().toString(36).substring(2, 9)}`;

export const StepEducation = () => {
  const { register, watch, setValue, control } = useFormContext<ProfileData>();
  const skillsRaw = watch('skills');
  const skills = Array.isArray(skillsRaw) ? skillsRaw : [];
  
  const { fields, append, update, remove } = useFieldArray({
    control,
    name: 'education',
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  
  const [tempEntry, setTempEntry] = useState<EducationEntry>({
    id: '', degree: '', school: '', year: ''
  });

  const [skillInput, setSkillInput] = useState('');

  const openModal = (index: number | null = null) => {
    if (index !== null) {
      setTempEntry(fields[index]);
      setEditingIndex(index);
    } else {
      setTempEntry({ id: generateId('edu'), degree: '', school: '', year: '' });
      setEditingIndex(null);
    }
    setIsModalOpen(true);
  };

  const saveModal = () => {
    if (!tempEntry.degree || !tempEntry.school) return;
    if (editingIndex !== null) update(editingIndex, tempEntry);
    else append(tempEntry);
    setIsModalOpen(false);
  };

  const handleAddSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ((e.type === 'keydown' && (e as React.KeyboardEvent).key !== 'Enter') || !skillInput.trim()) return;
    e.preventDefault();
    if (!skills.includes(skillInput.trim())) {
      setValue('skills', [...skills, skillInput.trim()], { shouldValidate: true });
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skill: string) => {
    setValue('skills', skills.filter(s => s !== skill), { shouldValidate: true });
  };

  return (
    <div className="space-y-8 pb-8">
      <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
         Education & Skills
      </h2>
      
      {/* 1. Education Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-tight">
            <GraduationCap size={16} className="text-brand-600" />
            Academic Background
          </label>
          {fields.length > 0 && (
            <button type="button" onClick={() => openModal()} className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1">
              <Plus size={14} /> Add Education
            </button>
          )}
        </div>
        
        {fields.length === 0 ? (
          <button 
            type="button" 
            onClick={() => openModal()} 
            className="w-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-2xl bg-white hover:border-brand-300 hover:bg-brand-50/30 transition-all group"
          >
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-brand-100 transition-colors">
              <Plus size={20} className="text-slate-400 group-hover:text-brand-600" />
            </div>
            <p className="text-sm font-bold text-slate-400 group-hover:text-brand-600">Add Degree or Course</p>
          </button>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {fields.map((field, index) => (
              <div key={field.id} className="relative p-5 border border-slate-200 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all group">
                <div className="absolute top-4 right-4 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button type="button" onClick={() => openModal(index)} className="p-2 text-slate-400 hover:bg-brand-50 hover:text-brand-600 rounded-lg transition-colors">
                    <Edit2 size={16} />
                  </button>
                  <button type="button" onClick={() => remove(index)} className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className="pr-16">
                  <h4 className="font-bold text-slate-900">{field.school}</h4>
                  <p className="text-[13px] font-medium text-slate-600 mt-0.5">{field.degree}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      {field.year || 'Year not set'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Skills Section */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
        <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-tight mb-4">
           <Sparkles size={16} className="text-brand-600" />
           Technical Proficiencies
        </label>
        
        <div className="flex space-x-2 mb-4">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={handleAddSkill}
            placeholder="e.g., React, Python, Figma"
            className="flex-1 p-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none bg-white text-sm"
          />
          <button
            type="button"
            onClick={handleAddSkill}
            className="px-6 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-black/10 text-sm"
          >
            Add
          </button>
        </div>
        
        {skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {skills.map(skill => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center space-x-1.5 bg-white text-brand-700 px-3.5 py-1.5 rounded-xl text-[13px] font-bold border border-brand-100 shadow-sm transition-all hover:border-brand-300"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="p-0.5 hover:bg-red-50 hover:text-red-500 rounded-md transition-colors ml-1"
                  >
                    <X size={14} strokeWidth={3} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">No skills listed yet. Start typing above...</p>
        )}
      </div>

      {/* 3. Achievements Section */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
        <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-tight mb-2">
           <Award size={16} className="text-brand-600" />
           Achievements & Awards
        </label>
        <textarea 
          {...register('achievements')} 
          rows={3} 
          className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none bg-white shadow-inner text-sm leading-relaxed" 
          placeholder="Hackathon Winner 2022, Dean's List, etc..." 
        />
      </div>

      {/* Education Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[150] flex justify-center items-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90svh]">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
                <div>
                  <h3 className="font-bold text-xl text-slate-900">{editingIndex !== null ? 'Edit Education' : 'Add Education'}</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Enter your academic background details</p>
                </div>
                <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-colors"><X size={20} /></button>
              </div>
              <div className="p-6 overflow-y-auto space-y-5 custom-scrollbar">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Degree / Certificate *</label>
                  <input value={tempEntry.degree} onChange={e => setTempEntry({ ...tempEntry, degree: e.target.value })} placeholder="B.S. Computer Science" className="w-full p-3.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none bg-slate-50/50" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">School / Institution *</label>
                  <input value={tempEntry.school} onChange={e => setTempEntry({ ...tempEntry, school: e.target.value })} placeholder="University of React" className="w-full p-3.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none bg-slate-50/50" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Year / Dates</label>
                  <input value={tempEntry.year} onChange={e => setTempEntry({ ...tempEntry, year: e.target.value })} placeholder="2016-2020" className="w-full p-3.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none bg-slate-50/50" />
                </div>
              </div>
              <div className="p-6 border-t border-slate-100 flex gap-3 bg-slate-50/80">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-slate-600 font-bold hover:text-slate-900 transition-colors">Cancel</button>
                <button type="button" onClick={saveModal} disabled={!tempEntry.degree || !tempEntry.school} className="flex-[2] py-3 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20 disabled:opacity-40">Save Education</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
