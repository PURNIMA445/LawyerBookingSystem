import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/auth/verify-email/${token}`
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Verification failed");
        }

        setStatus("success");
        setMessage("Email verified successfully 🎉");

        // redirect after success
        setTimeout(() => {
          navigate("/");
        }, 2500);

      } catch (err) {
        setStatus("error");
        setMessage(err.message || "Invalid or expired verification link");
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f4ff] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">

        {/* ICON */}
        <div className="flex justify-center mb-6">
          {status === "loading" && (
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          )}
          {status === "success" && (
            <CheckCircle className="w-14 h-14 text-green-500" />
          )}
          {status === "error" && (
            <XCircle className="w-14 h-14 text-red-500" />
          )}
        </div>

        {/* TITLE */}
        <h2 className="text-2xl font-bold text-[#142768] mb-3">
          {status === "loading" && "Verifying..."}
          {status === "success" && "Verified"}
          {status === "error" && "Verification Failed"}
        </h2>

        {/* MESSAGE */}
        <p className="text-gray-600 mb-6">{message}</p>

        {/* ACTION BUTTONS */}
        {status === "error" && (
          <button
            onClick={() => navigate("/")}
            className="w-full py-3 bg-[#142768] text-white rounded-xl hover:bg-blue-900 transition"
          >
            Back to Home
          </button>
        )}

        {status === "success" && (
          <button
            onClick={() => navigate("/")}
            className="w-full py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition"
          >
            Go to Login
          </button>
        )}

      </div>
    </div>
  );
};

export default VerifyEmail;