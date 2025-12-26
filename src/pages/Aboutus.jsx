import React from 'react'
import { HiOutlineLightBulb } from "react-icons/hi";
import { LuEarth } from "react-icons/lu";
import { MdRocketLaunch } from "react-icons/md";
import { FiZap } from "react-icons/fi";
import { FaSearch } from "react-icons/fa";
import { TfiLock } from "react-icons/tfi";
import { SlScreenSmartphone } from "react-icons/sl";
import { IoNotificationsSharp } from "react-icons/io5";
import { IoMdChatbubbles } from "react-icons/io";

const Aboutus = () => {
    const icons = [
        <MdRocketLaunch className="w-full h-full" />,
        <HiOutlineLightBulb className="w-full h-full" />,
        <LuEarth className="w-full h-full" />,
    ];

    return (
        <>
            {/* Hero Section */}
            <div className=" text-black text-center px-5 py-20">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              About
              <span className="block text-transparent bg-clip-text bg-[#142768]">
                LegalConnect              </span>
            </h1>
                <p className="text-lg max-w-2xl mx-auto opacity-90">
                    Bridging the gap between clients and legal professionals through seamless,
                    modern appointment scheduling
                </p>
            </div>

            {/* Main Container */}
            <div className="max-w-7xl mx-auto px-5 py-12 bg-gray-200">
                {/* Our Story */}
                <div className="mb-16 text-center">
                    <h2 className="text-3xl font-semibold text-gray-900 mb-5">
                        Our Story
                    </h2>
                    <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
                        LegalConnect was founded with a simple mission: to make legal services
                        more accessible and convenient for everyone. Scheduling appointments with
                        lawyers shouldn't be complicated or frustrating.
                    </p>
                </div>

                {/* Why Choose */}
                <div>
                    <h2 className="text-3xl font-semibold text-gray-900 text-center mb-10">
                        Why Choose LegalConnect?
                    </h2>

                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {[
                            { icon: <FiZap />, title: "Instant Booking", desc: "Schedule appointments 24/7" },
                            { icon: <FaSearch />, title: "Find Specialists", desc: "Search by expertise & location" },
                            { icon: <TfiLock />, title: "Secure Platform", desc: "Enterprise-grade security" },
                            { icon: <SlScreenSmartphone />, title: "Mobile Friendly", desc: "Works on all devices" },
                            { icon: <IoNotificationsSharp />, title: "Smart Reminders", desc: "Email & SMS notifications" },
                            { icon: <IoMdChatbubbles />, title: "Direct Communication", desc: "Secure lawyer messaging" },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="bg-white p-8 rounded-xl text-center transition hover:-translate-y-1 hover:shadow-xl border border-gray-100"
                            >
                                <div className="text-4xl mb-4 text-[#142768] flex justify-center">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mission / Vision / Values */}
            <div className="bg-white py-7 ">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="space-y-10 sm:space-y-12 md:space-y-16">
                        {[
                            {
                                title: "Our Mission",
                                text: "To simplify legal appointment booking and make legal help accessible to everyone.",
                            },
                            {
                                title: "Our Vision",
                                text: "To become the most trusted legal appointment platform globally.",
                            },
                            {
                                title: "Core Values",
                                text: "Trust, transparency, innovation, and excellence in service.",
                            },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 text-center sm:text-left"
                            >
                                {/* Icon */}
                                <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-[#142768]">
                                    {icons[index]}
                                </div>

                                {/* Text */}
                                <div className="flex-1">
                                    <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-3">
                                        {item.title}
                                    </h2>
                                    <p className="text-gray-600 leading-relaxed max-w-xl mx-auto sm:mx-0">
                                        {item.text}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="bg-gray-50 py-11">
                <div className="max-w-7xl mx-auto px-5">
                    <h2 className="text-3xl font-semibold text-gray-900 text-center mb-7">
                        Our Impact
                    </h2>

                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 text-center">
                        {[
                            { value: "10,000+", label: "Active Lawyers" },
                            { value: "50,000+", label: "Appointments Booked" },
                            { value: "95%", label: "Client Satisfaction" },
                            { value: "24/7", label: "Availability" },
                        ].map((stat, index) => (
                            <div key={index} className="bg-white p-8 rounded-xl shadow-sm">
                                <div className="text-5xl font-bold bg-[#142768] bg-clip-text text-transparent">
                                    {stat.value}
                                </div>
                                <p className="text-gray-600 mt-2 font-medium">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Aboutus