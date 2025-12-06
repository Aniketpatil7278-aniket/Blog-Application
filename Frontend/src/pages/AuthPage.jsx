import React from "react";
import AuthForm from "../components/AuthForm";

export default function AuthPage() {
  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat relative flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1505483531331-40713c3e1b76?auto=format&fit=crop&w=1500&q=80')",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      {/* Auth Form Container */}
      <div className="relative z-10 animate-fadeIn w-full max-w-md">
        <AuthForm />
      </div>
    </div>
  );
}
