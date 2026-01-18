// This page renders the registration form in a centered card layout
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });
  const [error, setError] = useState("");

  // Submit registration
  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: form.name, email: form.email, password: form.password, role: form.role })
      });
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || errorData.error || 'Registration failed');
        return;
      }
      alert("Account created! Please login");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError('An error occurred during registration');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">GlobalLink Imports</h1>
          <p className="text-gray-600">Your trusted logistics partner</p>
        </div>

        {/* Toggle */}
        <div className="bg-gray-100 rounded-lg p-1 mb-6 flex">
          <Link
            to="/login"
            className="flex-1 text-center py-2 px-4 rounded-md text-gray-600 hover:text-gray-900 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="flex-1 text-center py-2 px-4 rounded-md bg-slate-900 text-white font-medium transition"
          >
            Sign Up
          </Link>
        </div>

        {/* Form */}
        <form onSubmit={submit}>
          <div className="mb-4 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
              </svg>
            </div>
            <input
              className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Name"
              required
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="mb-4 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
              </svg>
            </div>
            <input
              className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              type="email"
              placeholder="Email"
              required
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="mb-4 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
              </svg>
            </div>
            <input
              className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              type="password"
              placeholder="Password"
              required
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <div className="mb-6">
            <select
              className="w-full py-3 px-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="customer">Customer</option>
              <option value="driver">Driver</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center"
          >
            Create Account
            <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500">
          By signing up, you agree to our{' '}
          <a href="#" className="text-teal-500 hover:underline">Terms of Service</a>{' '}
          and{' '}
          <a href="#" className="text-teal-500 hover:underline">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
}
