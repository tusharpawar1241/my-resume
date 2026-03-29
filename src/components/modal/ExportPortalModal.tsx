import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Loader2, Download, Settings, AlertCircle } from 'lucide-react';
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

export default function ExportPortalModal({ isOpen, onClose, data, templateId }: ExportPortalModalProps) {
  const [format, setFormat] = useState<ExportFormat>('pdf');
  const [quality, setQuality] = useState(2);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const TemplateComponent = TEMPLATE_COMPONENTS[templateId] || ClassicTemplate;
  const renderData = data ? { ...STATIC_PLACEHOLDER_DATA, ...data } : STATIC_PLACEHOLDER_DATA;

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const scaleW = Math.min((width - 64) / 794, 1);
        setScale(scaleW);
      }
    };
    
    if (isOpen) {
      handleResize();
      window.addEventListener('resize', handleResize);
    }
    
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  // Reset status when opened
  useEffect(() => {
    if (isOpen) {
       setStatus('idle');
       setErrorMessage('');
    }
  }, [isOpen]);

  const handleExport = async () => {
    // Target the specific shadow element that is NOT part of the animated preview tree
    const targetElement = document.getElementById('resume-capture-shadow');
    if (!targetElement || status === 'processing') return;
    
    setStatus('processing');
    setErrorMessage('');
    
    // Create a style node for 'Clean Capture' overrides
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
      console.log('--- Starting Ultra-Modern Export Pipeline (dom-to-image-more) ---');
      console.log(`Format: ${format}, Quality: ${quality}x`);
      
      // Inject the clean styles
      document.head.appendChild(styleNode);
      
      // 1. Critical Delay: Ensure all fonts/SVGs/CSS/Injected Styles are fully resolved
      // Increased to 1000ms as per previous configuration, exceeding the requested 500ms for safety
      await new Promise(r => setTimeout(r, 1000));

      // 2. Capture using dom-to-image-more
      // Note: useCORS and logging are html2canvas options; dom-to-image-more handles these natively.
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

      if (!finalDataUrl) {
        throw new Error("Render pipeline returned no image data.");
      }

      console.log('Capture Successful. Processing file...');
      
      // 3. Format Specific Handling
      if (format === 'pdf') {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210; // A4 Width in mm
        const imgHeight = 297; // A4 Height in mm
        
        // Use PNG for maximum clarity in PDF text
        pdf.addImage(finalDataUrl, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(`resume-${Date.now()}.pdf`);
      } else {
        // PNG or JPEG Download
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
      // Cleanup: Remove the temporary styles
      if (styleNode.parentNode) {
        document.head.removeChild(styleNode);
      }
    }
  };

  const statusContent = {
    idle: { icon: Download, text: 'Download Now', bg: 'bg-brand-600 hover:bg-brand-700' },
    processing: { icon: Loader2, text: 'Generating Image...', bg: 'bg-slate-800' },
    success: { icon: CheckCircle, text: 'Export Ready!', bg: 'bg-green-600' },
    failed: { icon: AlertCircle, text: 'Export Failed', bg: 'bg-red-600' }
  };

  const CurrentStatus = statusContent[status];
  const StatusIcon = CurrentStatus.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex justify-center items-center p-4 lg:p-8"
        >
          {/* Main Modal Container */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="w-full max-w-6xl h-full max-h-[900px] bg-slate-900 rounded-[32px] overflow-hidden shadow-2xl border border-slate-700/50 flex flex-col md:flex-row relative"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              disabled={status === 'processing'}
              className="absolute top-6 right-6 z-50 p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors disabled:opacity-50"
            >
              <X size={24} />
            </button>

            {/* Left Panel: Settings */}
            <div className="w-full md:w-[380px] bg-white shrink-0 flex flex-col h-full border-r border-slate-200">
              <div className="p-8 border-b border-slate-100">
                <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm ring-1 ring-brand-100">
                  <Settings size={22} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">Export Portrait</h2>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">Professional grade high-DPI engine for perfect accuracy.</p>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                
                {/* Format Selection */}
                <div className="space-y-4">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Output Format</label>
                  <div className="grid grid-cols-1 gap-2.5">
                    {(['pdf', 'png', 'jpeg'] as const).map((f) => (
                       <button 
                         key={f}
                         onClick={() => setFormat(f)}
                         className={`px-5 py-4 rounded-2xl border text-left flex items-center gap-4 transition-all ${format === f ? 'border-brand-500 bg-brand-50/50 ring-2 ring-brand-500/10 shadow-sm' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                       >
                         <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${format === f ? 'border-brand-600 bg-brand-600' : 'border-slate-200 bg-white'}`}>
                           {format === f && <CheckCircle size={12} className="text-white" />}
                         </div>
                         <div>
                           <div className="font-bold text-slate-900 capitalize">{f === 'pdf' ? 'PDF (Print Ready)' : f === 'png' ? 'PNG (Lossless)' : 'JPEG (Compressed)'}</div>
                           <div className="text-[11px] font-semibold text-slate-500 mt-0.5 opacity-70">
                              {f === 'pdf' ? 'Recommended for physical printing' : f === 'png' ? 'Crystal clear digital use' : 'Best for social media sharing'}
                           </div>
                         </div>
                       </button>
                    ))}
                  </div>
                </div>

                {/* Quality Slider */}
                <div className="space-y-4 pt-6 border-t border-slate-100">
                  <div className="flex justify-between items-end">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Rendering Depth</label>
                    <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-lg">Scale: {quality}x</span>
                  </div>
                  
                  <input 
                    type="range" 
                    min="1" 
                    max="4" 
                    step="1"
                    value={quality} 
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full accent-brand-600 h-2 bg-slate-100 rounded-full appearance-none outline-none focus:ring-4 focus:ring-brand-500/10"
                  />
                  
                  <div className="flex justify-between text-[11px] font-bold text-slate-400">
                    <span className={quality === 1 ? "text-brand-600" : ""}>Draft</span>
                    <span className={quality === 2 ? "text-brand-600" : ""}>Full HD</span>
                    <span className={quality === 4 ? "text-brand-600" : ""}>Ultra 4K</span>
                  </div>
                </div>

                {/* AI Polish Tip */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex gap-3">
                   <div className="shrink-0 w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center shadow-sm">✨</div>
                   <p className="text-[11px] text-slate-500 leading-tight font-medium py-1">The new engine supports OKLCH, SVGs, and ultra-high resolution captures up to 4x DPI.</p>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-8 border-t border-slate-100 bg-slate-50/50">
                {status === 'failed' && (
                  <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100 flex items-center gap-2">
                    <AlertCircle size={14} />
                    {errorMessage}
                  </div>
                )}
                <button
                  onClick={handleExport}
                  disabled={status === 'processing'}
                  className={`w-full flex justify-center items-center gap-3 text-white py-4.5 px-6 rounded-2xl font-bold text-[15px] shadow-xl transition-all border border-transparent disabled:opacity-90 disabled:cursor-not-allowed ${CurrentStatus.bg} ${status === 'processing' ? 'animate-pulse' : 'hover:-translate-y-1 hover:shadow-brand-500/20 active:translate-y-0 shadow-brand-500/10'}`}
                >
                  {status === 'processing' ? (
                     <Loader2 className="animate-spin" size={20} />
                  ) : (
                     <StatusIcon size={20} />
                  )}
                  {CurrentStatus.text}
                </button>
              </div>
            </div>

            {/* Right Panel: High-Res Dark Canvas Preview */}
            <div className="flex-1 overflow-hidden relative" style={{ backgroundColor: '#0c0c0d' }}>
              
              {/* Background ambiance */}
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30">
                 <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-500/20 rounded-full blur-[120px]" />
                 <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px]" />
              </div>

              <div ref={containerRef} style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '60px 40px', width: '100%', height: '100%', overflowY: 'auto', overflowX: 'hidden' }} className="relative z-10 custom-scrollbar">
                
                {/* 1. Visible Preview (Scaled & Animated) */}
                <div 
                  style={{ transform: `scale(${scale})` }}
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
                        <div className="p-8 bg-slate-900 rounded-[28px] shadow-2xl flex flex-col items-center gap-6 border border-slate-700">
                          <div className="w-16 h-16 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
                          <div className="text-center">
                            <h4 className="text-white font-bold text-lg">Capturing Resume</h4>
                            <p className="text-slate-400 text-xs font-medium mt-1">Rendering with Modern CSS Engine • {quality}x Quality</p>
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
