import { useState, useEffect, useRef } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Check, Loader2, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useAuth } from '../../hooks/useAuth';
import { saveProfileData, getProfileData } from '../../services/firestoreService';
import type { ProfileData } from '../../types/profile';
import { StepPersonal } from './steps/StepPersonal';
import { StepExperience } from './steps/StepExperience';
import { StepEducation } from './steps/StepEducation';
import ClassicTemplate from '../../templates/ClassicTemplate';
import { TEMPLATE_COMPONENTS } from '../../constants/templateMap';
import { STATIC_PLACEHOLDER_DATA } from '../../constants/placeholderData';
import ExportPortalModal from '../../components/modal/ExportPortalModal';

interface ProfileWizardProps {
  templateId?: string;
  onCancel?: () => void;
}

export default function ProfileWizard({ templateId: propTemplateId, onCancel }: ProfileWizardProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const templateId = propTemplateId || location.state?.templateId || 'c1';
  const TemplateComponent = TEMPLATE_COMPONENTS[templateId] || ClassicTemplate;
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialFetchDone, setInitialFetchDone] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const methods = useForm<ProfileData>({
    mode: 'onChange',
    defaultValues: {
      fullName: '', email: '', phone: '', linkedin: '', github: '',
      summary: '', workExperience: [], projects: [], education: [], skills: [], achievements: ''
    }
  });

  const watchData = methods.watch() as ProfileData;

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const fetchProfile = async () => {
      try {
        if (!user) {
          setInitialFetchDone(true);
          return;
        }
        const data = await getProfileData(user.uid);
        if (data) {
          methods.reset(data);
        } else {
          // Initialize with current user info if no doc exists
          methods.reset((prev) => ({
            ...prev,
            email: user?.email || '',
            phone: user?.phoneNumber || '',
            fullName: user?.displayName || '',
          }));
        }
      } catch (err) {
        console.error('Failed to fetch profile data:', err);
      } finally {
        setInitialFetchDone(true);
      }
    };

    if (!initialFetchDone) {
      // 5-second emergency fallback
      timeoutId = setTimeout(() => {
        setInitialFetchDone(true);
      }, 5000);
      
      if (user) {
        fetchProfile();
      } else {
        // If auth isn't loading but user is null, resolve immediately
        setInitialFetchDone(true);
      }
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [user, initialFetchDone, methods]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const padding = 64; 
        const newScale = Math.min((width - padding) / 794, 1);
        setScale(newScale);
      }
    };
    
    if (initialFetchDone) {
      handleResize();
      window.addEventListener('resize', handleResize);
    }
    
    return () => window.removeEventListener('resize', handleResize);
  }, [initialFetchDone]);

  const onNext = async () => {
    const fieldsToValidate = 
      step === 1 ? ['fullName', 'email', 'phone'] as const :
      step === 2 ? ['summary'] as const : [];
    
    if (fieldsToValidate.length > 0) {
      const isValid = await methods.trigger(fieldsToValidate);
      if (!isValid) return;
    }
    setDirection(1);
    setStep((prev) => prev + 1);
  };

  const onPrev = () => {
    setDirection(-1);
    setStep((prev) => prev - 1);
  };

  const handleFinalSubmit = async (data: ProfileData) => {
    if (!user) return;
    try {
      setLoading(true);
      await saveProfileData(user.uid, data);
      if (onCancel) onCancel();
      else navigate('/');
    } catch (e) {
      console.error(e);
      alert('Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    setIsExportModalOpen(true);
  };

  if (!initialFetchDone) {
    return (
      <div className="p-6 flex flex-col justify-center items-center h-[50vh]">
        <Loader2 className="animate-spin text-brand-500 mb-4" size={40} />
        <p className="text-slate-500 font-medium animate-pulse">Fetching your profile...</p>
      </div>
    );
  }

  const slideVariants = {
    initial: (dir: number) => ({ x: dir > 0 ? 50 : -50, opacity: 0 }),
    animate: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -50 : 50, opacity: 0 })
  };

  return (
    <div className="h-full w-full">
      <FormProvider {...methods}>
        <div className="grid grid-cols-1 xl:grid-cols-12 h-full">
          
          {/* Left Column: Input Form Area */}
          <div className="col-span-1 xl:col-span-7 flex flex-col p-6 lg:p-12 pb-32 xl:pb-12 h-auto xl:h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="max-w-3xl w-full mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-4">Build Your Resume</h1>
                
                {/* Progress Bar */}
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden mb-3">
                  <div 
                    className="h-full bg-brand-500 transition-all duration-500 ease-out"
                    style={{ width: `${(step / 3) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm font-semibold text-slate-400 px-1">
                  <span className={step >= 1 ? 'text-brand-600' : ''}>Personal Data</span>
                  <span className={step >= 2 ? 'text-brand-600 w-full text-center' : 'w-full text-center'}>Experience</span>
                  <span className={step >= 3 ? 'text-brand-600 text-right' : 'text-right'}>Education & Skills</span>
                </div>
              </div>

              {/* Form Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 lg:p-8 min-h-[450px] flex flex-col">
                <div className="flex-1 relative">
                  <AnimatePresence mode="wait" custom={direction} initial={false}>
                    <motion.div
                      key={step}
                      custom={direction}
                      variants={slideVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      className="w-full"
                    >
                      {step === 1 && <StepPersonal />}
                      {step === 2 && <StepExperience />}
                      {step === 3 && <StepEducation />}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Navigation Footer Inside Card */}
                <div className="mt-10 flex justify-between items-center border-t border-slate-100 pt-6">
                  <button
                    type="button"
                    onClick={onPrev}
                    disabled={step === 1}
                    className="flex items-center text-slate-500 hover:text-slate-800 hover:bg-slate-50 px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-0"
                  >
                    <ChevronLeft size={20} className="mr-1" /> Back
                  </button>
                  
                  {step < 3 ? (
                    <button
                      type="button"
                      onClick={onNext}
                      className="flex items-center bg-brand-50 text-brand-700 px-6 py-2.5 rounded-xl font-bold hover:bg-brand-100 transition-colors shadow-sm"
                    >
                      Continue <ChevronRight size={20} className="ml-1" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={methods.handleSubmit(handleFinalSubmit)}
                      disabled={loading}
                      className="flex items-center bg-brand-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-brand-700 transition-colors disabled:opacity-50 shadow-md shadow-brand-500/20"
                    >
                      {loading ? 'Saving...' : 'Finish & Save'}
                      <Check size={20} className="ml-1.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Sticky Preview (Desktop Only) */}
          <div className="hidden xl:flex xl:col-span-5 bg-slate-200/40 border-l border-slate-200 sticky top-0 h-[calc(100vh)] flex-col">
            <div className="h-16 px-6 bg-white border-b border-slate-200 flex justify-between items-center shadow-sm shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                <h3 className="font-bold text-slate-700">Live Preview</h3>
              </div>
              <button 
                onClick={handleDownload}
                className="flex items-center gap-2 text-sm font-semibold bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 shadow-sm transition-colors"
              >
                <Download size={16} />
                Export PDF
              </button>
            </div>
            
            {/* Scaled Preview Pane */}
            <div ref={containerRef} className="flex-1 overflow-auto relative p-8 flex justify-center items-start custom-scrollbar">
              <div 
                style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
                className="transition-transform duration-100"
              >
                {/* 1:1 Rendering Engine Canvas */}
                <div id="resume-preview-content" ref={targetRef} className="w-[794px] min-h-[1123px] bg-white shadow-xl ring-1 ring-slate-900/5">
                   <TemplateComponent data={{
                     ...STATIC_PLACEHOLDER_DATA,
                      ...Object.fromEntries(
                        Object.entries(watchData).filter(([key, v]) => 
                          key !== null && v !== null && v !== undefined && v !== '' && 
                          (!Array.isArray(v) || v.length > 0)
                        )
                      )
                   }} />
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </FormProvider>

      <ExportPortalModal 
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        data={watchData}
        templateId={templateId}
      />
    </div>
  );
}
