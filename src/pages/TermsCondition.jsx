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
      content:
        "By accessing and using LegalConnect, you confirm that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our services."
    },
    {
      title: "Services Provided",
      icon: <Scale className="w-5 h-5" />,
      content:
        "LegalConnect is a platform that helps clients in Nepal connect with lawyers and request appointments. We provide tools for booking requests, fee negotiation, appointment history, and communication. We do not provide legal advice directly and are not responsible for the legal services delivered by lawyers."
    },
    {
      title: "User Responsibilities",
      icon: <Shield className="w-5 h-5" />,
      content:
        "Users must provide accurate and current information while creating accounts and requesting appointments. You are responsible for keeping your account credentials secure. Any activity performed using your account is your responsibility. Misuse, false information, or fraudulent activity may result in account suspension or termination."
    },
    {
      title: "Appointment Policies",
      icon: <AlertCircle className="w-5 h-5" />,
      content:
        "Appointments are requests and may require confirmation by the lawyer. Clients and lawyers can negotiate the fee before final confirmation. If you need to cancel or reschedule, please do so as early as possible. Late cancellations or repeated no-shows may impact your ability to book future appointments. Online/virtual meetings require stable internet connectivity."
    },
    {
      title: "Payment and Fees",
      icon: <FileText className="w-5 h-5" />,
      content:
        "Fees for legal services are agreed between the client and the lawyer through the platform. Any platform service fee (if applicable) will be displayed clearly. Unless otherwise stated, payments (if collected) are non-refundable except for verified system errors or lawyer cancellations."
    },
    {
      title: "Privacy and Confidentiality",
      icon: <Shield className="w-5 h-5" />,
      content:
        "We take privacy seriously. Personal information is collected and used according to our Privacy Policy. Communications within the platform are intended to be secure. However, users should understand that digital communication can carry security risks. Lawyers are responsible for maintaining professional confidentiality and legal ethics as per applicable practices in Nepal."
    },
    {
      title: "Limitation of Liability",
      icon: <AlertCircle className="w-5 h-5" />,
      content:
        "LegalConnect is provided on an 'as-is' basis without warranties of any kind. We are not liable for the quality of legal advice, outcomes, or services provided by lawyers. We are also not responsible for delays or issues caused by external factors (internet outages, third-party services, or events beyond our reasonable control)."
    },
    {
      title: "Termination",
      icon: <Scale className="w-5 h-5" />,
      content:
        "We may suspend or terminate accounts that violate these terms, misuse the platform, or engage in fraudulent activity. Users may request account termination by contacting support. Upon termination, access to appointment history and account data may be limited as required for operational and legal reasons."
    }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <Scale className="w-8 h-8 text-[#142768]" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Terms & Conditions</h1>
              <p className="text-sm text-slate-600 mt-1">LegalConnect (Nepal)</p>
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
              <FileText className="w-6 h-6 text-[#142768]" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Welcome</h2>
              <p className="text-slate-700 leading-relaxed">
                Please read these Terms and Conditions carefully before using LegalConnect.
                These terms govern your use of the platform and outline responsibilities for clients and lawyers in Nepal.
              </p>
              <p className="text-sm text-slate-600 mt-3">
                <strong>Last Updated:</strong> February 6, 2026
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
                  <div className="shrink-0 text-[#142768]">
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
                  <p className="text-slate-700 leading-relaxed border-l-4 border-blue-900 pl-4">
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
            <p><strong>Email:</strong> support@legalconnect.com</p>
            <p><strong>Phone:</strong> +977 9800000000</p>
            <p><strong>Address:</strong> New Baneshwor, Kathmandu, Nepal</p>
          </div>
        </div>

        {/* Acceptance Checkbox */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-1 w-5 h-5 text-[#142768] rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
            />
            <span className="text-slate-700 leading-relaxed">
              I have read, understood, and agree to be bound by these Terms and Conditions.
              I acknowledge that by using LegalConnect, I am entering into a legally binding agreement.
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
