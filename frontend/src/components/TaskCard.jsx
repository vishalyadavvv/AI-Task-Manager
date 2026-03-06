import { useState } from 'react';

const CATEGORY_CFG = {
  Work:     { icon: '💼', color: 'text-cyan-primary', bg: 'bg-cyan-primary/10', border: 'border-cyan-primary/20' },
  Personal: { icon: '🌸', color: 'text-violet-primary', bg: 'bg-violet-primary/10', border: 'border-violet-primary/20' },
  Study:    { icon: '📚', color: 'text-emerald-primary', bg: 'bg-emerald-primary/10', border: 'border-emerald-primary/20' },
  Health:   { icon: '❤️', color: 'text-rose-primary', bg: 'bg-rose-primary/10', border: 'border-rose-primary/20' },
};

const PRIORITY_CFG = {
  High:   { dot: 'bg-rose-primary', label: 'High',   bg: 'bg-rose-primary/10', text: 'text-rose-primary' },
  Medium: { dot: 'bg-amber-primary', label: 'Medium', bg: 'bg-amber-primary/10', text: 'text-amber-primary' },
  Low:    { dot: 'bg-emerald-primary', label: 'Low',    bg: 'bg-emerald-primary/10', text: 'text-emerald-primary' },
};

export default function TaskCard({ task, onToggle, onDelete, onEdit, index = 0 }) {
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const cat = CATEGORY_CFG[task.category] || CATEGORY_CFG.Personal;
  const pri = PRIORITY_CFG[task.priority] || PRIORITY_CFG.Medium;
  const isCompleted = task.status === 'Completed';

  const handleToggle = async (e) => {
    e.stopPropagation();
    setToggling(true);
    try { await onToggle(task); } finally { setToggling(false); }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    setDeleting(true);
    try { await onDelete(task.id); } catch { setDeleting(false); }
  };

  return (
    <div
      className="animate-fade-up group"
      style={{ animationDelay: `${index * 0.05}s`, opacity: 0 }}
    >
      <div className={`
        relative overflow-hidden transition-all duration-300 border rounded-2xl p-5
        bg-bg-card hover:bg-bg-card-hover 
        ${isCompleted ? 'opacity-60 grayscale-[0.3]' : 'opacity-100'}
        ${deleting ? 'scale-95 opacity-40 blur-sm' : 'scale-100'}
        border-border-subtle hover:border-cyan-primary/30 hover:shadow-glow
      `}>
        
        {/* Main Content Area */}
        <div className="flex items-start gap-4">
          
          {/* Custom Checkbox */}
          <button 
            onClick={handleToggle} 
            disabled={toggling}
            className="flex-shrink-0 mt-1 cursor-pointer"
          >
            <div className={`
              w-5 h-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center
              ${isCompleted 
                ? 'bg-gradient-to-br from-cyan-primary to-violet-primary border-transparent shadow-[0_2px_8px_rgba(96,165,250,0.4)]' 
                : 'bg-transparent border-text-muted group-hover:border-cyan-primary/50'
              }
            `}>
              {toggling ? (
                <div className="w-2.5 h-2.5 rounded-full border border-white/50 border-t-white animate-spin" />
              ) : isCompleted ? (
                <span className="text-white text-[11px] font-bold">✓</span>
              ) : null}
            </div>
          </button>

          {/* Task Info */}
          <div className="flex-1 min-w-0">
            <h4 className={`
              text-[15px] font-medium transition-all duration-200 truncate
              ${isCompleted ? 'text-text-muted line-through' : 'text-text-main'}
            `}>
              {task.title}
            </h4>
            {task.description && (
              <p className="mt-1 text-[13px] text-text-dim leading-relaxed line-clamp-2">
                {task.description}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit(task); }}
              className="text-gray-600 hover:text-blue-400 transition-colors p-1 rounded-md" 
              title="Edit task"
            >
              ✎
            </button>
            <button 
              onClick={handleDelete} 
              disabled={deleting}
              className="text-gray-600 hover:text-red-400 transition-colors p-1 rounded-md"
              title="Delete task"
            >
              {deleting ? <span className="spinner spinner-sm" /> : '✕'}
            </button>
          </div>
        </div>

        {/* Task Metadata Footer */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-white/[0.03]">
          
          {/* Category Badge */}
          <span className={`
            inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border
            ${cat.bg} ${cat.color} ${cat.border}
          `}>
            <span>{cat.icon}</span>{task.category}
          </span>

          {/* Priority Badge */}
          <span className={`
            inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border border-white/5 bg-white/5 ${pri.text}
          `}>
            <span className={`w-1.5 h-1.5 rounded-full ${pri.dot}`} />
            {pri.label}
          </span>

          {/* AI Origin Badge */}
          {task.aiSource === 'ai' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-500/5 text-blue-400 border border-blue-400/10">
              <span className="text-[10px]">✦</span> AI
            </span>
          )}

          {/* Creation Date */}
          <time className="ml-auto text-[11px] text-gray-600 font-medium">
            {new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </time>
        </div>

        {/* AI Insight (Expandable on card hover) */}
        {task.aiReasoning && (
          <div className="max-h-0 overflow-hidden group-hover:max-h-20 transition-all duration-500 ease-in-out">
            <div className="mt-3 p-3 bg-blue-400/[0.03] border border-blue-400/10 rounded-xl flex gap-3 items-center">
              <span className="text-sm opacity-60">💡</span>
              <p className="text-[12px] text-gray-400 italic leading-snug">
                {task.aiReasoning}
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
