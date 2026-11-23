import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api('/auth/signup', { method: 'POST', body: form });
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-box">
      <h1>Sweety</h1>
      <h2>Create account</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input name="password" type="password" placeholder="Password (min 6 characters)" value={form.password} onChange={handleChange} />
        {error && <p className="error">{error}</p>}
        <button type="submit">Sign up</button>
      </form>
      <p>Already have an account? <Link to="/login">Log in</Link></p>
    </div>
  );
}