import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginPage() {
  const { login, register } = useAuth();
  const [mode, setMode]         = useState('login');
  const [form, setForm]         = useState({ name: '', email: '', password: '' });
  const [error, setError]       = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [focused, setFocused]   = useState('');

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setSubmitting(true);
    try {
      if (mode === 'login') await login(form.email, form.password);
      else await register(form.name, form.email, form.password);
    } catch (err) { setError(err.message); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="lp-root">

        {/* ── Left: brand panel ── */}
        <div className="lp-left animate-slide-left">
          <Link to="/" className="lp-wordmark animate-fade-in stagger-1">
            <div className="lp-mark">✦</div>
            <span className="lp-brand">TaskFlow</span>
          </Link>

          <div className="lp-hero">
            <div className="lp-hero-tag animate-fade-up stagger-2">AI-Powered Workspace</div>
            <h2 className="lp-hero-title animate-fade-up stagger-3">
              Work that<br /><em>thinks with you</em>
            </h2>
            <p className="lp-hero-sub animate-fade-up stagger-4">
              Intelligent task management that adapts to how your team actually works — not the other way around.
            </p>
          </div>

          <div className="lp-stats animate-fade-up stagger-5">
            {[['12k+', 'Teams active'], ['99.9%', 'Uptime SLA'], ['4.9★', 'User rating']].map(([num, label]) => (
              <div key={label}>
                <div className="lp-stat-num">{num}</div>
                <div className="lp-stat-label">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: form panel ── */}
        <div className="lp-right animate-fade-in">
          <div className="lp-form-wrap animate-fade-up stagger-2">
            <div className="lp-form-header">
              <h1 className="lp-form-title">
                {mode === 'login' ? 'Welcome back.' : 'Get started.'}
              </h1>
              <p className="lp-form-sub">
                {mode === 'login'
                  ? 'Sign in to your workspace to continue.'
                  : 'Create your account — it only takes a moment.'}
              </p>
            </div>

            {/* Tabs */}
            <div className="lp-tabs">
              {[['login', 'Sign In'], ['register', 'Create Account']].map(([m, label]) => (
                <button
                  key={m}
                  className={`lp-tab${mode === m ? ' active' : ''}`}
                  onClick={() => { setMode(m); setError(''); }}
                >
                  {label}
                </button>
              ))}
            </div>

            {error && (
              <div className="lp-error animate-fade-in">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="#9b2c2c" strokeWidth="1.5" />
                  <path d="M8 5v3.5M8 10.5v.5" stroke="#9b2c2c" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={submit}>
              <div className="lp-fields">
                {mode === 'register' && (
                  <Field label="Full Name" name="name" placeholder="Jane Doe"
                    value={form.name} onChange={handle} focused={focused} setFocused={setFocused} />
                )}
                <Field label="Email Address" name="email" type="email" placeholder="you@company.com"
                  value={form.email} onChange={handle} focused={focused} setFocused={setFocused} />
                <Field label="Password" name="password" type="password" placeholder="••••••••"
                  value={form.password} onChange={handle} focused={focused} setFocused={setFocused} minLength={6} />
              </div>

              <button type="submit" className="lp-submit" disabled={submitting}>
                {submitting
                  ? <><div className="lp-spinner" /> Authenticating…</>
                  : mode === 'login' ? 'Sign in to workspace' : 'Create my account'}
              </button>
            </form>

            {mode === 'login' && (
              <div className="lp-demo">
                <span className="lp-demo-key">Demo</span>
                demo@taskflow.com&nbsp;/&nbsp;demo1234
              </div>
            )}
          </div>
        </div>

      </div>
    );
  }

function Field({ label, name, type = 'text', placeholder, value, onChange, focused, setFocused, minLength }) {
  const isFocused = focused === name;
  return (
    <div className="lp-field">
      <label className={`lp-label${isFocused ? ' focused' : ''}`}>{label}</label>
      <input
        className="lp-input"
        name={name} type={type} placeholder={placeholder}
        value={value} onChange={onChange} required minLength={minLength}
        onFocus={() => setFocused(name)} onBlur={() => setFocused('')}
      />
    </div>
  );
}