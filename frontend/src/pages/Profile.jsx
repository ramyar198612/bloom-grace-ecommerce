
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Profile() {
  const navigate = useNavigate();
  const { user, loading, updateProfile, logout } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setSaving(true);

    try {
      await updateProfile(formData);
      setMessage('Profile updated successfully.');
    } catch (err) {
      setError(
        err.response?.data?.email?.[0] ||
        'Unable to update profile. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', {
        state: { message: 'You have logged out successfully.' },
      });
    } catch {
      setError('Logout failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        Loading your profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="px-5 py-20 text-center">
        <h1 className="mb-4 font-serif text-2xl font-bold text-[#754b43]">
          Please Login
        </h1>
        <p className="mb-6 text-[#94786d]">
          Login to view your customer profile.
        </p>
        <Link
          to="/login"
          className="rounded-lg bg-[#754b43] px-6 py-3 text-white"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] px-5 py-12">
      <div className="mx-auto max-w-xl rounded-2xl border border-[#eee2d9] bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-center font-serif text-3xl font-bold text-[#754b43]">
          My Profile
        </h1>

        <p className="mb-8 text-center text-sm text-[#94786d]">
          Manage your Bloom & Grace account
        </p>

        {message && (
          <div className="mb-5 rounded-lg bg-green-50 p-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="mb-6 rounded-lg bg-[#fffaf6] p-4">
          <p className="text-sm text-[#94786d]">Username</p>
          <p className="font-semibold">{user.username}</p>

          <p className="mt-3 text-sm text-[#94786d]">Account Type</p>
          <p className="font-semibold">{user.role}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-[#e5d5ca] px-4 py-3 outline-none focus:border-[#b77979]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-lg border border-[#e5d5ca] px-4 py-3 outline-none focus:border-[#b77979]"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-lg bg-[#754b43] py-3 font-medium text-white hover:bg-[#603c35] disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Update Profile'}
          </button>
        </form>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-4 w-full rounded-lg border border-[#b77979] py-3 font-medium text-[#754b43] hover:bg-[#fffaf6]"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;
