
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData);

      // Redirect customer to Home Page after successful login
      navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.error ||
        'Login failed. Please check your details.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-5 py-12">
      <div className="w-full max-w-md rounded-2xl border border-[#eee2d9] bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-center font-serif text-3xl font-bold text-[#754b43]">
          Welcome Back
        </h1>

        <p className="mb-8 text-center text-sm text-[#94786d]">
          Login to your Bloom & Grace account
        </p>

        {error && (
          <div className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              autoComplete="username"
              className="w-full rounded-lg border border-[#e5d5ca] px-4 py-3 outline-none focus:border-[#b77979]"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-[#e5d5ca] px-4 py-3 outline-none focus:border-[#b77979]"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#754b43] py-3 font-medium text-white transition hover:bg-[#603c35] disabled:opacity-60"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#94786d]">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-semibold text-[#b77979] hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
