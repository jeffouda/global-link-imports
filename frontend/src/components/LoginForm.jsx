// LoginForm.jsx
// Handles user login with email/password
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "./ErrorMessage"; // displays error messages


export default function LoginForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  // Submit login form
  const submit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Login failed");
      return;
    }

    // Save JWT and user info in localStorage
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("role", data.role);
    localStorage.setItem("username", data.username);

    navigate("/dashboard"); // redirect to dashboard
  };

  return (
    <form onSubmit={submit} className="bg-white p-8 rounded shadow w-96">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Login</h2>

      {/* Display error message */}
      <ErrorMessage message={error} />

      {/* Email input */}
      <input
        className="border p-2 w-full mb-4"
        type="email"
        placeholder="Email"
        required
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      {/* Password input */}
      <input
        className="border p-2 w-full mb-6"
        type="password"
        placeholder="Password"
        required
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      {/* Submit button */}
      <button className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded">
        Login
      </button>
    </form>
  );
}
