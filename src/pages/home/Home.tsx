import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import CategoryTabs, { type TemplateCategory } from '../../components/dashboard/CategoryTabs';
import TemplateGrid from '../../components/dashboard/TemplateGrid';
import TemplatePreviewModal from '../../components/modal/TemplatePreviewModal';
import ProfileWizard from '../profile/ProfileWizard';
import { Search, Loader2 } from 'lucide-react';
import { getProfileData } from '../../services/firestoreService';

export default function Home() {
  const { user } = useAuth();
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState<TemplateCategory>('Classic');
  
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(null);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(location.state?.templateId || null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getProfileData(user.uid)
        .then(() => setIsLoading(false))
        .catch(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const handleTemplateSelect = (templateId: string) => {
    setPreviewTemplateId(templateId);
  };

  const handleBuild = (templateId: string) => {
    setPreviewTemplateId(null);
    setTimeout(() => {
      setEditingTemplateId(templateId);
    }, 200); // Wait for open modal to cleanly exit
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-slate-50 items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-brand-500" size={40} />
        <p className="text-slate-500 font-medium animate-pulse">Loading dashboard...</p>
      </div>
    );
  }

  // Dual-State Engine: Render the Split-Screen Builder directly inside Home
  if (editingTemplateId) {
    return <ProfileWizard templateId={editingTemplateId} onCancel={() => setEditingTemplateId(null)} />;
  }

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Sticky Top Header */}
      <div className="sticky top-0 z-20 bg-slate-50/85 backdrop-blur-md px-6 pt-6 pb-2">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-sm font-medium text-slate-500">Welcome back,</p>
            <h1 className="text-2xl font-bold text-slate-900">{user?.displayName || user?.email?.split('@')[0] || 'Guest'}</h1>
          </div>
          <button className="p-2 bg-white rounded-full shadow-sm border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
            <Search size={20} />
          </button>
        </div>
        
        <CategoryTabs activeTab={activeCategory} onTabChange={setActiveCategory} />
      </div>

      {/* Scrollable Content */}
      <div className="px-6 flex-1 overflow-y-auto pb-4">
        <TemplateGrid category={activeCategory} onSelect={handleTemplateSelect} />
      </div>

      <TemplatePreviewModal 
        isOpen={!!previewTemplateId} 
        onClose={() => setPreviewTemplateId(null)} 
        templateId={previewTemplateId}
        onBuild={handleBuild}
      />
    </div>
  );
}
