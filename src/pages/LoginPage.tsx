import { LoginForm } from "@/components/LoginForm/LoginForm";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0 animate-pulse-glow opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-krutagidon-purple to-krutagidon-dark"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
