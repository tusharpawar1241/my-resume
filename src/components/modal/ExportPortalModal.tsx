import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Loader2, Download, Settings, AlertCircle, Eye } from 'lucide-react';
import domtoimage from 'dom-to-image-more';
import { jsPDF } from 'jspdf';
import { TEMPLATE_COMPONENTS } from '../../constants/templateMap';
import ClassicTemplate from '../../templates/ClassicTemplate';
import type { ProfileData } from '../../types/profile';
import { STATIC_PLACEHOLDER_DATA } from '../../constants/placeholderData';

interface ExportPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ProfileData | null;
  templateId: string;
}

type ExportFormat = 'pdf' | 'png' | 'jpeg';
type MobileTab = 'settings' | 'preview';

export default function ExportPortalModal({ isOpen, onClose, data, templateId }: ExportPortalModalProps) {
  const [format, setFormat] = useState<ExportFormat>('pdf');
  const [quality, setQuality] = useState(2);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [mobileTab, setMobileTab] = useState<MobileTab>('settings');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const TemplateComponent = TEMPLATE_COMPONENTS[templateId] || ClassicTemplate;
  const renderData = data ? { ...STATIC_PLACEHOLDER_DATA, ...data } : STATIC_PLACEHOLDER_DATA;

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const padding = width < 480 ? 20 : 80;
        const scaleW = Math.min((width - padding) / 794, 1);
        setScale(scaleW);
      }
    };
    
    if (isOpen) {
      // Delay to let layout settle
      setTimeout(handleResize, 150);
      window.addEventListener('resize', handleResize);
    }
    
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen, mobileTab]);

  // Reset status when opened
  useEffect(() => {
    if (isOpen) {
       setStatus('idle');
       setErrorMessage('');
       setMobileTab('settings');
    }
  }, [isOpen]);

  const handleExport = async () => {
    const targetElement = document.getElementById('resume-capture-shadow');
    if (!targetElement || status === 'processing') return;
    
    setStatus('processing');
    setErrorMessage('');
    
    const styleNode = document.createElement('style');
    styleNode.id = 'capture-clean-overrides';
    styleNode.innerHTML = `
      #resume-capture-shadow * {
        box-sizing: border-box !important;
        outline: none !important;
        border: none !important;
      }
      #resume-capture-shadow {
        background: white !important;
        color: black !important;
      }
    `;
    
    try {
      document.head.appendChild(styleNode);
      await new Promise(r => setTimeout(r, 1000));

      const scaleValue = quality;
      const options = {
        width: 794 * scaleValue,
        height: 1123 * scaleValue,
        style: {
          transform: `scale(${scaleValue})`,
          transformOrigin: 'top left',
          width: '794px',
          height: '1123px'
        },
        quality: 1.0,
        bgcolor: '#ffffff'
      };

      let finalDataUrl = '';
      if (format === 'png' || format === 'pdf') {
        finalDataUrl = await domtoimage.toPng(targetElement, options);
      } else {
        finalDataUrl = await domtoimage.toJpeg(targetElement, { ...options, quality: 0.95 });
      }

      if (!finalDataUrl) throw new Error("Render pipeline returned no image data.");

      if (format === 'pdf') {
        const pdf = new jsPDF('p', 'mm', 'a4');
        pdf.addImage(finalDataUrl, 'PNG', 0, 0, 210, 297);
        pdf.save(`resume-${Date.now()}.pdf`);
      } else {
        const link = document.createElement('a');
        link.download = `resume-${Date.now()}.${format}`;
        link.href = finalDataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
      
    } catch (error: any) {
      console.error("CRITICAL EXPORT FAILURE:", error);
      setStatus('failed');
      setErrorMessage(error.message || 'Unknown processing error');
    } finally {
      if (styleNode.parentNode) {
        document.head.removeChild(styleNode);
      }
    }
  };

  const statusContent = {
    idle: { icon: Download, text: 'Download Now', bg: 'bg-brand-600 hover:bg-brand-700' },
    processing: { icon: Loader2, text: 'Generating...', bg: 'bg-slate-800' },
    success: { icon: CheckCircle, text: 'Export Ready!', bg: 'bg-green-600' },
    failed: { icon: AlertCircle, text: 'Export Failed', bg: 'bg-red-600' }
  };

  const CurrentStatus = statusContent[status];
  const StatusIcon = CurrentStatus.icon;

  const SettingsPanel = () => (
    <div className="w-full md:w-[340px] lg:w-[380px] bg-white shrink-0 flex flex-col h-full border-r border-slate-200 overflow-hidden">
      <div className="p-5 sm:p-8 border-b border-slate-100">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-sm ring-1 ring-brand-100">
          <Settings size={20} />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1 sm:mb-2 tracking-tight">Export Resume</h2>
        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-medium">Professional grade high-DPI engine.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 sm:space-y-8">
        
        {/* Format Selection */}
        <div className="space-y-3">
          <label className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest">Output Format</label>
          <div className="grid grid-cols-1 gap-2">
            {(['pdf', 'png', 'jpeg'] as const).map((f) => (
               <button 
                 key={f}
                 onClick={() => setFormat(f)}
                 className={`px-4 py-3 sm:px-5 sm:py-4 rounded-2xl border text-left flex items-center gap-3 sm:gap-4 transition-all ${format === f ? 'border-brand-500 bg-brand-50/50 ring-2 ring-brand-500/10 shadow-sm' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
               >
                 <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${format === f ? 'border-brand-600 bg-brand-600' : 'border-slate-200 bg-white'}`}>
                   {format === f && <CheckCircle size={10} className="text-white" />}
                 </div>
                 <div>
                   <div className="font-bold text-slate-900 capitalize text-sm sm:text-base">{f === 'pdf' ? 'PDF (Print Ready)' : f === 'png' ? 'PNG (Lossless)' : 'JPEG (Compressed)'}</div>
                   <div className="text-[10px] sm:text-[11px] font-semibold text-slate-500 mt-0.5 opacity-70">
                      {f === 'pdf' ? 'Best for printing & sharing' : f === 'png' ? 'Crystal clear digital use' : 'Optimized for social media'}
                   </div>
                 </div>
               </button>
            ))}
          </div>
        </div>

        {/* Quality Slider */}
        <div className="space-y-3 pt-4 sm:pt-6 border-t border-slate-100">
          <div className="flex justify-between items-end">
            <label className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest">Rendering Quality</label>
            <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-1 rounded-lg">{quality}x</span>
          </div>
          
          <input 
            type="range" 
            min="1" 
            max="4" 
            step="1"
            value={quality} 
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-full accent-brand-600 h-2 bg-slate-100 rounded-full appearance-none outline-none"
          />
          
          <div className="flex justify-between text-[10px] sm:text-[11px] font-bold text-slate-400">
            <span className={quality === 1 ? "text-brand-600" : ""}>Draft</span>
            <span className={quality === 2 ? "text-brand-600" : ""}>Full HD</span>
            <span className={quality === 4 ? "text-brand-600" : ""}>Ultra 4K</span>
          </div>
        </div>

        {/* Tip */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 sm:p-4 flex gap-3">
           <div className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center shadow-sm text-sm">✨</div>
           <p className="text-[10px] sm:text-[11px] text-slate-500 leading-tight font-medium py-0.5 sm:py-1">Supports OKLCH, SVGs, and ultra-high resolution captures up to 4x DPI.</p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 sm:p-8 border-t border-slate-100 bg-slate-50/50">
        {status === 'failed' && (
          <div className="mb-3 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100 flex items-center gap-2">
            <AlertCircle size={14} />
            {errorMessage}
          </div>
        )}
        <button
          onClick={handleExport}
          disabled={status === 'processing'}
          className={`w-full flex justify-center items-center gap-3 text-white py-4 px-6 rounded-2xl font-bold text-[14px] sm:text-[15px] shadow-xl transition-all border border-transparent disabled:opacity-90 disabled:cursor-not-allowed ${CurrentStatus.bg} ${status === 'processing' ? 'animate-pulse' : 'active:scale-[0.98]'}`}
        >
          {status === 'processing' ? (
             <Loader2 className="animate-spin" size={18} />
          ) : (
             <StatusIcon size={18} />
          )}
          {CurrentStatus.text}
        </button>
      </div>
    </div>
  );

  const PreviewPanel = () => (
    <div className="flex-1 overflow-hidden relative" style={{ backgroundColor: '#0c0c0d' }}>
      {/* Background ambiance */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30 pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-500/20 rounded-full blur-[120px]" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      <div
        ref={containerRef}
        className="relative z-10 w-full h-full overflow-y-auto overflow-x-hidden flex justify-center items-start p-6 sm:p-10"
      >
        {/* 1. Visible Preview */}
        <div 
          style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
          className="transition-transform duration-300 ease-out origin-top relative"
        >
          <div 
            style={{ width: '794px', height: '1123px', margin: '0 auto', backgroundColor: 'white', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', overflow: 'hidden', position: 'relative', borderRadius: '4px' }}
          >
             <TemplateComponent data={renderData} />
          </div>

          {/* Rendering Overlay */}
          <AnimatePresence>
            {status === 'processing' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-white/60 backdrop-blur-sm z-50 flex flex-col justify-center items-center pointer-events-none rounded-sm"
              >
                <div className="p-6 sm:p-8 bg-slate-900 rounded-[24px] sm:rounded-[28px] shadow-2xl flex flex-col items-center gap-4 sm:gap-6 border border-slate-700">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
                  <div className="text-center">
                    <h4 className="text-white font-bold text-base sm:text-lg">Capturing Resume</h4>
                    <p className="text-slate-400 text-xs font-medium mt-1">Modern CSS Engine • {quality}x Quality</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 2. Hidden Shadow Capture Target */}
        <div 
          id="resume-capture-shadow"
          style={{ 
            position: 'fixed', 
            left: '-10000px', 
            top: '0', 
            width: '794px', 
            height: '1123px', 
            backgroundColor: 'white', 
            overflow: 'hidden', 
            zIndex: -1,
            opacity: 1
          }}
        >
           <TemplateComponent data={renderData} />
        </div>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex justify-center items-end sm:items-center"
        >
          {/* Main Modal Container */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
            className="w-full sm:max-w-6xl sm:h-auto h-[92dvh] sm:max-h-[92dvh] bg-slate-900 sm:rounded-[28px] rounded-t-[28px] overflow-hidden shadow-2xl border border-slate-700/50 flex flex-col relative"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              disabled={status === 'processing'}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors disabled:opacity-50"
            >
              <X size={22} />
            </button>

            {/* Mobile Tab Bar — only visible on small screens */}
            <div className="md:hidden flex bg-slate-800/60 border-b border-slate-700/50 shrink-0">
              <button
                onClick={() => setMobileTab('settings')}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-bold transition-colors ${mobileTab === 'settings' ? 'text-white border-b-2 border-brand-500' : 'text-slate-400'}`}
              >
                <Settings size={15} />
                Settings
              </button>
              <button
                onClick={() => setMobileTab('preview')}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-bold transition-colors ${mobileTab === 'preview' ? 'text-white border-b-2 border-brand-500' : 'text-slate-400'}`}
              >
                <Eye size={15} />
                Preview
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              {/* Settings Panel: always visible on md+, tab-controlled on mobile */}
              <div className={`${mobileTab === 'settings' ? 'flex' : 'hidden'} md:flex flex-col h-full`}>
                <SettingsPanel />
              </div>

              {/* Preview Panel: always visible on md+, tab-controlled on mobile */}
              <div className={`${mobileTab === 'preview' ? 'flex' : 'hidden'} md:flex flex-1 flex-col h-full`}>
                <PreviewPanel />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
