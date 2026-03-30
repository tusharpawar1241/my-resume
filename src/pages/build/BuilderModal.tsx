import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, ArrowLeft, Loader2 } from 'lucide-react';
// html2canvas and jspdf imports removed to fix lint warnings as they are no longer needed for window.print()

import { getProfileData } from '../../services/firestoreService';
import { useAuth } from '../../hooks/useAuth';
import ClassicTemplate from '../../templates/ClassicTemplate';
import type { ProfileData } from '../../types/profile';
import ExportPortalModal from '../../components/modal/ExportPortalModal';

interface BuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateId: string | null;
}

export default function BuilderModal({ isOpen, onClose, templateId }: BuilderModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (isOpen && user) {
      // Defer to next tick to avoid synchronous state update warning
      Promise.resolve().then(() => setLoading(true));
      getProfileData(user.uid).then(data => {
        setProfileData(data as ProfileData);
        setTimeout(() => setLoading(false), 1500);
      });
    }
  }, [isOpen, user]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const padding = 48; // 24px padding on both sides
        const newScale = Math.min((width - padding) / 794, 1);
        setScale(newScale);
      }
    };
    
    if (!loading && isOpen) {
      handleResize();
      window.addEventListener('resize', handleResize);
    }
    
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen, loading]);

  const handleDownload = () => {
    setIsExportModalOpen(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "100%" }}
          transition={{ type: "spring", bounce: 0, duration: 0.4 }}
          className="fixed inset-0 z-[60] bg-slate-100 flex flex-col"
        >
          <div className="flex justify-between items-center p-4 bg-white shadow-sm shrink-0 relative z-10">
            <button onClick={onClose} className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors flex items-center gap-2">
              <ArrowLeft size={20} />
              <span className="font-medium hidden sm:inline">Back</span>
            </button>
            <h2 className="font-semibold text-slate-900 absolute left-1/2 -translate-x-1/2 whitespace-nowrap">
              {loading ? 'Cooking...' : 'Final Preview'}
            </h2>
            <div className="w-8" />
          </div>

          <div ref={containerRef} className="flex-1 overflow-y-auto overflow-x-hidden relative flex justify-center py-8 pb-32">
            {loading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                <Loader2 size={48} className="animate-spin text-brand-500" />
                <p className="font-medium text-slate-600 animate-pulse">Cooking your resume...</p>
              </div>
            ) : (
              <div 
                style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
                className="transition-transform duration-200"
              >
                {/* Unscaled robust wrapper for precise html2canvas scraping */}
                <div id="resume-preview-content" ref={targetRef} className="w-[794px] h-[1123px] bg-white shadow-2xl overflow-hidden relative">
                   <ClassicTemplate data={profileData} />
                </div>
              </div>
            )}
          </div>

          {!loading && (
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="absolute bottom-6 left-0 right-0 px-6 shrink-0 z-20"
            >
              <button 
                onClick={handleDownload}
                className="w-[90%] max-w-sm mx-auto flex justify-center items-center gap-2 bg-black text-white py-4 rounded-2xl font-bold text-lg shadow-2xl shadow-black/30 hover:bg-slate-800 active:scale-[0.98] transition-all border border-slate-700"
              >
                <Download size={22} />
                Download PDF
              </button>
            </motion.div>
          )}

        </motion.div>
      )}
      
      {/* Additional feature-rich modal rendered on top if requested */}
      <ExportPortalModal 
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        data={profileData}
        templateId={templateId || 'c1'}
      />
    </AnimatePresence>
  );
}
