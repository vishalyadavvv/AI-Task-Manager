import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-bg-void flex flex-col relative overflow-hidden font-body text-text-main">
      
      {/* Background Orbs (Reusing the dashboard/login aesthetic) */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] animate-[orb-float_15s_infinite]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] animate-[orb-float_20s_infinite_-5s]" />
      <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] bg-cyan-primary/5 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2" />

      {/* Navigation Bar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 border-b border-white/5 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-3 animate-fade-in hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-lg shadow-[0_0_20px_rgba(96,165,250,0.3)]">
            ✦
          </div>
          <span className="font-display text-2xl font-extrabold tracking-tight gradient-text">TaskFlow</span>
        </Link>
        
        <div className="flex items-center gap-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-400 hidden sm:block">
                Logged in as <strong className="text-white">{user.name}</strong>
              </span>
              <Link to="/dashboard" className="btn-primary px-6 py-2.5 shadow-glow">
                Go to Dashboard
              </Link>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-gray-400 hover:text-white transition-colors font-medium px-4">
                Log In
              </Link>
              <Link to="/login" className="btn-primary px-6 py-2.5 shadow-glow group">
                Get Started <span className="inline-block transition-transform group-hover:translate-x-1 ml-1">→</span>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          
          <div className="animate-hero-reveal opacity-0 hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-gray-300 tracking-wider">NEW: AI-Powered Auto Routing</span>
          </div>

          <h1 className="animate-hero-reveal opacity-0 font-display text-5xl sm:text-7xl font-extrabold tracking-tight leading-[1.1] mb-8" style={{ animationDelay: '0.2s' }}>
             Task Management <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500 drop-shadow-sm">
              at the Speed of Thought
            </span>
          </h1>

          <p className="animate-hero-reveal opacity-0 text-lg sm:text-xl text-gray-400 mb-12 max-w-2xl leading-relaxed" style={{ animationDelay: '0.4s' }}>
            Experience frictionless productivity. Just dump your thoughts securely, and let Groq AI automatically categorize, prioritize, and structure your workload invisibly in the background.
          </p>

          <div className="animate-hero-reveal opacity-0 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto" style={{ animationDelay: '0.6s' }}>
            <Link to={user ? "/dashboard" : "/login"} className="w-full sm:w-auto btn-primary px-8 py-4 text-lg shadow-[0_0_40px_rgba(96,165,250,0.4)] hover:shadow-[0_0_60px_rgba(96,165,250,0.6)] group">
              {user ? "Enter Workspace" : "Start For Free"}
              <span className="inline-block ml-2 text-xl font-normal transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
            </Link>
          </div>
          
          {/* Trust/Social Proof Metric */}
          <div className="animate-hero-reveal opacity-0 mt-16 flex items-center gap-4 text-sm text-gray-500 font-medium" style={{ animationDelay: '0.8s' }}>
            <div className="flex -space-x-2">
              {[1,2,3,4].map(i => (
                <div key={i} className={`w-8 h-8 rounded-full border-2 border-bg-void bg-gradient-to-br flex items-center justify-center text-[10px] text-white/50 backdrop-blur-md
                  ${i===1 ? 'from-gray-700 to-gray-800' : 
                    i===2 ? 'from-gray-600 to-gray-700' : 
                    i===3 ? 'from-gray-800 to-gray-900' : 
                            'from-gray-700 to-black'}
                `}>
                  👤
                </div>
              ))}
            </div>
            <p>Join organized professionals worldwide.</p>
          </div>

        </div>
      </main>

      {/* Decorative footer line */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mt-auto" />
    </div>
  );
}
