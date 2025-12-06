import React, { useState } from "react";
import api from "../api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function AuthForm() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (mode === "register") {
        await api.post("/api/register", { username, email, password });
        toast.success("Registered — please log in");
        setMode("login");
        setPassword("");
      } else {
        const res = await api.post("/api/login", { email, password });
        const token = res.data.token;
        if (!token) throw new Error("No token returned");
        localStorage.setItem("token", token);
        toast.success("Logged in");
        navigate("/");
        window.location.reload();
      }
    } catch (err) {
      toast.error(err?.response?.data?.error || "Auth failed");
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center  relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #ff4d4d, #b31217, #7a0408)",
      }}
    >

      {/* Decorative floating circles */}
      <div className="absolute -top-10 -left-10 w-60 h-60 bg-white/10 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-black/20 rounded-full blur-3xl opacity-30"></div>

      {/* Glass Card */}
      <div className="relative z-10 w-full max-w-sm p-10 rounded-2xl shadow-2xl bg-white/10 backdrop-blur-xl border border-white/20">

        {/* Icon */}
        <div className="flex justify-center mb-5">
          <div className="p-4 bg-yellow-500 rounded-full shadow-xl">
            <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" viewBox="0 0 24 24" className="w-8 h-8">
              <path d="M12 5c-3.86 0-7 3.14-7 7s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm0-3c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm-1 5h2v2h-2V7zm0 4h2v6h-2v-6z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-center text-white text-3xl font-bold drop-shadow mb-6">
          My Blog 
        </h2>

        {/* Form */}
        <form onSubmit={submit} className="space-y-4">
          {mode === "register" && (
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Username"
              className="w-full px-4 py-3 rounded-full bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none"
            />
          )}

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email"
            className="w-full px-4 py-3 rounded-full bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
            className="w-full px-4 py-3 rounded-full bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none"
          />

          <button
            type="submit"
            className="w-full py-3 rounded-full bg-yellow-400 text-red-800 font-bold shadow-lg hover:bg-yellow-300 transition active:scale-95"
          >
            {mode === "login" ? "Continue" : "Create Account"}
          </button>
        </form>

        {/* Switch mode */}
        <div className="mt-5 text-center text-white">
          {mode === "login" ? (
            <p>
              Not a Member?
              <button
                onClick={() => setMode("register")}
                className="font-semibold underline ml-1 hover:text-yellow-300"
              >
                Sign up now
              </button>
            </p>
          ) : (
            <p>
              Already have an account?
              <button
                onClick={() => setMode("login")}
                className="font-semibold underline ml-1 hover:text-yellow-300"
              >
                Login
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
