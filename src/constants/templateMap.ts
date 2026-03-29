import ClassicTemplate from '../templates/ClassicTemplate';
import ModernTemplate from '../templates/ModernTemplate';
import ExecutiveTemplate from '../templates/ExecutiveTemplate';
import CreativeTemplate from '../templates/CreativeTemplate';

export const TEMPLATE_COMPONENTS: Record<string, React.ElementType> = {
  c1: ClassicTemplate,
  c2: ExecutiveTemplate,
  m1: ModernTemplate,
  cr1: CreativeTemplate,
};

export const TEMPLATE_LIST = [
  { id: 'c1', name: 'Standard Professional', category: 'Classic', color: 'bg-white' },
  { id: 'c2', name: 'Executive Minimalist', category: 'Classic', color: 'bg-slate-50' },
  { id: 'm1', name: 'Tech Modern', category: 'Modern', color: 'bg-brand-50' },
  { id: 'cr1', name: 'Creative Designer', category: 'Creative', color: 'bg-purple-50' },
];
