import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", form);
      login(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="animated-bg min-h-screen flex items-center justify-center relative overflow-hidden px-4">

      {/* 🌟 Floating Blurred Orbs */}
      <div className="blur-orb bg-pink-500 opacity-30 -top-16 -left-20"></div>
      <div className="blur-orb bg-blue-500 opacity-30 bottom-0 right-0 animation-delay-3000"></div>

      {/* 💎 Glassmorphism Login Card */}
      <div className="glass-card w-full max-w-md p-10 relative z-10 shadow-2xl text-white">

        <h2 className="text-3xl font-bold text-center mb-2 drop-shadow-lg">
          Welcome Back ✨
        </h2>

        <p className="text-center text-white/70 text-sm mb-6">
          Continue collaborating in real-time.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-white/90">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-1 w-full p-3 rounded bg-white/20 text-white placeholder-white/60 
              outline-none focus:ring-2 focus:ring-white/60"
              placeholder="Enter email"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-white/90">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              className="mt-1 w-full p-3 rounded bg-white/20 text-white placeholder-white/60 
              outline-none focus:ring-2 focus:ring-white/60"
              placeholder="Enter password"
            />
          </div>

          {error && (
            <div className="text-xs text-red-300 mt-1">{error}</div>
          )}

          <button
            type="submit"
            className="w-full bg-white/30 hover:bg-white/50 text-white font-semibold
            p-3 rounded-lg transition-all shadow-md hover:shadow-xl"
          >
            Login
          </button>
        </form>

        <p className="text-center text-white/70 text-sm mt-6">
          No account?{" "}
          <Link to="/register" className="text-white font-semibold underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
