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

  const [isForgot, setIsForgot] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const redirectByRole = (role) => {
    if (role === "admin") return "/admin/dashboard";
    if (role === "lawyer") return "/lawyer/dashboard";
    if (role === "client") return "/profile";
    return "/dashboard";
  };

  // ================= LOGIN =================
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);

    try {
      const data = await login(cleanEmail, password);

      if (!data) throw new Error("No response from server.");
      if (data.error) throw new Error(data.error);
      if (!data.token) throw new Error("Login failed: token not received.");

      if (loginType === "client" && data.role === "lawyer") {
        throw new Error("You selected Client login, but this account is a Lawyer.");
      }

      if (loginType === "lawyer" && data.role === "client") {
        throw new Error("You selected Lawyer login, but this account is a Client.");
      }

      keepLoggedIn(data);

      navigate(redirectByRole(data.role));
    } catch (err) {
      setError(err?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  // ================= FORGOT PASSWORD =================
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError("Please enter your email.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: cleanEmail })
      });

      const data = await res.json();

      if (data.error) {
        setMessage("")
        setError(data.error)
      }
      else {
        setMessage(data.message);
        setError("");
        // alert(data.message);

      }


    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f4ff]">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 sm:p-10">

        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-[#142768] mb-2">
            {isForgot ? "Reset Password" : "Welcome Back"}
          </h2>
          <p className="text-gray-600">
            {isForgot ? "Enter your email to reset password" : "Sign in to your account"}
          </p>
        </div>

        {/* LOGIN TYPE TOGGLE */}
        {!isForgot && (
          <div className="flex bg-[#e6eafc] rounded-xl overflow-hidden mb-6">
            {["client", "lawyer"].map((type) => (
              <button
                type="button"
                key={type}
                onClick={() => setLoginType(type)}
                className={`flex-1 py-2 text-sm font-medium transition-all ${loginType === type
                    ? "bg-[#142768] text-white shadow-md"
                    : "text-[#142768]/70 hover:text-[#142768]"
                  }`}
              >
                {type === "client" ? "👤 Client" : "⚖️ Lawyer"}
              </button>
            ))}
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* SUCCESS MESSAGE */}
        {message && (
          <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {/* FORM */}
        <form
          className="space-y-5"
          onSubmit={isForgot ? handleForgotPassword : handleLogin}
        >
          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* PASSWORD (ONLY LOGIN) */}
          {!isForgot && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-900"
                >
                  {showPassword ? <GrHide /> : <BiSolidShow />}
                </button>
              </div>
            </div>
          )}

          {/* FORGOT / BACK */}
          <div className="flex justify-between text-sm">
            {!isForgot ? (
              <button
                type="button"
                className="text-[#142768] hover:underline"
                onClick={() => {
                  setIsForgot(true);
                  setError("");
                  setMessage("");
                }}
              >
                Forgot password?
              </button>
            ) : (
              <button
                type="button"
                className="text-[#142768] hover:underline"
                onClick={() => {
                  setIsForgot(false);
                  setError("");
                  setMessage("");
                }}
              >
                Back to login
              </button>
            )}
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className={`w-full py-3 text-white font-semibold rounded-xl ${loading ? "bg-gray-400" : "bg-[#142768] hover:bg-blue-900"
              }`}
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : isForgot
                ? "Send Reset Link"
                : "Sign In"}
          </button>
        </form>

        {!isForgot && (
          <p className="text-center text-gray-600 mt-6">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-[#142768] font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;