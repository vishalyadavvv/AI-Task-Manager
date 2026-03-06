import { useState } from 'react';

export default function AddTaskModal({ onAdd, onClose }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    setError('');
    setLoading(true);
    
    try {
      await onAdd(title, description);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="fixed inset-0 bg-bg-void/85 backdrop-blur-sm flex items-center justify-center z-[1000] p-6 animate-fade-in"
    >
      <div className="animate-scale-in w-full max-w-[520px] bg-bg-base border border-border-subtle rounded-2xl p-8 shadow-2xl flex flex-col gap-6">
        
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <h3 className="font-display text-2xl font-bold text-text-main tracking-tight">
            New Task
          </h3>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-bg-surface border border-border-subtle flex items-center justify-center text-text-dim hover:text-text-main hover:bg-white/10 transition-all cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* AI Insight Hint */}
        <div className="flex items-center gap-3 p-4 bg-cyan-primary/5 border border-cyan-primary/10 rounded-xl">
          <span className="text-xl">✦</span>
          <p className="text-[12px] text-cyan-primary font-medium leading-snug">
            Groq AI will automatically detect the category and suggested priority from your task title and description.
          </p>
        </div>

        {/* Error Feedback */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-4 text-[13px] flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Task Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-bold text-text-muted tracking-[0.1em] uppercase">
              Task Title <span className="text-rose-primary">*</span>
            </label>
            <input 
              className="tf-input px-4 py-3 bg-bg-void/40 border-border-subtle focus:border-cyan-primary/50" 
              value={title} 
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Complete quarterly performance review" 
              required 
              autoFocus 
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-bold text-gray-500 tracking-[0.1em] uppercase">
              Description 
              <span className="text-[10px] lowercase font-normal ml-2 opacity-60">(helps AI classify better)</span>
            </label>
            <textarea 
              className="tf-input px-4 py-3 bg-black/40 border-white/10 focus:border-blue-400/50 resize-none min-h-[100px]" 
              value={description} 
              onChange={e => setDescription(e.target.value)}
              placeholder="Add context, deadline, or specific details for better AI sorting…" 
              rows={4}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button 
              type="button" 
              onClick={onClose} 
              className="btn-ghost px-6 py-2.5"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading || !title.trim()} 
              className="btn-primary min-w-[160px] flex items-center justify-center gap-2 px-6 py-2.5"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span className="text-sm">✦</span>
                  <span>Create Task</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
