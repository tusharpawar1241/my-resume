import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Loader2, FileText, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ResumeMetadata {
  id: string;
  title?: string;
  templateId?: string;
  userId: string;
}

export default function MyResumes() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<ResumeMetadata[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResumes = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const q = query(collection(db, 'resumes'), where('userId', '==', user.uid));
        const snap = await getDocs(q);
        const fetched = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as ResumeMetadata));
        setResumes(fetched);
      } catch (e) {
        console.error('Failed to fetch resumes:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchResumes();
  }, [user]);

  if (loading) {
    return (
      <div className="flex flex-col h-full bg-slate-50 items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-brand-500" size={40} />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto h-full overflow-y-auto w-full">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">My Resumes</h1>
      {resumes.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-white p-12 rounded-3xl border border-slate-200 shadow-sm mt-8">
          <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center mb-6">
            <FileText size={40} className="text-brand-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">No Resumes Found</h2>
          <p className="text-slate-500 text-center max-w-sm mb-8">
            You haven't created any resumes yet. Start building your professional profile now.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-brand-600 text-white font-bold rounded-2xl shadow-lg shadow-brand-500/20 hover:bg-brand-700 active:scale-[0.98] transition-all"
          >
            Create Your First Resume
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {resumes.map(r => (
            <div key={r.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col group hover:shadow-md transition-shadow">
              <div className="flex-1 mb-6">
                <h3 className="font-bold text-lg text-slate-900 line-clamp-1">{r.title || 'Untitled Resume'}</h3>
                <p className="text-sm text-slate-500 mt-1">Template: {r.templateId || 'Classic'}</p>
              </div>
              <button 
                onClick={() => navigate('/profile-setup', { state: { templateId: r.templateId, resumeId: r.id } })}
                className="flex items-center justify-center gap-2 w-full bg-slate-50 text-brand-600 font-semibold py-2.5 rounded-xl group-hover:bg-brand-50 transition-colors"
              >
                <Edit size={16} /> Edit Resume
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
