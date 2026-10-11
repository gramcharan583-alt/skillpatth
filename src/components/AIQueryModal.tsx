import React, { useState } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import { AIService } from '../services/aiService';
import { StorageService } from '../services/storageService';

interface AIQueryModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile?: any; // StudentProfile optional for API key
}

export const AIQueryModal: React.FC<AIQueryModalProps> = ({ isOpen, onClose, profile }) => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await AIService.queryAI(prompt, profile);
      setResponse(res.data);
      StorageService.addActivity('ai', `User query: "${prompt}"`);
    } catch (e) {
      setError('Failed to get AI response.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>
        <h2 className="text-xl font-bold mb-4">Ask SkillPath AI</h2>
        {error && <div className="text-red-500 mb-2 text-sm">{error}</div>}
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Enter your question..."
          className="w-full h-32 p-2 border rounded mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <div className="flex items-center justify-between">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>{loading ? 'Thinking…' : 'Send'}</span>
          </button>
        </div>
        {response && (
          <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-sm overflow-y-auto max-h-60">
            {response}
          </div>
        )}
      </div>
    </div>
  );
};
