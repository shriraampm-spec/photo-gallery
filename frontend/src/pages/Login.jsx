import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axiosInstance.post('/api/auth/login', formData);
      login(response.data);
      navigate(location.state?.from?.pathname || '/gallery', { replace: true });
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-88px)] bg-[linear-gradient(135deg,_rgba(15,23,42,0.96),_rgba(30,41,59,0.92))] px-4 py-16">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <section className="text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-300">Welcome back</p>
          <h1 className="mt-5 max-w-2xl text-5xl font-semibold leading-tight">
            Sign in to your private photography workspace.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">
            Access your collection, upload new images, and manage every gallery entry from one protected dashboard.
          </p>
        </section>
        <form onSubmit={handleSubmit} className="rounded-[2rem] bg-white p-8 shadow-[0_40px_120px_-50px_rgba(15,23,42,0.65)]">
        <h1 className="text-3xl font-semibold text-slate-900">Login</h1>
        <p className="mt-2 text-sm text-slate-500">Use your registered account to open the gallery dashboard.</p>
        {error ? (
          <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
        ) : null}
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="mt-6 w-full rounded-2xl border border-slate-300 px-4 py-3"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="mt-4 w-full rounded-2xl border border-slate-300 px-4 py-3"
          required
        />
        <button type="submit" className="mt-6 w-full rounded-2xl bg-slate-900 p-3 font-semibold text-white transition hover:bg-slate-700">
          Login
        </button>
        <p className="mt-5 text-sm text-slate-500">
          Need an account?{' '}
          <Link to="/register" className="font-semibold text-amber-700 hover:text-amber-800">
            Create one here
          </Link>
        </p>
      </form>
      </div>
    </div>
  );
};

export default Login;
