// RegisterForm.jsx
// Handles user registration with name/email/password and role selection
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ErrorMessage from "./ErrorMessage";


export default function RegisterForm() {
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
        body: JSON.stringify({ ...form, username: form.name })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
      alert("Account created! Please login");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={submit} className="bg-white p-8 rounded shadow w-96">
      <h2 className="text-2xl font-bold mb-6 text-center text-green-600">Register</h2>

      {/* Display error message */}
      <ErrorMessage message={error} />

      {/* Name */}
      <input
        className="border p-2 w-full mb-3"
        placeholder="Name"
        required
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      {/* Email */}
      <input
        className="border p-2 w-full mb-3"
        type="email"
        placeholder="Email"
        required
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      {/* Password */}
      <input
        className="border p-2 w-full mb-3"
        type="password"
        placeholder="Password"
        required
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      {/* Role select */}
      <select
        className="border p-2 w-full mb-6"
        value={form.role}
        onChange={(e) => setForm({ ...form, role: e.target.value })}
      >
        <option value="customer">Customer</option>
        <option value="driver">Driver</option>
        <option value="admin">Admin</option>
      </select>

      {/* Submit button */}
      <button className="bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded">
        Create Account
      </button>

      {/* Link to login */}
      <p className="text-center mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-green-600 hover:underline">
          Login here
        </Link>
      </p>
    </form>
  );
}
