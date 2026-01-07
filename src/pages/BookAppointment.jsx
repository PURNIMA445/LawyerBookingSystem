import React, { useState } from "react";
import {Link} from 'react-router-dom'
const BookAppointment = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Client Info
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    previousClient: false,
    
    // Step 2: Date & Time
    appointmentDate: "",
    appointmentTime: "",
    urgency: "normal",
    
    // Step 3: Additional Info
    description: ""
  });

  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Mock data
  const lawyers = [
    { id: 1, name: "John Adams", specialization: "Criminal & Civil Law" },
    { id: 2, name: "Emma Wilson", specialization: "Corporate Law" },
    { id: 3, name: "Michael Brown", specialization: "Family Law" },
    { id: 4, name: "Sarah Johnson", specialization: "Real Estate Law" }
  ];

  const timeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
  ];

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Validate current step
  const validateStep = () => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.clientName.trim()) newErrors.clientName = "Name is required";
      if (!formData.clientEmail.trim()) newErrors.clientEmail = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.clientEmail)) newErrors.clientEmail = "Invalid email";
      if (!formData.clientPhone.trim()) newErrors.clientPhone = "Phone is required";
    }

    if (step === 2) {
      if (!formData.appointmentDate) newErrors.appointmentDate = "Date is required";
      if (!formData.appointmentTime) newErrors.appointmentTime = "Time is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigate steps
  const nextStep = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep()) {
      console.log("Form submitted:", formData);
      setShowSuccess(true);
      // Reset after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
        setFormData({
          clientName: "",
          clientEmail: "",
          clientPhone: "",
          previousClient: false,
          appointmentDate: "",
          appointmentTime: "",
          urgency: "normal",
          description: ""
        });
        setStep(1);
      }, 3000);
    }
  };

  // Progress bar
  const progress = (step / 3) * 100;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <Link to='/home' className="text-[#142768] hover:underline mb-4">← Back to Homepage</Link>
      <div className="max-w-3xl mx-auto">
      
        {/* Header */}
        <div className="text-center mb-8">
       
          <h1 className="text-3xl sm:text-4xl font-bold text-[#142768] mb-2">
            Book an Appointment
          </h1>
          <p className="text-gray-600">Schedule a consultation with our legal experts</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Step {step} of 3</span>
            <span className="text-sm font-medium text-gray-700">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#142768] transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          {/* Step indicators */}
          <div className="flex justify-between mt-4">
            {["Client Info", "Schedule", "Confirm"].map((label, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step > idx + 1 ? "bg-green-500 text-white" :
                  step === idx + 1 ? "bg-[#142768] text-white" :
                  "bg-gray-300 text-gray-600"
                }`}>
                  {step > idx + 1 ? "✓" : idx + 1}
                </div>
                <span className="text-xs mt-1 text-gray-600 hidden sm:block">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <form onSubmit={handleSubmit}>
            
            {/* STEP 1: Client Information */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Client Information</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#142768] ${
                      errors.clientName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.clientName && <p className="text-red-500 text-sm mt-1">{errors.clientName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="clientEmail"
                    value={formData.clientEmail}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#142768] ${
                      errors.clientEmail ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="your.email@example.com"
                  />
                  {errors.clientEmail && <p className="text-red-500 text-sm mt-1">{errors.clientEmail}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="clientPhone"
                    value={formData.clientPhone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#142768] ${
                      errors.clientPhone ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="+977 98X-XXXXXXX"
                  />
                  {errors.clientPhone && <p className="text-red-500 text-sm mt-1">{errors.clientPhone}</p>}
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="previousClient"
                    checked={formData.previousClient}
                    onChange={handleChange}
                    className="w-4 h-4 text-[#142768] border-gray-300 rounded focus:ring-[#142768]"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    I'm a previous client
                  </label>
                </div>
              </div>
            )}

            {/* STEP 2: Schedule */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Select Date & Time</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Appointment Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="appointmentDate"
                    value={formData.appointmentDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#142768] ${
                      errors.appointmentDate ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.appointmentDate && <p className="text-red-500 text-sm mt-1">{errors.appointmentDate}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Appointment Time <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {timeSlots.map(time => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, appointmentTime: time }))}
                        className={`py-2 px-3 text-sm rounded-lg border-2 transition ${
                          formData.appointmentTime === time
                            ? "border-[#142768] bg-[#142768] text-white"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                  {errors.appointmentTime && <p className="text-red-500 text-sm mt-1">{errors.appointmentTime}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Urgency Level
                  </label>
                  <div className="flex gap-4">
                    {["normal", "urgent", "emergency"].map(level => (
                      <label key={level} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="urgency"
                          value={level}
                          checked={formData.urgency === level}
                          onChange={handleChange}
                          className="w-4 h-4 text-[#142768] border-gray-300 focus:ring-[#142768]"
                        />
                        <span className="ml-2 text-sm capitalize">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Additional Information & Confirmation */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Additional Information</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Describe Your Case (Optional)
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#142768]"
                    placeholder="Please provide a brief description of your legal matter..."
                  ></textarea>
                </div>

                {/* Confirmation Summary */}
                <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                  <h3 className="font-semibold text-gray-900 mb-3">Appointment Summary</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">Client Name</p>
                      <p className="font-medium">{formData.clientName}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Email</p>
                      <p className="font-medium">{formData.clientEmail}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Phone</p>
                      <p className="font-medium">{formData.clientPhone}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Urgency</p>
                      <p className="font-medium capitalize">{formData.urgency}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Date</p>
                      <p className="font-medium">{formData.appointmentDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Time</p>
                      <p className="font-medium">{formData.appointmentTime}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  ← Previous
                </button>
              )}
              
              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="ml-auto px-6 py-3 bg-[#142768] text-white rounded-lg hover:bg-[#1a3189] transition font-medium"
                >
                  Next →
                </button>
              ) : (
                <button
                  type="submit"
                  className="ml-auto px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                >
                  Confirm Appointment ✓
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Success Modal */}
        {showSuccess && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center animate-slideIn">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✓</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Appointment Booked!</h2>
              <p className="text-gray-600 mb-4">
                Your appointment has been successfully scheduled. You'll receive a confirmation email shortly.
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Appointment Details</p>
                <p className="font-semibold text-lg">{formData.appointmentDate} at {formData.appointmentTime}</p>
                <p className="text-sm text-gray-600 mt-1">Urgency: {formData.urgency}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default BookAppointment;