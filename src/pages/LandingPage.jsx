import React, { useState, useEffect } from "react";
import {
  Calendar,
  Shield,
  Users,
  ArrowRight,
  Clock,
  Award,
  MessageSquare,
  MapPin,
  Phone,
  Scale,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: Calendar,
      title: "Easy Scheduling",
      description:
        "Request appointments and negotiate fees with lawyers in just a few minutes",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description:
        "Your personal and legal details stay protected and confidential",
    },
    {
      icon: Users,
      title: "Verified Nepali Lawyers",
      description:
        "Find experienced lawyers across Nepal by specialization and experience",
    },
  ];

  const stats = [
    { value: "10K+", label: "Clients" },
    { value: "500+", label: "Registered Lawyers" },
    { value: "95%", label: "Client Satisfaction" },
    { value: "Fast", label: "Booking & Negotiation" },
  ];

  const specialties = [
    "Corporate & Company Law",
    "Family & Divorce Law",
    "Criminal Defense",
    "Land & Property Law",
    "Labor & Employment Law",
    "Tax & Compliance",
    "Immigration & Travel",
    "Banking & Finance",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Hero Section */}
      <section className="text-center py-20 px-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-sm text-gray-700 mb-6">
          <MapPin className="w-4 h-4 text-[#142768]" />
          Built for Nepal • Kathmandu • Pokhara • Biratnagar • Butwal
        </div>

        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          LegalConnect
          <span className="block bg-[#142768] bg-clip-text text-transparent">
            Legal Help, Made Simple
          </span>
        </h1>

        <p className="text-gray-600 mb-8 text-lg md:text-xl max-w-3xl mx-auto">
          Connect with trusted Nepali Lawyers. Request an appointment, negotiate fees, and confirm
          your booking — all in one platform designed for Nepal.
        </p>

        <div className="flex justify-center gap-4 flex-wrap">
          <Link
            to="/signup"
            className="px-8 py-4 bg-[#142768] text-white rounded-full font-semibold hover:scale-105 transition-transform flex items-center gap-2"
          >
            Create Account & Get Started <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            to="/lawyers"
            className="px-8 py-4 bg-white border border-gray-300 rounded-full hover:bg-gray-100 transition flex items-center gap-2"
          >
            Browse Lawyers <Scale className="w-5 h-5 text-[#142768]" />
          </Link>
        </div>

        <div className="mt-8 flex justify-center flex-wrap gap-3 text-sm text-gray-600">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200">
            <Clock className="w-4 h-4 text-[#142768]" />
            Negotiate fees before booking
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200">
            <Shield className="w-4 h-4 text-[#142768]" />
            Secure appointment history
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200">
            <Phone className="w-4 h-4 text-[#142768]" />
            Easy support for clients & lawyers
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto py-16 px-6 grid md:grid-cols-3 gap-6">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-2xl cursor-pointer transition-transform border border-gray-200 ${
              activeFeature === idx
                ? "scale-105 bg-linear-to-r from-blue-100 to-purple-200 shadow-md"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-xl">
                <feature.icon className="w-6 h-6 text-indigo-900" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{feature.title}</h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto py-16 px-6 grid md:grid-cols-4 gap-6 text-center">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="p-6 bg-white rounded-2xl border border-gray-200 hover:scale-105 transition-transform"
          >
            <div className="text-3xl md:text-4xl font-bold bg-[#142768] bg-clip-text text-transparent">
              {stat.value}
            </div>
            <div className="text-gray-500">{stat.label}</div>
          </div>
        ))}
      </section>

      <section className="max-w-7xl mx-auto py-16 px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-8">
          Simple, Fast,{" "}
          <span className="bg-[#142768] bg-clip-text text-transparent">
            Trusted by Nepali Clients
          </span>
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: MessageSquare,
              title: "Describe Your Legal Needs",
              desc: "Land, family, business, criminal, or employment matters",
            },
            {
              icon: Users,
              title: "Choose the Right Lawyer",
              desc: "Compare verified Nepali lawyers by experience and field",
            },
            {
              icon: Calendar,
              title: "Negotiate & Confirm",
              desc: "Discuss fees and finalize your appointment confidently",
            },
          ].map((step, idx) => (
            <div
              key={idx}
              className="p-6 bg-white rounded-2xl border border-gray-200 hover:bg-linear-to-r hover:from-blue-100 hover:to-purple-200 hover:scale-105 transition transform cursor-pointer"
            >
              <div className="mb-4 p-4 bg-blue-50 rounded-xl inline-block">
                <step.icon className="w-8 h-8 text-indigo-900" />
              </div>
              <h3 className="text-2xl font-semibold">{step.title}</h3>
              <p className="text-gray-600 mt-2">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Specialties */}
      <section className="max-w-6xl mx-auto py-16 px-6">
        <h2 className="text-4xl font-bold text-center mb-8">
          Legal Practice Areas in Nepal
        </h2>
        <div className="grid md:grid-cols-4 gap-4">
          {specialties.map((spec, idx) => (
            <div
              key={idx}
              className="p-6 bg-white rounded-2xl border border-gray-200 hover:bg-linear-to-r hover:from-blue-100 hover:to-purple-200 hover:scale-105 transition transform text-center cursor-pointer"
            >
              <Award className="w-8 h-8 mx-auto mb-3 text-indigo-900" />
              <div className="font-semibold text-gray-800">{spec}</div>
              
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto py-16 px-6 text-center">
        <div className="bg-[#142768] rounded-3xl p-12 text-white">
          <Clock className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Talk to a Lawyer?
          </h2>
          <p className="mb-6">
            Sign up, request an appointment, negotiate the fee, and confirm your
            booking — all from your dashboard.
          </p>

          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              to="/signup"
              className="px-10 py-4 bg-white text-[#142768] rounded-full font-bold hover:scale-105 transition-transform"
            >
              Start Now
            </Link>

            <Link
              to="/lawyers"
              className="px-10 py-4 border border-white/40 text-white rounded-full font-bold hover:scale-105 transition-transform"
            >
              View Lawyers
            </Link>
          </div>

          <p className="text-xs text-white/80 mt-6">
            Fees vary by case type and lawyer experience. Negotiation is available
            before confirmation.
          </p>
        </div>
      </section>
    </div>
  );
}
