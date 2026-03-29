import { useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ProfileData, EducationEntry } from '../../../types/profile';

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
      setTempEntry({ id: Date.now().toString(), degree: '', school: '', year: '' });
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
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-900">Education & Skills</h2>
      
      {/* Education Section */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-medium text-slate-700">Education</label>
        </div>
        
        {fields.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <p className="text-sm font-medium text-slate-500 mb-3">No education added yet.</p>
            <button type="button" onClick={() => openModal()} className="flex items-center text-sm text-brand-700 bg-white border border-brand-200 shadow-sm px-4 py-2 rounded-lg hover:bg-brand-50 font-semibold transition-all">
              <Plus size={16} className="mr-1.5" /> Add Education
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="relative p-4 border border-slate-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow group">
                <div className="absolute top-3 right-3 flex items-center space-x-1">
                  <button type="button" onClick={() => openModal(index)} className="p-1.5 text-slate-400 hover:bg-brand-50 hover:text-brand-600 rounded-md transition-colors">
                    <Edit2 size={16} />
                  </button>
                  <button type="button" onClick={() => remove(index)} className="p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-md transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <h4 className="font-bold text-slate-900 leading-tight pr-16">{field.school}</h4>
                <p className="text-sm text-slate-600 mt-0.5">{field.degree}</p>
                <p className="text-xs font-medium text-slate-400 mt-2">{field.year}</p>
              </div>
            ))}
            
            <button type="button" onClick={() => openModal()} className="w-full flex justify-center items-center text-sm text-brand-600 bg-brand-50 hover:bg-brand-100 py-3 rounded-xl font-semibold transition-colors mt-2">
              <Plus size={16} className="mr-1.5" /> Add Another Education
            </button>
          </div>
        )}
      </div>

      {/* Skills Section */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Skills</label>
        <div className="flex space-x-2 mb-3">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={handleAddSkill}
            placeholder="e.g., React, Python"
            className="flex-1 p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-sm"
          />
          <button
            type="button"
            onClick={handleAddSkill}
            className="px-4 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-900 transition-colors"
          >
            Add
          </button>
        </div>
        
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {skills.map(skill => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center space-x-1 bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full text-sm font-medium border border-purple-200"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="p-0.5 hover:bg-purple-200 rounded-full text-purple-600 transition-colors ml-1"
                  >
                    <X size={14} strokeWidth={3} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Achievements (Optional)</label>
        <textarea {...register('achievements')} rows={3} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Hackathon Winner 2022..." />
      </div>

      {/* Education Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[70] flex justify-center items-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90svh]">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-slate-900">{editingIndex !== null ? 'Edit Education' : 'Add Education'}</h3>
                <button type="button" onClick={() => setIsModalOpen(false)} className="p-1.5 bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 transition-colors"><X size={18} /></button>
              </div>
              <div className="p-5 overflow-y-auto space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Degree / Certificate *</label>
                  <input value={tempEntry.degree} onChange={e => setTempEntry({ ...tempEntry, degree: e.target.value })} placeholder="B.S. Computer Science" className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none bg-slate-50/50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">School / Institution *</label>
                  <input value={tempEntry.school} onChange={e => setTempEntry({ ...tempEntry, school: e.target.value })} placeholder="University of React" className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none bg-slate-50/50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Year / Dates</label>
                  <input value={tempEntry.year} onChange={e => setTempEntry({ ...tempEntry, year: e.target.value })} placeholder="2016-2020" className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none bg-slate-50/50" />
                </div>
              </div>
              <div className="p-4 border-t border-slate-100 flex gap-3 bg-white">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors">Cancel</button>
                <button type="button" onClick={saveModal} disabled={!tempEntry.degree || !tempEntry.school} className="flex-1 py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-colors disabled:opacity-50">Save</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
