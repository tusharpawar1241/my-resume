import { motion } from 'framer-motion';

const CATEGORIES = ['Classic', 'Modern', 'Creative'] as const;
export type TemplateCategory = typeof CATEGORIES[number];

interface CategoryTabsProps {
  activeTab: TemplateCategory;
  onTabChange: (tab: TemplateCategory) => void;
}

export default function CategoryTabs({ activeTab, onTabChange }: CategoryTabsProps) {
  return (
    <div className="flex space-x-1 p-1 bg-slate-100/80 rounded-2xl mb-6 shadow-inner">
      {CATEGORIES.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`relative flex-1 py-2 text-sm font-medium transition-colors ${
            activeTab === tab ? 'text-brand-800' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          {activeTab === tab && (
            <motion.div
              layoutId="category-tab-indicator"
              className="absolute inset-0 bg-white rounded-[14px] shadow-sm border border-slate-200/60"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-10">{tab}</span>
        </button>
      ))}
    </div>
  );
}
