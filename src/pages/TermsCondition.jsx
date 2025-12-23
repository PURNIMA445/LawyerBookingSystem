import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Scale, FileText, Shield, AlertCircle } from 'lucide-react';

export default function TermsAndConditions() {
  const [expandedSection, setExpandedSection] = useState(null);
  const [accepted, setAccepted] = useState(false);

  const toggleSection = (index) => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  const sections = [
    {
      title: "Acceptance of Terms",
      icon: <FileText className="w-5 h-5" />,
      content: "By accessing and using the Lawyer Appointment System, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our services."
    },
    {
      title: "Services Provided",
      icon: <Scale className="w-5 h-5" />,
      content: "Our platform facilitates the scheduling of appointments between clients and licensed attorneys. We provide a booking interface, calendar management, and communication tools. We do not provide legal advice directly and are not responsible for the legal services rendered by attorneys."
    },
    {
      title: "User Responsibilities",
      icon: <Shield className="w-5 h-5" />,
      content: "Users must provide accurate and current information when creating accounts and booking appointments. You are responsible for maintaining the confidentiality of your account credentials. Any activities conducted under your account are your responsibility. False or misleading information may result in account termination."
    },
    {
      title: "Appointment Policies",
      icon: <AlertCircle className="w-5 h-5" />,
      content: "Appointments must be cancelled at least 24 hours in advance. Late cancellations or no-shows may result in cancellation fees as determined by the individual attorney. Rescheduling is subject to attorney availability. Virtual appointments require stable internet connection and appropriate video conferencing setup."
    },
    {
      title: "Payment and Fees",
      icon: <FileText className="w-5 h-5" />,
      content: "Payment terms are established between clients and attorneys. Our platform may charge a service fee for facilitating appointments. All fees are non-refundable except in cases of attorney cancellation or system errors. Payment information is processed securely through encrypted channels."
    },
    {
      title: "Privacy and Confidentiality",
      icon: <Shield className="w-5 h-5" />,
      content: "We are committed to protecting your privacy and maintaining attorney-client privilege. Personal information is collected and used in accordance with our Privacy Policy. Communications through our platform are encrypted. However, users should be aware that electronic communications carry inherent security risks."
    },
    {
      title: "Limitation of Liability",
      icon: <AlertCircle className="w-5 h-5" />,
      content: "The platform is provided 'as is' without warranties of any kind. We are not liable for any legal advice, outcomes, or services provided by attorneys. Our liability is limited to the amount paid for platform services. We are not responsible for technical issues, data loss, or service interruptions beyond our reasonable control."
    },
    {
      title: "Termination",
      icon: <Scale className="w-5 h-5" />,
      content: "We reserve the right to suspend or terminate accounts that violate these terms, engage in fraudulent activity, or misuse the platform. Users may terminate their accounts at any time by contacting support. Upon termination, access to scheduled appointments and account data may be restricted."
    }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <Scale className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Terms & Conditions</h1>
              <p className="text-sm text-slate-600 mt-1">Lawyer Appointment System</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Introduction Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Welcome</h2>
              <p className="text-slate-700 leading-relaxed">
                Please read these Terms and Conditions carefully before using our Lawyer Appointment System. 
                These terms govern your use of our platform and establish the legal framework for our services.
              </p>
              <p className="text-sm text-slate-600 mt-3">
                <strong>Last Updated:</strong> December 23, 2025
              </p>
            </div>
          </div>
        </div>

        {/* Expandable Sections */}
        <div className="space-y-4 mb-8">
          {sections.map((section, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg">
              <button
                onClick={() => toggleSection(index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="shrink-0 text-blue-600">
                    {section.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {index + 1}. {section.title}
                  </h3>
                </div>
                <div className="shrink-0 text-slate-400">
                  {expandedSection === index ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </button>
              
              <div
                className={`transition-all duration-300 ease-in-out ${
                  expandedSection === index
                    ? 'max-h-96 opacity-100'
                    : 'max-h-0 opacity-0'
                } overflow-hidden`}
              >
                <div className="px-6 pb-4 pt-2">
                  <p className="text-slate-700 leading-relaxed border-l-4 border-blue-200 pl-4">
                    {section.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Information */}
        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-3">Questions or Concerns?</h3>
          <p className="text-slate-700 mb-4">
            If you have any questions about these Terms and Conditions, please contact us:
          </p>
          <div className="space-y-2 text-slate-700">
            <p><strong>Email:</strong> legal@lawyerappointments.com</p>
            <p><strong>Phone:</strong> +1 (555) 123-4567</p>
            <p><strong>Address:</strong> 123 Legal Plaza, Suite 500, Legal City, LC 12345</p>
          </div>
        </div>

        {/* Acceptance Checkbox */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
            />
            <span className="text-slate-700 leading-relaxed">
              I have read, understood, and agree to be bound by these Terms and Conditions. 
              I acknowledge that by using the Lawyer Appointment System, I am entering into a 
              legally binding agreement.
            </span>
          </label>
          
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              disabled={!accepted}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                accepted
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              Accept & Continue
            </button>
            <button className="flex-1 py-3 px-6 rounded-lg font-semibold border-2 border-slate-300 text-slate-700 hover:bg-slate-50 transition-all">
              Decline
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}