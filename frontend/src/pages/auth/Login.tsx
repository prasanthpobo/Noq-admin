import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@noq.health');
  const [password, setPassword] = useState('admin123');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F5F8FC]">
      {/* Left brand panel */}
      <div className="hidden lg:flex flex-col justify-between w-[480px] brand-gradient p-12 text-white flex-shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <span className="text-white font-black text-xl">N</span>
            </div>
            <div>
              <div className="font-black text-2xl leading-none">NoQ</div>
              <div className="text-white/60 text-xs font-semibold uppercase tracking-widest mt-1">Clinic Admin</div>
            </div>
          </div>
          <h1 className="text-4xl font-black leading-tight mb-4">
            Manage your clinic<br />with ease.
          </h1>
          <p className="text-white/70 text-base leading-relaxed">
            Token booking, patient management, billing, pharmacy, lab reports — all in one place.
          </p>
        </div>
        <div className="space-y-3">
          {['1,284 patients managed', '184 tokens today', '14 doctors active', '₹86,400 revenue today'].map(s => (
            <div key={s} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#1FA3A8]" />
              <span className="text-sm font-medium">{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl brand-gradient flex items-center justify-center">
              <span className="text-white font-black">N</span>
            </div>
            <span className="font-black text-[#1E4FA3] text-xl">NoQ</span>
          </div>

          <h2 className="text-2xl font-black text-[#1A1A1A] mb-1">Sign in</h2>
          <p className="text-sm text-[#6B7C93] mb-8">Access your clinic admin dashboard</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">{error}</div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7C93] mb-1.5">Email</label>
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-[#E3EAF2] rounded-xl text-sm bg-white text-[#1A1A1A] placeholder-[#A0AEC0] transition-shadow"
                placeholder="admin@noq.health"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7C93] mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-[#E3EAF2] rounded-xl text-sm bg-white text-[#1A1A1A] pr-11 transition-shadow"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A0AEC0] hover:text-[#6B7C93]">
                  {showPw ? <HiEyeOff size={18} /> : <HiEye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl text-white font-semibold brand-gradient shadow-lg hover:opacity-90 transition-opacity disabled:opacity-60 mt-2">
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="text-xs text-[#A0AEC0] text-center mt-6">
            Demo: admin@noq.health / admin123
          </p>
        </div>
      </div>
    </div>
  );
};
