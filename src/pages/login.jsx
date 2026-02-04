import React, { useState } from "react";
import { BiSolidShow } from "react-icons/bi";
import { GrHide } from "react-icons/gr";
import { Link, useNavigate } from "react-router-dom";
import { keepLoggedIn, login } from "../api/userApi";

const Login = () => {
  const [loginType, setLoginType] = useState("client");
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const redirectByRole = (role) => {
    if (role === "admin") return "/admin/dashboard";
    if (role === "lawyer") return "/lawyer/dashboard";
    if (role === "client") return "/profile";
    return "/dashboard";
  };

  const handleLogin = async (e) => {
  e.preventDefault();
  setError("");

  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail || !password) {
    setError("Please enter email and password.");
    return;
  }

  setLoading(true);

  try {
    const data = await login(cleanEmail, password);

    if (!data) {
      throw new Error("No response from server.");
    }

    if (data.error) {
      throw new Error(data.error);
    }

    if (!data.token) {
      throw new Error("Login failed: token not received.");
    }

    // Enforce selected type for UI toggle (client/lawyer)
    if (loginType === "client" && data.role === "lawyer") {
      throw new Error("You selected Client login, but this account is a Lawyer.");
    }

    if (loginType === "lawyer" && data.role === "client") {
      throw new Error("You selected Lawyer login, but this account is a Client.");
    }

    keepLoggedIn(data);

    if (data.role === "admin") {
      navigate("/admin/dashboard");
    } else if (data.role === "lawyer") {
      navigate("/lawyer/dashboard");
    } else {
      navigate("/profile");
    }
  } catch (err) {
    setError(err?.message || "Login failed.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f4ff]">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 sm:p-10">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-[#142768] mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <div className="flex bg-[#e6eafc] rounded-xl overflow-hidden mb-6">
          {["client", "lawyer"].map((type) => (
            <button
              type="button"
              key={type}
              onClick={() => setLoginType(type)}
              className={`flex-1 py-2 text-sm font-medium transition-all ${
                loginType === type
                  ? "bg-[#142768] text-white shadow-md"
                  : "text-[#142768]/70 hover:text-[#142768]"
              }`}
            >
              {type === "client" ? "👤 Client" : "⚖️ Lawyer"}
            </button>
          ))}
        </div>

        {error ? (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <form className="space-y-5" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-900 hover:text-gray-800"
                disabled={loading}
              >
                {showPassword ? <GrHide className="w-4 h-4" /> : <BiSolidShow className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                className="w-4 h-4 text-[#142768] border-gray-300 rounded focus:ring-[#142768]"
                disabled={loading}
              />
              Remember me
            </label>
            <button
              type="button"
              className="text-[#142768] hover:underline font-medium"
              disabled={loading}
              onClick={() => setError("Forgot password is not implemented yet.")}
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className={`w-full py-3 text-white font-semibold rounded-xl transition-all flex justify-center items-center gap-2 ${
              loading ? "bg-[#142768]/70 cursor-not-allowed" : "bg-[#142768] hover:bg-blue-900"
            }`}
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-[#142768] font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
