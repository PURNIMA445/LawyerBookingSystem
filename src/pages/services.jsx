import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Scale, FileText, Users, Briefcase, Home, Building, Shield } from 'lucide-react';

const Services = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Business Owner",
      text: "Outstanding legal representation. They helped us navigate complex corporate matters with expertise and professionalism.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Real Estate Investor",
      text: "Highly recommend their services. The team was thorough, responsive, and achieved excellent results for our property disputes.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Individual Client",
      text: "Compassionate and knowledgeable attorneys. They guided me through a difficult family matter with care and dedication.",
      rating: 5
    }
  ];

  const services = [
    {
      icon: <Briefcase className="w-12 h-12" />,
      title: "Corporate Law",
      description: "Comprehensive legal solutions for businesses, including contracts, compliance, mergers, and corporate governance."
    },
    {
      icon: <Home className="w-12 h-12" />,
      title: "Family Law",
      description: "Sensitive handling of divorce, child custody, adoption, and other family-related legal matters."
    },
    {
      icon: <Building className="w-12 h-12" />,
      title: "Real Estate Law",
      description: "Expert guidance on property transactions, disputes, zoning issues, and real estate contracts."
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: "Criminal Defense",
      description: "Aggressive defense representation for various criminal charges with a focus on protecting your rights."
    },
    {
      icon: <FileText className="w-12 h-12" />,
      title: "Estate Planning",
      description: "Strategic planning for wills, trusts, probate, and estate administration to secure your legacy."
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: "Civil Litigation",
      description: "Skilled advocacy in civil disputes, including personal injury, contract disputes, and business litigation."
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
      <section className="bg-slate-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Legal Services</h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Providing expert legal representation with integrity, dedication, and proven results
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-shadow duration-300 border border-slate-200"
              >
                <div className="text-blue-900 mb-4">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {service.description}
                </p>
                <button className="mt-6 text-blue-900 hover:text-amber-700 font-semibold flex items-center group">
                  Learn More
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-16 bg-slate-500">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Client Testimonials
          </h2>
          
          <div className="max-w-4xl mx-auto relative">
            <div className="bg-white rounded-xl shadow-2xl p-8 md:p-12">
              <div className="text-amber-500 text-6xl mb-4">"</div>
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
                  className={`w-3 h-3 rounded-full transition-colors ${
                    currentSlide === index ? 'bg-amber-500' : 'bg-slate-400'
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