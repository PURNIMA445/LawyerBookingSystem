import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { servicesData } from '../data/services';
import { Link } from "react-router-dom";

const Services = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

const testimonials = [
  {
    name: "Sushant Adhikari",
    role: "Business Owner, Kathmandu",
    text: "The platform made it very easy to connect with an experienced lawyer. I received clear guidance for company registration and legal compliance in Nepal.",
    rating: 5
  },
  {
    name: "Ramesh Thapa",
    role: "Property Owner, Pokhara",
    text: "I was facing land ownership issues and didn’t know where to start. Through this service, I found a reliable lawyer who handled everything professionally.",
    rating: 5
  },
  {
    name: "Nirmala Shrestha",
    role: "Individual Client, Lalitpur",
    text: "The lawyer was patient, respectful, and knowledgeable. The fee negotiation feature helped me feel confident before confirming the appointment.",
    rating: 5
  }
];


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100">


      {/* Hero Section */}
      <section className="  py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Our
            <span className="block text-transparent bg-clip-text bg-[#142768]">
              Legal Services             </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Delivering expert legal representation with integrity, dedication, and a track record of proven results
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesData.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-shadow duration-300 border border-slate-200"
              >
                <div className="text-blue-900 mb-4">
                  <service.icon className="w-10 h-10" />
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {service.description}
                </p>

                {/* ✅ Updated Learn More Link */}
                <Link
                  to={`/services/${service.id}`}
                  className="mt-6 text-blue-900 font-semibold flex items-center group hover:underline"
                >
                  Learn More
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-black text-center mb-12">
            Client Testimonials
          </h2>

          <div className="max-w-4xl mx-auto relative">
            <div className="bg-white rounded-xl shadow-2xl p-8 md:p-12">

              <p className="text-slate-700 text-lg md:text-xl mb-6 italic">
                {testimonials[currentSlide].text}
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">
                    {testimonials[currentSlide].name}
                  </h4>
                  <p className="text-slate-600">
                    {testimonials[currentSlide].role}
                  </p>
                </div>
                <div className="flex space-x-1">
                  {[...Array(testimonials[currentSlide].rating)].map((_, i) => (
                    <svg key={i} className="w-6 h-6 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>

            {/* Carousel Controls */}
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-lg hover:bg-slate-100 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-slate-900" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-lg hover:bg-slate-100 transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-slate-900" />
            </button>

            {/* Carousel Indicators */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${currentSlide === index ? 'bg-indigo-500' : 'bg-slate-400'
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>




    </div>
  );
};

export default Services;