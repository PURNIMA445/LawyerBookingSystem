// Login.jsx
import React, { useState } from 'react';
import { BiSolidShow } from "react-icons/bi";
import { GrHide } from "react-icons/gr";
import { Link } from 'react-router-dom';
const Login = () => {
  const [loginType, setLoginType] = useState('client');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f4ff]">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 sm:p-10">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-[#142768] mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {/* Login Type */}
        <div className="flex bg-[#e6eafc] rounded-xl overflow-hidden mb-6">
          {['client', 'lawyer'].map((type) => (
            <button
              key={type}
              onClick={() => setLoginType(type)}
              className={`flex-1 py-2 text-sm font-medium transition-all
                ${loginType === type 
                  ? 'bg-[#142768] text-white shadow-md' 
                  : 'text-[#142768]/70 hover:text-[#142768]'}`}
            >
              {type === 'client' ? '👤 Client' : '⚖️ Lawyer'}
            </button>
          ))}
        </div>

        {/* Form */}
        <form className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-900 hover:text-gray-800"
              >
                {showPassword ? <GrHide className='w-3'/> : <BiSolidShow />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 text-[#142768] border-gray-300 rounded focus:ring-[#142768]" />
              Remember me
            </label>
            <a href="#" className="text-[#142768] hover:underline font-medium">Forgot password?</a>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#142768] text-white font-semibold rounded-xl hover:bg-blue-900 transition-all flex justify-center items-center gap-2"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{' '}
          <Link to='/signup' className="text-[#142768] font-semibold hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
