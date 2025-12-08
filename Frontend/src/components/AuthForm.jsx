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
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-red-500">

      {/* Floating circles */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-white/20 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-10 right-10 w-52 h-52 bg-black/20 rounded-full blur-3xl opacity-20"></div>

      {/* CARD */}
      <div className="relative z-10 w-full max-w-md p-8 rounded-2xl shadow-2xl bg-white/10 backdrop-blur-xl border border-white/20">

        {/* Header + Icon */}
        <div className="flex flex-col items-center mb-6">
          <div className="p-4 bg-yellow-400 rounded-full shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" fill="#7a0408" className="w-7 h-7" viewBox="0 0 24 24">
              <path d="M12 5c-3.86 0-7 3.14-7 7s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm0-3c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm-1 5h2v2h-2V7zm0 4h2v6h-2v-6z"/>
            </svg>
          </div>

          <h2 className="text-white text-3xl font-extrabold mt-3 drop-shadow">
            Welcome To My
          </h2>
          <h2 className="text-white text-3xl font-extrabold mt-3 drop-shadow">
            Blog
          </h2>
        </div>

        <form onSubmit={submit} className="space-y-4">

          {/* Username field (register mode) */}
          {mode === "register" && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/70 border border-white/30 outline-none focus:ring-2 focus:ring-yellow-300"
            />
          )}

          {/* Email */}
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/70 border border-white/30 outline-none focus:ring-2 focus:ring-yellow-300"
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/70 border border-white/30 outline-none focus:ring-2 focus:ring-yellow-300"
          />

          {/* Button */}
          <button
            type="submit"
            className="w-full py-3 bg-yellow-400 text-red-800 font-bold rounded-lg shadow-md hover:bg-yellow-300 transition-all active:scale-95"
          >
            {mode === "login" ? "Login" : "Create Account"}
          </button>
        </form>

        {/* Switch mode */}
        <p className="text-center text-white mt-5">
          {mode === "login" ? (
            <>
              Don't have an account?
              <button
                onClick={() => setMode("register")}
                className="ml-1 underline font-semibold hover:text-yellow-300"
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?
              <button
                onClick={() => setMode("login")}
                className="ml-1 underline font-semibold hover:text-yellow-300"
              >
                Login
              </button>
            </>
          )}
        </p>

      </div>
    </div>
  );
}
