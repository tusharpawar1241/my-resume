import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { enhanceTextWithGemini } from '../../services/aiService';

interface EnhanceButtonProps {
  text: string;
  context: string;
  onEnhanced: (newText: string) => void;
}

export default function EnhanceButton({ text, context, onEnhanced }: EnhanceButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleEnhance = async () => {
    if (!text.trim()) return;
    setLoading(true);
    const newText = await enhanceTextWithGemini(text, context);
    onEnhanced(newText);
    setLoading(false);
  };

  return (
    <button
      type="button"
      onClick={handleEnhance}
      disabled={loading || !text.trim()}
      className="flex items-center space-x-1.5 text-xs font-medium text-brand-600 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-full transition-colors disabled:opacity-50"
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
      <span>{loading ? 'Enhancing...' : 'Enhance with AI'}</span>
    </button>
  );
}
