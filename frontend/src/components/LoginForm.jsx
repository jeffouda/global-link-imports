// LoginForm.jsx
// Handles user login with email/password
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ErrorMessage from "./ErrorMessage"; // displays error messages
// import BASE_URL from "../utils/api";
import { loginUser } from "../utils/mockApi";

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Submit login form
  const submit = async (e) => {
    e.preventDefault();
    setError("");

    console.log("Submitting:", { email, password });

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    try {
      // 1. Call the API
      const data = await loginUser({ email, password });
      // 2. Update Context
      login(data);
      // 3. Navigation
      console.log('Login success, navigating...');
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError("Invalid credentials");
      setPassword(""); // Clear password on error
    }
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
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* Password input */}
      <input
        className="border p-2 w-full mb-6"
        type="password"
        placeholder="Password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* Submit button */}
      <button className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded">
        Login
      </button>

      {/* Link to register */}
      <p className="text-center mt-4">
        Don't have an account?{" "}
        <Link to="/register" className="text-blue-600 hover:underline">
          Register here
        </Link>
      </p>
    </form>
  );
}
