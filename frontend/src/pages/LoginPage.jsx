// This page renders the login form centered on the screen
import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  return (
    // Full screen with light gray background
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* Render the login form */}
      <LoginForm />
    </div>
  );
}
