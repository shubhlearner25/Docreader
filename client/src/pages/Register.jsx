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
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-md">
        <h2 className="text-xl font-semibold text-slate-900">Create account</h2>
        <p className="mt-1 text-sm text-slate-500">
          Start creating and sharing real-time documents.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-600">
              Username
            </label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">
              Password
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
            />
          </div>
          {error && (
            <div className="text-xs text-red-500">{error}</div>
          )}
          <button
            type="submit"
            className="mt-2 w-full rounded-lg bg-slate-900 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-slate-900 underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
