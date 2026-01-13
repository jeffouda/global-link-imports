// This page renders the registration form centered on the screen
import RegisterForm from "../components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* Render the registration form */}
      <RegisterForm />
    </div>
  );
}
