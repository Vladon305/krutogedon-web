import { RegisterForm } from "@/components/RegisterForm/RegisterForm";

const RegisterPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0 animate-pulse-glow opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-krutagidon-purple to-krutagidon-dark"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
