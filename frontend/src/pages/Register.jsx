
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    password2: '',
  });

  const [otp, setOtp] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');
  const [otpStep, setOtpStep] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getErrorMessage = (err) => {
    const data = err.response?.data;

    if (!data) {
      return 'Something went wrong. Please try again.';
    }

    return Object.entries(data)
      .flatMap(([field, value]) =>
        (Array.isArray(value) ? value : [value]).map((message) =>
          typeof message === 'string'
            ? `${field === 'non_field_errors' ? '' : field + ': '}${message}`
            : ''
        )
      )
      .filter(Boolean)
      .join(' ');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.password2) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(
        '/accounts/register/',
        formData
      );

      setPendingEmail(response.data.email || formData.email);
      setOtpStep(true);

      setSuccess(
        'Registration successful! Please check your email for the OTP.'
      );
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!/^\d{6}$/.test(otp)) {
      setError('Please enter a valid 6-digit OTP.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(
        '/accounts/verify-email/',
        {
          email: pendingEmail,
          otp,
        }
      );

      setSuccess(
        response.data.message || 'Email verified successfully!'
      );

      setTimeout(() => {
        navigate('/login', {
          state: {
            message: 'Email verified successfully. Please login.',
          },
        });
      }, 1500);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await api.post(
        '/accounts/resend-otp/',
        {
          email: pendingEmail,
        }
      );

      setOtp('');
      setSuccess(
        response.data.message || 'A new OTP has been sent.'
      );
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-5 py-12">
      <div className="w-full max-w-lg rounded-2xl border border-[#eee2d9] bg-white p-8 shadow-sm">

        {!otpStep ? (
          <>
            <h1 className="mb-2 text-center font-serif text-3xl font-bold text-[#754b43]">
              Create Account
            </h1>

            <p className="mb-8 text-center text-sm text-[#94786d]">
              Join the Bloom & Grace family
            </p>

            {error && (
              <div className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="Choose a username"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  className="w-full rounded-lg border border-[#e5d5ca] px-4 py-3 outline-none focus:border-[#b77979]"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  autoComplete="tel"
                  className="w-full rounded-lg border border-[#e5d5ca] px-4 py-3 outline-none focus:border-[#b77979]"
                  placeholder="Enter your phone number"
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
                  autoComplete="new-password"
                  className="w-full rounded-lg border border-[#e5d5ca] px-4 py-3 outline-none focus:border-[#b77979]"
                  placeholder="Create a password"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="password2"
                  value={formData.password2}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                  className="w-full rounded-lg border border-[#e5d5ca] px-4 py-3 outline-none focus:border-[#b77979]"
                  placeholder="Confirm your password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[#754b43] py-3 font-medium text-white transition hover:bg-[#603c35] disabled:opacity-60"
              >
                {loading ? 'Creating Account...' : 'Register'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[#94786d]">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-[#b77979] hover:underline"
              >
                Login
              </Link>
            </p>
          </>
        ) : (
          <>
            <h1 className="mb-2 text-center font-serif text-3xl font-bold text-[#754b43]">
              Verify Your Email
            </h1>

            <p className="mb-3 text-center text-sm text-[#94786d]">
              We have sent a 6-digit verification code to:
            </p>

            <p className="mb-8 text-center font-semibold text-[#754b43]">
              {pendingEmail}
            </p>

            {error && (
              <div className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-5 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                {success}
              </div>
            )}

            <form onSubmit={handleVerifyOTP} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Enter 6-Digit OTP
                </label>

                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
                  }
                  required
                  className="w-full rounded-lg border border-[#e5d5ca] px-4 py-4 text-center text-2xl tracking-[0.5em] outline-none focus:border-[#b77979]"
                  placeholder="000000"
                />
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full rounded-lg bg-[#754b43] py-3 font-medium text-white transition hover:bg-[#603c35] disabled:opacity-60"
              >
                {loading ? 'Verifying...' : 'Verify Email'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="mb-3 text-sm text-[#94786d]">
                Didn't receive the OTP?
              </p>

              <button
                type="button"
                onClick={handleResendOTP}
                disabled={loading}
                className="font-semibold text-[#b77979] hover:underline disabled:opacity-50"
              >
                Resend OTP
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default Register;
