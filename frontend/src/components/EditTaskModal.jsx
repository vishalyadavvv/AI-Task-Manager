import { useState } from 'react';

const CATEGORIES = ['Work', 'Personal', 'Study', 'Health'];
const PRIORITIES = ['High', 'Medium', 'Low'];

export default function EditTaskModal({ task, onUpdate, onClose }) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [category, setCategory] = useState(task.category);
  const [priority, setPriority] = useState(task.priority);
  const [status, setStatus] = useState(task.status);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    setError('');
    setLoading(true);
    
    try {
      await onUpdate(task.id, {
        title,
        description,
        category,
        priority,
        status,
      });
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
      <div className="animate-scale-in w-full max-w-[520px] max-h-[90vh] overflow-y-auto bg-bg-base border border-border-subtle rounded-2xl p-5 sm:p-8 shadow-2xl flex flex-col gap-6">
        
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <h3 className="font-display text-2xl font-bold text-text-main tracking-tight">
            Edit Task
          </h3>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-bg-surface border border-border-subtle flex items-center justify-center text-text-dim hover:text-text-main hover:bg-white/10 transition-all cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Info Hint */}
        <div className="flex items-center gap-3 p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl">
          <span className="text-xl">ℹ️</span>
          <p className="text-[12px] text-blue-400 font-medium leading-snug">
            Update any field. Original AI categorization is preserved below.
          </p>
        </div>

        {/* Error Feedback */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-4 text-[13px] flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Task Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          
          {/* Title */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-bold text-text-muted tracking-[0.1em] uppercase">
              Task Title <span className="text-rose-primary">*</span>
            </label>
            <input 
              className="tf-input px-4 py-3 bg-bg-void/40 border-border-subtle focus:border-cyan-primary/50" 
              value={title} 
              onChange={e => setTitle(e.target.value)}
              placeholder="Task title" 
              required 
              autoFocus 
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-bold text-gray-500 tracking-[0.1em] uppercase">
              Description
            </label>
            <textarea 
              className="tf-input px-4 py-3 bg-black/40 border-white/10 focus:border-blue-400/50 resize-none min-h-[80px]" 
              value={description} 
              onChange={e => setDescription(e.target.value)}
              placeholder="Add task details…" 
              rows={3}
            />
          </div>

          {/* Category */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-bold text-gray-500 tracking-[0.1em] uppercase">
              Category
            </label>
            <select 
              className="tf-input px-4 py-3 bg-bg-void/40 border-border-subtle focus:border-cyan-primary/50"
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-bold text-gray-500 tracking-[0.1em] uppercase">
              Priority
            </label>
            <select 
              className="tf-input px-4 py-3 bg-bg-void/40 border-border-subtle focus:border-cyan-primary/50"
              value={priority}
              onChange={e => setPriority(e.target.value)}
            >
              {PRIORITIES.map(pri => (
                <option key={pri} value={pri}>{pri}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-bold text-gray-500 tracking-[0.1em] uppercase">
              Status
            </label>
            <div className="flex gap-3">
              {['Pending', 'Completed'].map(stat => (
                <button
                  key={stat}
                  type="button"
                  onClick={() => setStatus(stat)}
                  className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                    status === stat
                      ? 'bg-cyan-primary/20 text-cyan-primary border border-cyan-primary/40'
                      : 'bg-white/5 text-text-dim border border-border-subtle hover:bg-white/10'
                  }`}
                >
                  {stat}
                </button>
              ))}
            </div>
          </div>

          {/* AI Info */}
          {task.aiReasoning && (
            <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl">
              <p className="text-[11px] font-bold text-blue-400 mb-1.5">✦ AI Insight (Original)</p>
              <p className="text-[12px] text-gray-400 italic">
                {task.aiReasoning}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4">
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
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>✓</span>
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
