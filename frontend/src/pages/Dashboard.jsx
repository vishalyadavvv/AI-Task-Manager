import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTasks } from '../hooks/useTasks.js';
import TaskCard from '../components/TaskCard.jsx';
import AddTaskModal from '../components/AddTaskModal.jsx';
import EditTaskModal from '../components/EditTaskModal.jsx';

const CATEGORIES = ['Work', 'Personal', 'Study', 'Health'];
const PRIORITIES = ['High', 'Medium', 'Low'];

/**
 * StatCard Component
 * Displays summary metrics with a glass-morphism effect.
 */
function StatCard({ label, value, sub, colorVar, icon, delay }) {
  return (
    <div 
      className="animate-fade-up glass-card p-5 cursor-default" 
      style={{ animationDelay: delay, opacity: 0 }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="mb-1.5 text-[12px] font-semibold text-gray-500 tracking-wider uppercase">
            {label}
          </p>
          <p className="text-[32px] font-extrabold leading-none font-display" style={{ color: colorVar }}>
            {value}
          </p>
          {sub && <p className="mt-1 text-[11px] text-text-muted">{sub}</p>}
        </div>
        <span className="text-[22px] opacity-70">{icon}</span>
      </div>
    </div>
  );
}

/**
 * FilterChip Component
 * Interactive chip for toggling filters.
 */
function FilterChip({ label, active, onClick }) {
  return (
    <button 
      onClick={onClick} 
      className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all duration-200 font-body border
        ${active 
          ? 'bg-gradient-to-br from-blue-400/25 to-purple-500/20 text-blue-400 border-blue-400/35' 
          : 'bg-bg-card text-text-dim border-border-subtle'
        }`}
    >
      {label}
    </button>
  );
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { tasks, loading, error, fetchTasks, createTask, updateTask, deleteTask, toggleStatus } = useTasks();

  const [search, setSearch] = useState('');
  const [catFilter, setCat] = useState('');
  const [priFilter, setPri] = useState('');
  const [statFilter, setStat] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const searchRef = useRef(null);

  // Debounced search/filter fetch
  useEffect(() => {
    const t = setTimeout(() => {
      fetchTasks({ search, category: catFilter, priority: priFilter, status: statFilter });
    }, 280);
    return () => clearTimeout(t);
  }, [search, catFilter, priFilter, statFilter, fetchTasks]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      const isInput = ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName);
      if (e.key === 'n' && !e.ctrlKey && !e.metaKey && !isInput) {
        setShowModal(true);
      }
      if (e.key === '/') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const clearFilters = () => { setSearch(''); setCat(''); setPri(''); setStat(''); };
  const hasFilters = search || catFilter || priFilter || statFilter;

  const counts = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'Pending').length,
    completed: tasks.filter(t => t.status === 'Completed').length,
    ai: tasks.filter(t => t.aiSource === 'ai').length,
  };
  const completionPct = counts.total ? Math.round((counts.completed / counts.total) * 100) : 0;

  return (
    <div className="flex h-screen bg-bg-void overflow-hidden relative font-body text-text-main">
      {/* Background Ambient Effects */}
      <div className="orb w-[600px] h-[600px] bg-blue-500/5 top-[-200px] right-[200px] animate-[orb-float_20s_infinite]" />
      <div className="orb w-[400px] h-[400px] bg-purple-500/5 bottom-[-100px] left-[300px] animate-[orb-float_16s_infinite_-8s]" />

      {/* ── Sidebar ── */}
      <aside className={`
        flex-shrink-0 overflow-hidden flex flex-col border-r border-border-subtle bg-bg-base/50 backdrop-blur-xl transition-all duration-300 z-10
        ${sidebarOpen ? 'w-[260px]' : 'w-0'}
      `}>
        <div className="p-6 flex flex-col gap-8 h-full overflow-y-auto min-w-[260px]">
          
          {/* Logo */}
          <Link to="/" className="animate-fade-up flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-[14px] shadow-lg shadow-blue-500/30">
              ✦
            </div>
            <span className="font-display text-xl font-extrabold tracking-tight gradient-text">TaskFlow</span>
          </Link>

          {/* User Profile */}
          <div className="animate-fade-up stagger-1 glass-card p-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-[15px] font-bold shadow-md shadow-blue-500/20">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold truncate text-text-main">{user?.name}</p>
              <p className="text-[11px] text-text-dim truncate">{user?.email}</p>
            </div>
          </div>

          {/* Progress Overview */}
          <div className="animate-fade-up stagger-2 p-4 bg-bg-surface rounded-xl border border-border-subtle">
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-[12px] font-semibold text-text-dim">Completion</span>
              <span className={`font-display text-lg font-bold ${completionPct === 100 ? 'text-emerald-primary' : 'text-cyan-primary'}`}>
                {completionPct}%
              </span>
            </div>
            <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(96,165,250,0.5)]" 
                style={{ width: `${completionPct}%` }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-[11px] text-text-dim">{counts.completed} done</span>
              <span className="text-[11px] text-text-dim">{counts.pending} left</span>
            </div>
          </div>

          {/* Category Filters */}
          <div className="animate-fade-up stagger-3">
            <p className="mb-2.5 text-[11px] font-bold text-gray-500 tracking-[0.08em] uppercase">Categories</p>
            <nav className="flex flex-col gap-1">
              {[{ v: '', l: '✦ All Categories' }, ...CATEGORIES.map(c => ({ v: c, l: c }))].map(({ v, l }) => (
                <button 
                  key={v} 
                  onClick={() => setCat(v === catFilter ? '' : v)}
                  className={`
                    text-left px-3 py-2 rounded-lg text-[13px] transition-colors
                    ${(catFilter === v || (!v && !catFilter)) 
                      ? 'bg-blue-400/10 text-white font-semibold' 
                      : 'text-gray-400 hover:bg-white/5'
                    }
                  `}
                >
                  {l}
                </button>
              ))}
            </nav>
          </div>

          {/* AI Stats */}
          {counts.ai > 0 && (
            <div className="animate-fade-up stagger-4 p-3.5 bg-blue-500/5 border border-blue-500/10 rounded-xl">
              <p className="mb-1 text-[11px] font-bold text-blue-400 tracking-wider uppercase">✦ AI Sorted</p>
              <p className="font-display text-2xl font-bold text-white">
                {counts.ai} <span className="text-[13px] font-normal text-gray-500 font-body">tasks</span>
              </p>
            </div>
          )}

          <button onClick={logout} className="btn-ghost mt-auto w-full text-center py-2.5">
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col overflow-hidden z-[1]">
        
        {/* Navbar */}
        <header className="animate-fade-up px-7 py-4 border-b border-border-subtle bg-bg-void/80 backdrop-blur-md flex items-center gap-4 flex-shrink-0">
          <button 
            onClick={() => setSidebarOpen(s => !s)}
            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 transition-all hover:bg-white/10"
          >
            ☰
          </button>

          {/* Global Search */}
          <div className="flex-1 relative max-w-[480px]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">🔍</span>
            <input 
              ref={searchRef} 
              className="tf-input !pl-10 h-10" 
              value={search} 
              onChange={e => setSearch(e.target.value)}
              placeholder="Search tasks… (press / to focus)" 
            />
          </div>

          {/* Filters Group */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            {PRIORITIES.map(p => (
              <FilterChip key={p} label={p} active={priFilter === p} onClick={() => setPri(priFilter === p ? '' : p)} />
            ))}
            <div className="w-[1px] h-4 bg-white/10 mx-1" />
            {['Pending', 'Completed'].map(s => (
              <FilterChip key={s} label={s} active={statFilter === s} onClick={() => setStat(statFilter === s ? '' : s)} />
            ))}
          </div>

          {hasFilters && (
            <button onClick={clearFilters} className="text-[13px] text-gray-500 hover:text-white transition-colors whitespace-nowrap px-2">
              Clear ✕
            </button>
          )}

          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2 px-4 py-2 flex-shrink-0">
            <span className="text-lg leading-none">+</span> 
            <span>New Task</span>
            <kbd className="hidden sm:inline-block text-[10px] opacity-70 bg-white/20 rounded-md px-1.5 py-0.5 ml-1">N</kbd>
          </button>
        </header>

        {/* Dynamic Stats Row */}
        <div className="animate-fade-up stagger-1 px-7 pt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 flex-shrink-0">
          <StatCard label="Total Tasks" value={counts.total} icon="📋" colorVar="#f0f4ff" delay="0.1s" />
          <StatCard label="Pending" value={counts.pending} icon="⏳" colorVar="#f6ad55" delay="0.15s" />
          <StatCard label="Completed" value={counts.completed} icon="✅" colorVar="#68d391" delay="0.2s" />
          <StatCard label="AI Sorted" value={counts.ai} icon="✦" colorVar="#63b3ed" delay="0.25s" sub="via Groq" />
        </div>

        {/* Main Task List */}
        <div className="flex-1 overflow-y-auto px-7 py-5 custom-scrollbar">
          {loading && (
            <div className="flex items-center justify-center gap-3 py-20 text-gray-500">
              <span className="spinner" /> 
              <span className="text-sm">Loading tasks…</span>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-4 text-sm flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          {!loading && !error && tasks.length === 0 && (
            <div className="animate-scale-in flex flex-col items-center justify-center py-24 text-center">
              <div className="text-[56px] mb-4 opacity-40">📭</div>
              <h3 className="font-display text-2xl font-bold mb-2 text-white">
                {hasFilters ? 'No matching tasks' : 'Quiet for now'}
              </h3>
              <p className="text-sm text-gray-400 mb-8 max-w-xs leading-relaxed">
                {hasFilters 
                  ? 'Try adjusting your filters or search query.' 
                  : 'Get ahead by adding your first task. Groq AI will handle categorization and prioritization.'
                }
              </p>
              {hasFilters ? (
                <button onClick={clearFilters} className="btn-ghost">Clear All Filters</button>
              ) : (
                <button 
                  onClick={() => setShowModal(true)} 
                  className="btn-primary flex items-center gap-2"
                >
                  <span>✦</span> Create Your First Task
                </button>
              )}
            </div>
          )}

          {!loading && tasks.length > 0 && (
            <div className="flex flex-col gap-2.5">
              {tasks.map((task, i) => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onToggle={toggleStatus} 
                  onDelete={deleteTask}
                  onEdit={setEditingTask}
                  index={i} 
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal Layer */}
      {showModal && (
        <AddTaskModal 
          onAdd={createTask} 
          onClose={() => setShowModal(false)} 
        />
      )}

      {editingTask && (
        <EditTaskModal 
          task={editingTask}
          onUpdate={updateTask}
          onClose={() => setEditingTask(null)}
        />
      )}
    </div>
  );
}
