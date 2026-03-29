import { useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ProfileData, ExperienceEntry } from '../../../types/profile';
import EnhanceButton from '../../../components/ai/EnhanceButton';

export const StepExperience = () => {
  const { register, watch, setValue, control, formState: { errors } } = useFormContext<ProfileData>();
  const summaryText = watch('summary');
  const { fields, append, update, remove } = useFieldArray({
    control,
    name: 'workExperience',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  
  const [tempEntry, setTempEntry] = useState<ExperienceEntry>({
    id: '', title: '', company: '', dateStr: '', description: ''
  });

  const openModal = (index: number | null = null) => {
    if (index !== null) {
      setTempEntry(fields[index]);
      setEditingIndex(index);
    } else {
      setTempEntry({ id: Date.now().toString(), title: '', company: '', dateStr: '', description: '' });
      setEditingIndex(null);
    }
    setIsModalOpen(true);
  };

  const saveModal = () => {
    if (!tempEntry.title || !tempEntry.company) return;
    if (editingIndex !== null) update(editingIndex, tempEntry);
    else append(tempEntry);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-900">Experience & Summary</h2>
      
      <div>
        <div className="flex justify-between items-end mb-1">
          <label className="block text-sm font-medium text-slate-700">Career Summary *</label>
          <EnhanceButton 
            text={summaryText} 
            context="Career Summary" 
            onEnhanced={(val) => setValue('summary', val, { shouldValidate: true })} 
          />
        </div>
        <textarea {...register('summary', { required: 'Summary is required' })} rows={4} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" placeholder="A passionate software engineer..." />
        {errors.summary && <span className="text-xs text-red-500">{errors.summary.message}</span>}
      </div>

      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-medium text-slate-700">Work Experience</label>
        </div>
        
        {fields.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <p className="text-sm font-medium text-slate-500 mb-3">No experience added yet.</p>
            <button type="button" onClick={() => openModal()} className="flex items-center text-sm text-brand-700 bg-white border border-brand-200 shadow-sm px-4 py-2 rounded-lg hover:bg-brand-50 font-semibold transition-all">
              <Plus size={16} className="mr-1.5" /> Add Job
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
                
                <h4 className="font-bold text-slate-900 leading-tight pr-16">{field.company}</h4>
                <p className="text-sm text-slate-600 mt-0.5">{field.title}</p>
                <p className="text-xs font-medium text-slate-400 mt-2">{field.dateStr}</p>
              </div>
            ))}
            
            <button type="button" onClick={() => openModal()} className="w-full flex justify-center items-center text-sm text-brand-600 bg-brand-50 hover:bg-brand-100 py-3 rounded-xl font-semibold transition-colors mt-2">
              <Plus size={16} className="mr-1.5" /> Add Another Job
            </button>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Projects (Optional)</label>
        <textarea {...register('projects')} rows={3} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" placeholder="- React E-commerce app&#10;- Open source contributor..." />
      </div>

      {/* Experience Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[70] flex justify-center items-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90svh]">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-slate-900">{editingIndex !== null ? 'Edit Job' : 'Add Job'}</h3>
                <button type="button" onClick={() => setIsModalOpen(false)} className="p-1.5 bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 transition-colors"><X size={18} /></button>
              </div>
              <div className="p-5 overflow-y-auto space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Job Title *</label>
                  <input value={tempEntry.title} onChange={e => setTempEntry({ ...tempEntry, title: e.target.value })} placeholder="Software Engineer" className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none bg-slate-50/50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Company *</label>
                  <input value={tempEntry.company} onChange={e => setTempEntry({ ...tempEntry, company: e.target.value })} placeholder="Acme Corp" className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none bg-slate-50/50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Dates</label>
                  <input value={tempEntry.dateStr} onChange={e => setTempEntry({ ...tempEntry, dateStr: e.target.value })} placeholder="Jan 2020 - Present" className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none bg-slate-50/50" />
                </div>
                
                <div>
                  <div className="flex justify-between items-end mb-1">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">Description</label>
                    <EnhanceButton text={tempEntry.description} context="Work Experience" onEnhanced={(val) => setTempEntry({ ...tempEntry, description: val })} />
                  </div>
                  <textarea value={tempEntry.description} onChange={e => setTempEntry({ ...tempEntry, description: e.target.value })} rows={5} className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none bg-slate-50/50" placeholder="- Implemented feature X resulting in Y...&#10;- Led a team of 4..." />
                </div>
              </div>
              <div className="p-4 border-t border-slate-100 flex gap-3 bg-white">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors">Cancel</button>
                <button type="button" onClick={saveModal} disabled={!tempEntry.title || !tempEntry.company} className="flex-1 py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-colors disabled:opacity-50">Save</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
