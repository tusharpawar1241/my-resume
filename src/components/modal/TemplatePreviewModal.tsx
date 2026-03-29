import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Zap } from 'lucide-react';
import { STATIC_PLACEHOLDER_DATA } from '../../constants/placeholderData';
import ClassicTemplate from '../../templates/ClassicTemplate';
import { TEMPLATE_COMPONENTS } from '../../constants/templateMap';
import { toggleSavedTemplate, getSavedTemplates } from '../../services/firestoreService';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface TemplatePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateId: string | null;
  onBuild?: (templateId: string) => void;
}

export default function TemplatePreviewModal({ isOpen, onClose, templateId, onBuild }: TemplatePreviewModalProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (isOpen && templateId && user) {
      getSavedTemplates(user.uid).then(templates => {
        setIsSaved(templates.includes(templateId));
      });
    }
  }, [isOpen, templateId, user]);

  const handleToggleSave = async () => {
    if (!user || !templateId) return;
    const newState = !isSaved;
    setIsSaved(newState);
    await toggleSavedTemplate(user.uid, templateId, newState);
  };
  
  const handleBuildLaunch = () => {
     if (templateId) {
       if (onBuild) onBuild(templateId);
       else navigate('/profile-setup', { state: { templateId } });
     }
     onClose();
  };

  const TemplateComponent = templateId ? (TEMPLATE_COMPONENTS[templateId] || ClassicTemplate) : ClassicTemplate;

  return (
    <AnimatePresence>
      {isOpen && templateId && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed z-50 left-0 right-0 top-[4svh] mx-auto w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="flex justify-between items-center p-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-900">Template Preview</h3>
              <button onClick={onClose} className="p-2 bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200">
                <X size={18} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto bg-slate-50 pt-8 pb-4 flex flex-col items-center custom-scrollbar">
              {/* Scaled Render Target */}
              <div 
                className="w-[800px] h-[1123px] shrink-0 pointer-events-none"
                style={{ transform: 'scale(0.5)', transformOrigin: 'top center' }}
              >
                <div className="w-[794px] h-[1123px] mx-auto bg-white shadow-2xl rounded-md border border-slate-200 overflow-hidden">
                   <TemplateComponent data={STATIC_PLACEHOLDER_DATA} />
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex gap-3 bg-white">
              <button 
                onClick={handleToggleSave}
                className={`p-4 rounded-2xl transition-colors ${isSaved ? 'bg-amber-100 text-amber-500' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                <Star size={24} className={isSaved ? "fill-amber-400" : ""} />
              </button>
              <button 
                onClick={handleBuildLaunch}
                className="flex-1 flex justify-center items-center gap-2 bg-brand-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-brand-700 active:scale-[0.98] transition-all"
              >
                <Zap size={20} className="fill-brand-400" />
                Build Resume
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
