import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/register", form);
      login(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Register failed");
    }
  };

  return (
    <div className="animated-bg min-h-screen flex items-center justify-center relative overflow-hidden px-4">

      {/* 🌟 Floating Blur Orbs */}
      <div className="blur-orb bg-purple-500 opacity-30 -top-16 -left-20"></div>
      <div className="blur-orb bg-blue-500 opacity-30 bottom-0 right-0 animation-delay-3000"></div>

      {/* 🔥 Glassmorphism Register Card */}
      <div className="glass-card w-full max-w-md p-10 relative z-10 shadow-2xl text-white">

        <h2 className="text-3xl font-bold text-center mb-2 drop-shadow-lg">
          Create Account 🚀
        </h2>

        <p className="text-center text-white/70 text-sm mb-6">
          Start creating and collaborating in real-time.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="text-sm font-medium text-white/90">Username</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              className="mt-1 w-full p-3 rounded bg-white/20 text-white placeholder-white/60 
              outline-none focus:ring-2 focus:ring-white/60"
              placeholder="Choose a username"
            />
          </div>

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
            Register
          </button>

        </form>

        <p className="text-center text-white/70 text-sm mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-white font-semibold underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;
