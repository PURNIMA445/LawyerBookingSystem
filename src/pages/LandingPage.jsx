import React, { useState, useEffect } from 'react';
import { Calendar, Shield, Users, ArrowRight, CheckCircle, Clock, Award, MessageSquare } from 'lucide-react';

export default function LandingPage() {
    const [activeFeature, setActiveFeature] = useState(0);

    const features = [
        { icon: Calendar, title: "Smart Scheduling", description: "Book appointments instantly with real-time availability" },
        { icon: Shield, title: "Secure & Private", description: "End-to-end encryption for all communications" },
        { icon: Users, title: "Expert Network", description: "Access to verified legal professionals nationwide" },
    ];

    const stats = [
        { value: "50K+", label: "Active Clients" },
        { value: "2,500+", label: "Legal Experts" },
        { value: "98%", label: "Satisfaction Rate" },
        { value: "24/7", label: "Support Available" }
    ];

    const specialties = ["Corporate Law", "Family Law", "Criminal Defense", "Immigration",
        "Real Estate", "Intellectual Property", "Tax Law", "Employment"];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveFeature((prev) => (prev + 1) % features.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">

            {/* Hero Section */}
            <section className="text-center py-20 px-6">
                <h1 className="text-5xl md:text-6xl font-bold mb-6">
                    LegalConnect
                    <span className="block bg-[#142768] to-pink-500 bg-clip-text text-transparent">
                        When You Need It
                    </span>
                </h1>
                <p className="text-gray-600 mb-8 text-lg md:text-xl">
                    Connect with top-rated attorneys instantly. Book consultations, manage cases, and get expert legal advice all in one platform.
                </p>
                <div className="flex justify-center gap-4 flex-wrap">
                    <button className="px-8 py-4 
                    bg-[#142768] text-white rounded-full font-semibold hover:scale-105 transition-transform flex items-center gap-2">
                        Book Free Consultation
                        <ArrowRight className="w-5 h-5" />
                    </button>
                    <button className="px-8 py-4 bg-white border border-gray-300 rounded-full hover:bg-gray-100 transition">
                        Watch Demo
                    </button>
                </div>
            </section>

            {/* Features */}
            <section className="max-w-5xl mx-auto py-16 px-6 grid md:grid-cols-3 gap-6">
                {features.map((feature, idx) => (
                    <div key={idx} className={`p-6 rounded-2xl cursor-pointer transition-transform border border-gray-200 ${activeFeature === idx ? "scale-105 bg-linear-to-r from-blue-100 to-purple-200 shadow-md" : "bg-white hover:bg-gray-100"}`}>
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-50 rounded-xl">
                                <feature.icon className="w-6 h-6 text-indigo-900" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">{feature.title}</h3>
                                <p className="text-gray-600 text-sm">{feature.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            {/* Stats */}
            <section className="max-w-5xl mx-auto py-16 px-6 grid md:grid-cols-4 gap-6 text-center">
                {stats.map((stat, idx) => (
                    <div key={idx} className="p-6 bg-white rounded-2xl border border-gray-200 hover:scale-105 transition-transform">
                        <div className="text-3xl md:text-4xl font-bold bg-[#142768] bg-clip-text text-transparent">{stat.value}</div>
                        <div className="text-gray-500">{stat.label}</div>
                    </div>
                ))}
            </section>

            {/* How It Works */}
            <section className="max-w-5xl mx-auto py-16 px-6 text-center">
                <h2 className="text-4xl md:text-5xl font-bold mb-8">
                    Simple, Fast, <span className="bg-[#142768] bg-clip-text text-transparent">Effective</span>
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                    {[{icon: MessageSquare, title:"Describe Your Case"}, {icon: Users, title:"Get Matched"}, {icon: Calendar, title:"Book & Meet"}].map((step, idx) => (
                        <div key={idx} className="p-6 bg-white rounded-2xl border border-gray-200 hover:bg-linear-to-r hover:from-blue-100 hover:to-purple-200 hover:scale-105 transition transform cursor-pointer">
                            <div className="mb-4 p-4 bg-blue-50 rounded-xl inline-block">
                                <step.icon className="w-8 h-8 text-indigo-900" />
                            </div>
                            <h3 className="text-2xl font-semibold">{step.title}</h3>
                        </div>
                    ))}
                </div>
            </section>

            {/* Specialties */}
            <section className="max-w-5xl mx-auto py-16 px-6">
                <h2 className="text-4xl font-bold text-center mb-8">Practice Areas</h2>
                <div className="grid md:grid-cols-4 gap-4">
                    {specialties.map((spec, idx) => (
                        <div key={idx} className="p-6 bg-white rounded-2xl border border-gray-200 hover:bg-linear-to-r hover:from-blue-100 hover:to-purple-200 hover:scale-105 transition transform text-center cursor-pointer">
                            <Award className="w-8 h-8 mx-auto mb-3 text-indigo-900"/>
                            <div className="font-semibold text-gray-800">{spec}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="max-w-4xl mx-auto py-16 px-6 text-center">
                <div className="bg-[#142768] rounded-3xl p-12 text-white">
                    <Clock className="w-16 h-16 mx-auto mb-6"/>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
                    <p className="mb-6">Join thousands of satisfied clients who found the legal help they needed</p>
                    <button className="px-10 py-4 bg-white text-[#142768] rounded-full font-bold hover:scale-105 transition-transform">Start Free Consultation</button>
                </div>
            </section>

        </div>
    );
}
