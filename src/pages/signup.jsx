// SignUp.jsx
import React, { useState } from "react";
import { registerUser } from "../api/userApi";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const [formData, setFormData] = useState({
    // Common fields
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,

    // Lawyer fields (backend-aligned)
    specialization: [],
    yearsOfExperience: "", // ✅ numeric
    hourlyRate: "", // ✅ NEW (Rs.)
    bio: "", // ✅ NEW
    licenseDocument: null,

    // Admin specific (UI-only)
    adminCode: "",
    department: "",

    // Client specific (UI-only)
    dateOfBirth: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const navigate = useNavigate();

  const userTypes = [
    {
      id: "client",
      title: "Client",
      icon: "👤",
      description: "Book consultations and manage your legal matters",
      color: "indigo-900",
      bgLight: "bg-indigo-50",
      textColor: "text-indigo-600",
      borderColor: "border-indigo-500",
    },
    {
      id: "lawyer",
      title: "Lawyer",
      icon: "⚖️",
      description: "Offer your legal services and manage appointments",
      color: "indigo-900",
      bgLight: "bg-indigo-50",
      textColor: "text-indigo-600",
      borderColor: "border-indigo-500",
    },
    {
      id: "admin",
      title: "Admin",
      icon: "🛡️",
      description: "Manage platform operations and user accounts",
      color: "indigo-900",
      bgLight: "bg-indigo-50",
      textColor: "text-indigo-600",
      borderColor: "border-indigo-500",
    },
  ];

  // Lawyer specializations
  const specializations = [
    "Corporate & Company Law",
    "Family & Divorce Law",
    "Criminal Defense",
    "Land & Property Law",
    "Labor & Employment Law",
    "Tax & Compliance",
    "Immigration & Travel",
    "Banking & Finance",
    "Civil Litigation",
    "Consumer Protection",
    "Cyber & Tech Law",
    "Legal Documentation",
  ];

  // Admin departments (UI-only)
  const departments = [
    "User Management",
    "Lawyer Verification",
    "Support & Help Desk",
    "Finance & Billing",
    "Platform Operations",
    "Content Management",
  ];

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files?.[0] || null }));
    } else if (type === "checkbox" && name === "specialization") {
      setFormData((prev) => ({
        ...prev,
        specialization: checked
          ? [...prev.specialization, value]
          : prev.specialization.filter((s) => s !== value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (submitError) setSubmitError("");
  };

  // STEP 2 VALIDATION
  const validateStep2 = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phone) newErrors.phone = "Phone number is required";

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // STEP 3 VALIDATION
  const validateStep3 = () => {
    const newErrors = {};

    if (userType === "lawyer") {
      if (formData.specialization.length === 0) {
        newErrors.specialization = "Select at least one specialization";
      }

      if (!String(formData.yearsOfExperience).trim()) {
        newErrors.yearsOfExperience = "Experience is required";
      } else {
        const n = Number(formData.yearsOfExperience);
        if (!Number.isFinite(n) || n < 0 || n > 50) {
          newErrors.yearsOfExperience = "Experience must be a number between 0 and 50";
        }
      }

      if (String(formData.hourlyRate).trim()) {
        const r = Number(formData.hourlyRate);
        if (!Number.isFinite(r) || r < 0) newErrors.hourlyRate = "Hourly rate must be a valid number";
      }

      if (String(formData.bio || "").length > 1000) {
        newErrors.bio = "Bio is too long (max 1000 characters)";
      }
    }

    if (!formData.agreeTerms) newErrors.agreeTerms = "You must agree to the terms";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && userType) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleBack = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep3()) return;

    setIsLoading(true);
    setSubmitError("");

    const fullName = `${formData.firstName} ${formData.lastName}`.trim();

    const payload = {
      userType,
      role: userType,
      full_name: fullName,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
    };

    // NOTE: Backend currently stores lawyer fields in lawyers table (specialization, experience_years, hourly_rate, bio, license_document)
    if (userType === "lawyer") {
      Object.assign(payload, {
        specialization: formData.specialization,
        experience_years: Number(formData.yearsOfExperience),
        hourly_rate: String(formData.hourlyRate).trim() ? Number(formData.hourlyRate) : null,
        bio: String(formData.bio || "").trim() ? formData.bio : null,
      });
    }

    // Client/Admin extra fields are UI-only unless your backend supports them
    if (userType === "client") {
      Object.assign(payload, {
        dateOfBirth: formData.dateOfBirth,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
      });
    }

    if (userType === "admin") {
      Object.assign(payload, {
        adminCode: formData.adminCode,
        department: formData.department,
      });
    }

    try {
      const data = await registerUser(
        payload,
        userType === "lawyer" ? formData.licenseDocument : null
      );

      // Persist auth
      localStorage.setItem("auth", JSON.stringify(data));

      navigate("/profile");
    } catch (err) {
      console.error(err);
      setSubmitError(err?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedType = userTypes.find((t) => t.id === userType);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full lg:w-7/12 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-linear-to-br from-slate-50 via-white to-indigo-50 overflow-y-auto">
        <div className="w-full max-w-full">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-900 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">Hire Lawyer</span>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {[1, 2, 3].map((s) => (
                <React.Fragment key={s}>
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm transition-all duration-300 ${
                      step >= s ? "bg-[#142768] text-white" : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step > s ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      s
                    )}
                  </div>
                  {s < 3 && (
                    <div
                      className={`flex-1 h-1 mx-2 rounded-full transition-all duration-300 ${
                        step > s ? "bg-[#142768]" : "bg-gray-200"
                      }`}
                    ></div>
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Account Type</span>
              <span>Basic Info</span>
              <span>Details</span>
            </div>
          </div>

          {/* Step 1: Select User Type */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
                <p className="text-gray-600">Select your account type to get started</p>
              </div>

              <div className="grid gap-4">
                {userTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setUserType(type.id)}
                    className={`relative p-6 rounded-2xl border-2 text-left transition-all duration-300 group ${
                      userType === type.id
                        ? `${type.borderColor} ${type.bgLight} shadow-lg`
                        : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${
                          userType === type.id
                            ? `bg-linear-to-r ${type.color} shadow-lg`
                            : "bg-gray-100 group-hover:bg-gray-200"
                        } transition-all duration-300`}
                      >
                        {type.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold text-lg ${userType === type.id ? type.textColor : "text-gray-900"}`}>
                          {type.title}
                        </h3>
                        <p className="text-gray-500 text-sm mt-1">{type.description}</p>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                          userType === type.id ? "border-blue-500 bg-blue-500" : "border-gray-300"
                        }`}
                      >
                        {userType === type.id && <div className="w-3 h-3 rounded-full bg-white"></div>}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {type.id === "client" && (
                        <>
                          <span className="px-2 py-1 bg-[#142768] text-white text-xs rounded-full">Book Appointments</span>
                          <span className="px-2 py-1 bg-[#142768] text-white text-xs rounded-full">Track History</span>
                          <span className="px-2 py-1 bg-[#142768] text-white text-xs rounded-full">Secure Messaging</span>
                        </>
                      )}
                      {type.id === "lawyer" && (
                        <>
                          <span className="px-2 py-1 bg-[#142768] text-white text-xs rounded-full">Manage Requests</span>
                          <span className="px-2 py-1 bg-[#142768] text-white text-xs rounded-full">Set Fees</span>
                          <span className="px-2 py-1 bg-[#142768] text-white text-xs rounded-full">Profile & Docs</span>
                        </>
                      )}
                      {type.id === "admin" && (
                        <>
                          <span className="px-2 py-1 bg-[#142768] text-white text-xs rounded-full">User Management</span>
                          <span className="px-2 py-1 bg-[#142768] text-white text-xs rounded-full">Verification</span>
                          <span className="px-2 py-1 bg-[#142768] text-white text-xs rounded-full">System Control</span>
                        </>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={handleNext}
                disabled={!userType}
                className="w-full py-4 bg-[#142768] text-white font-semibold rounded-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Continue
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>

              <p className="text-center text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-[#142768] hover:text-black font-semibold hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          )}

          {/* Step 2: Basic Information */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4 ${selectedType?.bgLight} ${selectedType?.textColor}`}
                >
                  <span>{selectedType?.icon}</span>
                  {selectedType?.title} Registration
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Basic Information</h2>
                <p className="text-gray-600">Tell us about yourself</p>
              </div>

              <form className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 ${
                        errors.firstName ? "border-red-300 focus:ring-red-500" : "border-gray-200 focus:ring-indigo-500"
                      } focus:outline-none focus:ring-2 focus:border-transparent`}
                    />
                    {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 ${
                        errors.lastName ? "border-red-300 focus:ring-red-500" : "border-gray-200 focus:ring-indigo-500"
                      } focus:outline-none focus:ring-2 focus:border-transparent`}
                    />
                    {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all duration-300 ${
                        errors.email ? "border-red-300 focus:ring-red-500" : "border-gray-200 focus:ring-indigo-500"
                      } focus:outline-none focus:ring-2 focus:border-transparent`}
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+977 98XXXXXXXX"
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all duration-300 ${
                        errors.phone ? "border-red-300 focus:ring-red-500" : "border-gray-200 focus:ring-indigo-500"
                      } focus:outline-none focus:ring-2 focus:border-transparent`}
                    />
                  </div>
                  {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 ${
                        errors.password ? "border-red-300 focus:ring-red-500" : "border-gray-200 focus:ring-indigo-500"
                      } focus:outline-none focus:ring-2 focus:border-transparent`}
                    />
                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 ${
                        errors.confirmPassword ? "border-red-300 focus:ring-red-500" : "border-gray-200 focus:ring-indigo-500"
                      } focus:outline-none focus:ring-2 focus:border-transparent`}
                    />
                    {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 py-3.5 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 py-3.5 bg-[#142768] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-200 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    Continue
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Step 3: Role-Specific Details */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4 ${selectedType?.bgLight} ${selectedType?.textColor}`}
                >
                  <span>{selectedType?.icon}</span>
                  {selectedType?.title} Details
                </div>

                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {userType === "lawyer" && "Professional Information"}
                  {userType === "admin" && "Admin Verification"}
                  {userType === "client" && "Personal Details"}
                </h2>

                <p className="text-gray-600">Complete your profile to get started</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* LAWYER FIELDS */}
                {userType === "lawyer" && (
                  <>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Years of Experience - numeric */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Years of Experience <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="yearsOfExperience"
                          value={formData.yearsOfExperience}
                          onChange={handleChange}
                          min="0"
                          max="50"
                          placeholder="e.g., 5"
                          className={`w-full px-4 py-3 rounded-xl border bg-white transition-all duration-300
                            ${errors.yearsOfExperience ? "border-red-300 focus:ring-red-500" : "border-gray-200 focus:ring-indigo-500"}
                            focus:outline-none focus:ring-2 focus:border-transparent`}
                        />
                        {errors.yearsOfExperience && <p className="mt-1 text-sm text-red-600">{errors.yearsOfExperience}</p>}
                      </div>

                      {/* Hourly Rate */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Hourly Rate (Rs.)
                        </label>
                        <input
                          type="number"
                          name="hourlyRate"
                          value={formData.hourlyRate}
                          onChange={handleChange}
                          min="0"
                          step="0.01"
                          placeholder="e.g., 2500"
                          className={`w-full px-4 py-3 rounded-xl border transition-all duration-300
                            ${errors.hourlyRate ? "border-red-300 focus:ring-red-500" : "border-gray-200 focus:ring-indigo-500"}
                            focus:outline-none focus:ring-2 focus:border-transparent`}
                        />
                        {errors.hourlyRate && <p className="mt-1 text-sm text-red-600">{errors.hourlyRate}</p>}
                      </div>
                    </div>

                    {/* Specializations */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Specializations <span className="text-red-500">*</span>
                      </label>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {specializations.map((spec) => {
                          const selected = formData.specialization.includes(spec);
                          return (
                            <label
                              key={spec}
                              className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                                selected ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              <input
                                type="checkbox"
                                name="specialization"
                                value={spec}
                                checked={selected}
                                onChange={handleChange}
                                className="sr-only"
                              />
                              <div
                                className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                  selected ? "border-indigo-500 bg-indigo-500" : "border-gray-300"
                                }`}
                              >
                                {selected && (
                                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                              <span className="text-sm text-gray-800">{spec}</span>
                            </label>
                          );
                        })}
                      </div>

                      {errors.specialization && <p className="mt-2 text-sm text-red-600">{errors.specialization}</p>}
                    </div>

                    {/* Bio */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Professional Bio
                      </label>
                      <textarea
                        name="bio"
                        rows={4}
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Brief summary about your experience and expertise"
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-300
                          ${errors.bio ? "border-red-300 focus:ring-red-500" : "border-gray-200 focus:ring-indigo-500"}
                          focus:outline-none focus:ring-2 focus:border-transparent`}
                      />
                      {errors.bio && <p className="mt-1 text-sm text-red-600">{errors.bio}</p>}
                    </div>

                    {/* License Document */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        License Document (Optional)
                      </label>

                      <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-indigo-400 transition-colors duration-300">
                        <input
                          type="file"
                          name="licenseDocument"
                          onChange={handleChange}
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          id="license-upload"
                        />
                        <label htmlFor="license-upload" className="cursor-pointer">
                          <svg className="w-10 h-10 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                          <p className="text-gray-600 text-sm">
                            <span className="text-indigo-600 font-medium">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-400 mt-1">PDF / JPG / PNG</p>
                        </label>

                        {formData.licenseDocument && (
                          <p className="mt-2 text-sm text-green-600">{formData.licenseDocument.name}</p>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* ADMIN FIELDS (unchanged UI-only) */}
                {userType === "admin" && (
                  <>
                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-purple-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <div>
                          <p className="text-purple-800 font-medium text-sm">Admin Verification Required</p>
                          <p className="text-purple-600 text-sm mt-1">
                            You need a valid admin code provided by the system administrator to register as an admin.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Admin Verification Code</label>
                      <input
                        type="text"
                        name="adminCode"
                        value={formData.adminCode}
                        onChange={handleChange}
                        placeholder="Enter admin code"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-purple-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border bg-white border-gray-200 focus:ring-purple-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300"
                      >
                        <option value="">Select department</option>
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                {/* CLIENT FIELDS (unchanged UI-only) */}
                {userType === "client" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-indigo-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="123 Main Street, Apt 4B"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-indigo-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300"
                      />
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="Kathmandu"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-indigo-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          placeholder="Bagmati"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-indigo-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                        <input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleChange}
                          placeholder="44600"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-indigo-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Terms & Conditions */}
                <div className="pt-4 border-t border-gray-200">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      className="w-5 h-5 mt-0.5 text-indigo-500 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-600">
                      I agree to the{" "}
                      <a href="#" className="text-indigo-600 hover:underline font-medium">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-indigo-600 hover:underline font-medium">
                        Privacy Policy
                      </a>
                      .
                    </span>
                  </label>
                  {errors.agreeTerms && <p className="mt-2 text-sm text-red-600">{errors.agreeTerms}</p>}
                </div>

                {submitError && <p className="text-sm text-red-600">{submitError}</p>}

                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 py-3.5 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back
                  </button>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-3.5 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 bg-[#142768] text-white hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Security Notice */}
          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <span>Your information is protected and secure</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
