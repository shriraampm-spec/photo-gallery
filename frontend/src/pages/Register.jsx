import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axiosInstance.post('/api/auth/register', formData);
      navigate('/login');
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-88px)] bg-[linear-gradient(180deg,_#fff7ed_0%,_#f8fafc_35%,_#e2e8f0_100%)] px-4 py-16">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-700">Create account</p>
          <h1 className="mt-5 max-w-2xl text-5xl font-semibold leading-tight text-slate-900">
            Set up your photo gallery profile in a few fields.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
            Registration unlocks your own private gallery records, protected API access, and profile management.
          </p>
        </section>
      <form onSubmit={handleSubmit} className="rounded-[2rem] bg-white p-8 shadow-[0_40px_120px_-50px_rgba(15,23,42,0.45)]">
        <h1 className="text-3xl font-semibold text-slate-900">Register</h1>
        <p className="mt-2 text-sm text-slate-500">Create a user before logging in to the gallery.</p>
        {error ? (
          <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
        ) : null}
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-6 w-full rounded-2xl border border-slate-300 px-4 py-3"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="mt-4 w-full rounded-2xl border border-slate-300 px-4 py-3"
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
        <button type="submit" className="mt-6 w-full rounded-2xl bg-amber-400 p-3 font-semibold text-slate-900 transition hover:bg-amber-300">
          Register
        </button>
        <p className="mt-5 text-sm text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-slate-900 hover:text-slate-700">
            Sign in
          </Link>
        </p>
      </form>
      </div>
    </div>
  );
};

export default Register;
