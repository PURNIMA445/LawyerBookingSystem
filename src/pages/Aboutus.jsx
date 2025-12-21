import React from 'react'
import { HiOutlineLightBulb } from "react-icons/hi";
import { LuEarth } from "react-icons/lu";
import { MdRocketLaunch } from "react-icons/md";
const Aboutus = () => {
    const icons = [
        (
            <MdRocketLaunch className="w-full h-full" />
        ),
        (
            <HiOutlineLightBulb className="w-full h-full" />
        ),
        (
            <LuEarth className="w-full h-full" />
        ),
    ];

    return (

        <>
            {/* Hero Section */}
            <div className="bg-gray-200 text-grey-100 text-center px-5 py-20">
                <h1 className="text-4xl md:text-5xl font-bold mb-5">
                    About LexAppointment
                </h1>
                <p className="text-lg max-w-2xl mx-auto opacity-75">
                    Bridging the gap between clients and legal professionals through seamless,
                    modern appointment scheduling
                </p>
            </div>

            {/* Main Container */}
            <div className="max-w-7xl mx-auto px-5 py-16">
                {/* Our Story */}
                <div className="mb-16 text-center">
                    <h2 className="text-3xl font-semibold text-blue-900 mb-5">
                        Our Story
                    </h2>
                    <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                        LexAppointment was founded with a simple mission: to make legal services
                        more accessible and convenient for everyone. Scheduling appointments with
                        lawyers shouldn’t be complicated or frustrating.
                    </p>
                </div>

                {/* Why Choose */}
                <div className="mb-16">
                    <h2 className="text-3xl font-semibold text-blue-900 text-center mb-10">
                        Why Choose LexAppointment?
                    </h2>

                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {[
                            { icon: "⚡", title: "Instant Booking", desc: "Schedule appointments 24/7" },
                            { icon: "🔍", title: "Find Specialists", desc: "Search by expertise & location" },
                            { icon: "🔒", title: "Secure Platform", desc: "Enterprise-grade security" },
                            { icon: "📱", title: "Mobile Friendly", desc: "Works on all devices" },
                            { icon: "🔔", title: "Smart Reminders", desc: "Email & SMS notifications" },
                            { icon: "💬", title: "Direct Communication", desc: "Secure lawyer messaging" },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="bg-gray-50 p-8 rounded-xl text-center transition hover:-translate-y-1 hover:shadow-xl"
                            >
                                <div className="text-4xl mb-4">{item.icon}</div>
                                <h3 className="text-xl font-semibold text-blue-900 mb-3">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mission / Vision / Values */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 ">
                <div className="space-y-12 md:space-y-16">
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
                            className="flex flex-col sm:flex-row gap-6 items-start"
                        >
                            <div className="shrink-0 w-16 h-16 sm:w-14 sm:h-14 text-grey-100">
                                {icons[index]}
                            </div>


                            <div className="flex-1">
                                <h2 className="text-2xl sm:text-3xl font-light text-gray-700 mb-4 flex items-center gap-2">
                                    {item.title}
                                </h2>
                                <p className="text-gray-600 leading-relaxed">{item.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Stats */}
            <div className="max-w-7xl mx-auto px-5 py-16">
                <h2 className="text-3xl font-semibold text-blue-900 text-center mb-10">
                    Our Impact
                </h2>

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 text-center">
                    {[
                        { value: "10,000+", label: "Active Lawyers" },
                        { value: "50,000+", label: "Appointments Booked" },
                        { value: "95%", label: "Client Satisfaction" },
                        { value: "24/7", label: "Availability" },
                    ].map((stat, index) => (
                        <div key={index}>
                            <div className="text-5xl font-bold text-blue-700">
                                {stat.value}
                            </div>
                            <p className="text-gray-600 mt-2">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>


        </>
    );
}

export default Aboutus