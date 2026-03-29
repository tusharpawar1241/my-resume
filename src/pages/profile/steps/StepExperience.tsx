import { useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Plus, Edit2, Trash2, X, Briefcase, Rocket } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ProfileData, ExperienceEntry, ProjectEntry } from '../../../types/profile';
import EnhanceButton from '../../../components/ai/EnhanceButton';

const generateId = (prefix: string) => `${prefix}-${Math.random().toString(36).substring(2, 9)}`;

export const StepExperience = () => {
  const { register, watch, setValue, control, formState: { errors } } = useFormContext<ProfileData>();
  const summaryText = watch('summary');

  // Work Experience Field Array
  const { fields: expFields, append: appendExp, update: updateExp, remove: removeExp } = useFieldArray({
    control,
    name: 'workExperience',
  });

  // Projects Field Array
  const { fields: projFields, append: appendProj, update: updateProj, remove: removeProj } = useFieldArray({
    control,
    name: 'projects',
  });

  // Modal State for Experience
  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [editingExpIndex, setEditingExpIndex] = useState<number | null>(null);
  const [tempExp, setTempExp] = useState<ExperienceEntry>({
    id: '', title: '', company: '', dateStr: '', description: ''
  });

  // Modal State for Projects
  const [isProjModalOpen, setIsProjModalOpen] = useState(false);
  const [editingProjIndex, setEditingProjIndex] = useState<number | null>(null);
  const [tempProj, setTempProj] = useState<ProjectEntry>({
    id: '', title: '', subtitle: '', dateStr: '', description: ''
  });

  // Experience Modal Helpers
  const openExpModal = (index: number | null = null) => {
    if (index !== null) {
      setTempExp(expFields[index]);
      setEditingExpIndex(index);
    } else {
      setTempExp({ id: generateId('exp'), title: '', company: '', dateStr: '', description: '' });
      setEditingExpIndex(null);
    }
    setIsExpModalOpen(true);
  };

  const saveExpModal = () => {
    if (!tempExp.title || !tempExp.company) return;
    if (editingExpIndex !== null) updateExp(editingExpIndex, tempExp);
    else appendExp(tempExp);
    setIsExpModalOpen(false);
  };

  // Project Modal Helpers
  const openProjModal = (index: number | null = null) => {
    if (index !== null) {
      setTempProj(projFields[index]);
      setEditingProjIndex(index);
    } else {
      setTempProj({ id: generateId('proj'), title: '', subtitle: '', dateStr: '', description: '' });
      setEditingProjIndex(null);
    }
    setIsProjModalOpen(true);
  };

  const saveProjModal = () => {
    if (!tempProj.title || !tempProj.subtitle) return;
    if (editingProjIndex !== null) updateProj(editingProjIndex, tempProj);
    else appendProj(tempProj);
    setIsProjModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-8">
      <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
         Experience & Projects
      </h2>
      
      {/* 1. Summary Section */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
        <div className="flex justify-between items-end mb-2">
          <label className="block text-sm font-bold text-slate-700 uppercase tracking-tight">Career Summary *</label>
          <EnhanceButton 
            text={summaryText} 
            context="Career Summary" 
            onEnhanced={(val) => setValue('summary', val, { shouldValidate: true })} 
          />
        </div>
        <textarea 
          {...register('summary', { required: 'Summary is required' })} 
          rows={4} 
          className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none bg-white shadow-inner text-sm leading-relaxed" 
          placeholder="A passionate software engineer with..." 
        />
        {errors.summary && <span className="text-xs text-red-500 mt-1 block font-medium">{errors.summary.message}</span>}
      </div>

      {/* 2. Work Experience List */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-tight">
            <Briefcase size={16} className="text-brand-600" />
            Work Experience
          </label>
          {expFields.length > 0 && (
            <button type="button" onClick={() => openExpModal()} className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1">
              <Plus size={14} /> Add Job
            </button>
          )}
        </div>
        
        {expFields.length === 0 ? (
          <button 
            type="button" 
            onClick={() => openExpModal()} 
            className="w-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-2xl bg-white hover:border-brand-300 hover:bg-brand-50/30 transition-all group"
          >
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-brand-100 transition-colors">
              <Plus size={20} className="text-slate-400 group-hover:text-brand-600" />
            </div>
            <p className="text-sm font-bold text-slate-400 group-hover:text-brand-600">Add Professional Experience</p>
          </button>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {expFields.map((field, index) => (
              <div key={field.id} className="relative p-5 border border-slate-200 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all group">
                <div className="absolute top-4 right-4 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button type="button" onClick={() => openExpModal(index)} className="p-2 text-slate-400 hover:bg-brand-50 hover:text-brand-600 rounded-lg transition-colors">
                    <Edit2 size={16} />
                  </button>
                  <button type="button" onClick={() => removeExp(index)} className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className="pr-16">
                  <h4 className="font-bold text-slate-900">{field.company}</h4>
                  <p className="text-[13px] font-medium text-slate-600 mt-0.5">{field.title}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      {field.dateStr || 'Date not set'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Projects List */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-tight">
            <Rocket size={16} className="text-brand-600" />
            Featured Projects
          </label>
          {projFields.length > 0 && (
            <button type="button" onClick={() => openProjModal()} className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1">
              <Plus size={14} /> Add Project
            </button>
          )}
        </div>
        
        {projFields.length === 0 ? (
          <button 
            type="button" 
            onClick={() => openProjModal()} 
            className="w-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-2xl bg-white hover:border-brand-300 hover:bg-brand-50/30 transition-all group"
          >
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-brand-100 transition-colors">
              <Plus size={20} className="text-slate-400 group-hover:text-brand-600" />
            </div>
            <p className="text-sm font-bold text-slate-400 group-hover:text-brand-600">Add Project (Portfolio)</p>
          </button>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {projFields.map((field, index) => (
              <div key={field.id} className="relative p-5 border border-slate-200 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all group">
                <div className="absolute top-4 right-4 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button type="button" onClick={() => openProjModal(index)} className="p-2 text-slate-400 hover:bg-brand-50 hover:text-brand-600 rounded-lg transition-colors">
                    <Edit2 size={16} />
                  </button>
                  <button type="button" onClick={() => removeProj(index)} className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className="pr-16">
                  <h4 className="font-bold text-slate-900">{field.title}</h4>
                  <p className="text-[13px] font-medium text-brand-600 mt-0.5">{field.subtitle}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      {field.dateStr || 'Year not set'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* EXPERIENCE MODAL */}
      <AnimatePresence>
        {isExpModalOpen && (
          <div className="fixed inset-0 z-[150] flex justify-center items-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsExpModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90svh]">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
                <div>
                  <h3 className="font-bold text-xl text-slate-900">{editingExpIndex !== null ? 'Edit Experience' : 'Add Experience'}</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Enter your professional role details</p>
                </div>
                <button type="button" onClick={() => setIsExpModalOpen(false)} className="p-2 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-colors"><X size={20} /></button>
              </div>
              <div className="p-6 overflow-y-auto space-y-5 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Job Title *</label>
                    <input value={tempExp.title} onChange={e => setTempExp({ ...tempExp, title: e.target.value })} placeholder="Software Engineer" className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none bg-slate-50/50" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Company *</label>
                    <input value={tempExp.company} onChange={e => setTempExp({ ...tempExp, company: e.target.value })} placeholder="Acme Corp" className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none bg-slate-50/50" />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Dates</label>
                  <input value={tempExp.dateStr} onChange={e => setTempExp({ ...tempExp, dateStr: e.target.value })} placeholder="Jan 2020 - Present" className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none bg-slate-50/50" />
                </div>
                <div>
                  <div className="flex justify-between items-end mb-1.5">
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Description</label>
                    <EnhanceButton text={tempExp.description} context="Work Experience" onEnhanced={(val) => setTempExp({ ...tempExp, description: val })} />
                  </div>
                  <textarea value={tempExp.description} onChange={e => setTempExp({ ...tempExp, description: e.target.value })} rows={5} className="w-full p-4 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none bg-slate-50/50 leading-relaxed" placeholder="- Implemented feature X resulting in Y...&#10;- Led a team of 4..." />
                </div>
              </div>
              <div className="p-6 border-t border-slate-100 flex gap-3 bg-slate-50/80">
                <button type="button" onClick={() => setIsExpModalOpen(false)} className="flex-1 py-3 text-slate-600 font-bold hover:text-slate-900 transition-colors">Cancel</button>
                <button type="button" onClick={saveExpModal} disabled={!tempExp.title || !tempExp.company} className="flex-[2] py-3 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20 disabled:opacity-40">Save Entry</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PROJECT MODAL */}
      <AnimatePresence>
        {isProjModalOpen && (
          <div className="fixed inset-0 z-[150] flex justify-center items-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsProjModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90svh]">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
                <div>
                  <h3 className="font-bold text-xl text-slate-900">{editingProjIndex !== null ? 'Edit Project' : 'Add Project'}</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Highlight your best work and tech stack</p>
                </div>
                <button type="button" onClick={() => setIsProjModalOpen(false)} className="p-2 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-colors"><X size={20} /></button>
              </div>
              <div className="p-6 overflow-y-auto space-y-5 custom-scrollbar">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Project Name *</label>
                  <input value={tempProj.title} onChange={e => setTempProj({ ...tempProj, title: e.target.value })} placeholder="E-Commerce App" className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none bg-slate-50/50" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Tech Stack / Link *</label>
                  <input value={tempProj.subtitle} onChange={e => setTempProj({ ...tempProj, subtitle: e.target.value })} placeholder="React, Node.js, Stripe" className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none bg-slate-50/50" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Year</label>
                  <input value={tempProj.dateStr} onChange={e => setTempProj({ ...tempProj, dateStr: e.target.value })} placeholder="2023" className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none bg-slate-50/50" />
                </div>
                <div>
                  <div className="flex justify-between items-end mb-1.5">
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Description</label>
                    <EnhanceButton text={tempProj.description} context="Portfolio Project" onEnhanced={(val) => setTempProj({ ...tempProj, description: val })} />
                  </div>
                  <textarea value={tempProj.description} onChange={e => setTempProj({ ...tempProj, description: e.target.value })} rows={5} className="w-full p-4 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none bg-slate-50/50 leading-relaxed" placeholder="- Built a full-stack platform...&#10;- Integrated payment gateway..." />
                </div>
              </div>
              <div className="p-6 border-t border-slate-100 flex gap-3 bg-slate-50/80">
                <button type="button" onClick={() => setIsProjModalOpen(false)} className="flex-1 py-3 text-slate-600 font-bold hover:text-slate-900 transition-colors">Cancel</button>
                <button type="button" onClick={saveProjModal} disabled={!tempProj.title || !tempProj.subtitle} className="flex-[2] py-3 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20 disabled:opacity-40">Save Project</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
