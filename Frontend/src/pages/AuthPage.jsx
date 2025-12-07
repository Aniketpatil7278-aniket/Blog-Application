import React from "react";
import AuthForm from "../components/AuthForm";

export default function AuthPage() {
  return (
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center">

      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 animate-gradient-xy"></div>

      {/* Soft Glow Orbs */}
      <div className="absolute w-72 h-72 bg-white/20 blur-[120px] rounded-full top-10 left-10"></div>
      <div className="absolute w-96 h-96 bg-yellow-300/20 blur-[150px] rounded-full bottom-10 right-10"></div>

      {/* Center Card */}
      <div className="relative z-10 w-full max-w-md p-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 animate-fadeIn">
          <AuthForm />
        </div>
      </div>
    </div>
  );
}
