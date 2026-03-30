import { useState, useRef, useEffect } from 'react';
import type { TemplateCategory } from './CategoryTabs';
import { motion } from 'framer-motion';
import { STATIC_PLACEHOLDER_DATA } from '../../constants/placeholderData';
import { TEMPLATE_COMPONENTS, TEMPLATE_LIST } from '../../constants/templateMap';
import ClassicTemplate from '../../templates/ClassicTemplate';

interface TemplateGridProps {
  category: TemplateCategory;
  onSelect: (templateId: string) => void;
}

export default function TemplateGrid({ category, onSelect }: TemplateGridProps) {
  const activeTemplates = category === 'Modern' ? TEMPLATE_LIST.filter(t => t.category === 'Modern') :
                          category === 'Creative' ? TEMPLATE_LIST.filter(t => t.category === 'Creative') :
                          category === 'Classic' ? TEMPLATE_LIST.filter(t => t.category === 'Classic') :
                          TEMPLATE_LIST;

  const gridRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.25);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      // Use the first child's width to calculate precise mathematical A4 scaling
      if (entries[0] && entries[0].target.firstElementChild) {
        const itemWidth = entries[0].target.firstElementChild.getBoundingClientRect().width;
        // 794px is the hardcoded A4 pixel width of our templates
        const exactScale = itemWidth / 794;
        setScale(exactScale);
      }
    });
    
    if (gridRef.current) {
      observer.observe(gridRef.current);
    }
    return () => observer.disconnect();
  }, [category]);

  return (
    <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-8">
      {activeTemplates.map((tpl) => {
        const TemplateComponent = TEMPLATE_COMPONENTS[tpl.id] || ClassicTemplate;
        
        return (
          <motion.button
            key={tpl.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onSelect(tpl.id)}
            className="flex flex-col items-center group text-left outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-xl"
          >
            {/* Thumbnail Config (Mathematically A4 matching) */}
            <div className={`w-full aspect-[1/1.414] ${tpl.color} rounded-xl shadow border border-slate-200 mb-3 group-hover:border-brand-400 group-hover:shadow-2xl group-hover:-translate-y-1 transition-all duration-300 relative overflow-hidden bg-white`}>
              
              {/* Dynamic Centering Frame */}
              <div 
                className="absolute top-0 left-0 origin-top-left pointer-events-none"
                style={{ transform: `scale(${scale})` }}
              >
                <div className="w-[794px] h-[1123px] bg-white">
                  <TemplateComponent data={STATIC_PLACEHOLDER_DATA} />
                </div>
              </div>
              
              {/* Overlay Gradient for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span className="text-sm font-bold text-slate-800 line-clamp-1 w-full text-center px-1 group-hover:text-brand-600 transition-colors">
              {tpl.name}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
