import React from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/LoginForm";
import { cn } from "@/lib/utils";

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = async (values: { email: string }) => {
    try {
      // In a real implementation, this would use Supabase Auth with Magic Links
      // For example:
      // const { error } = await supabase.auth.signInWithOtp({
      //   email: values.email,
      //   options: {
      //     emailRedirectTo: `${window.location.origin}/dashboard`,
      //   },
      // });
      //
      // if (error) throw error;

      // For demo purposes, we'll just simulate a successful login
      console.log("Magic link would be sent to:", values.email);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In a real app, we wouldn't navigate here - the user would click the magic link in their email
      // This is just for demonstration purposes
      // setTimeout(() => navigate('/dashboard'), 3000);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md mb-8 text-center">
        <img src="/logo.svg" alt="Logo" className="h-16 mx-auto mb-4" />
        <p className="text-gray-600">
          Mitarbeiterbereich - Bitte melden Sie sich an
        </p>
      </div>

      <LoginForm onSubmit={handleLogin} className={cn("w-full max-w-md")} />

      <div className="mt-8 text-center">
        <button
          onClick={() => navigate("/")}
          className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
        >
          Zurück zur Startseite
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
