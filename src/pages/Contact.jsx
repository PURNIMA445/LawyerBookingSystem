// Contact.jsx
import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    caseType: '',
    message: '',
    preferredContact: 'email',
    urgency: 'normal'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  const caseTypes = [
    "Family Law",
    "Criminal Defense",
    "Corporate Law",
    "Immigration",
    "Real Estate",
    "Personal Injury",
    "Employment Law",
    "Intellectual Property",
    "Other"
  ];

  const officeLocations = [
    {
      city: "New York",
      address: "350 Fifth Avenue, Suite 4200",
      zip: "New York, NY 10118",
      phone: "+1 (212) 555-0123",
      email: "nyc@lawfirm.com",
      hours: "Mon - Fri: 9:00 AM - 6:00 PM"
    },
    {
      city: "Los Angeles",
      address: "633 West 5th Street, 28th Floor",
      zip: "Los Angeles, CA 90071",
      phone: "+1 (213) 555-0456",
      email: "la@lawfirm.com",
      hours: "Mon - Fri: 8:00 AM - 5:00 PM"
    },
    {
      city: "Chicago",
      address: "233 South Wacker Drive, Suite 8400",
      zip: "Chicago, IL 60606",
      phone: "+1 (312) 555-0789",
      email: "chicago@lawfirm.com",
      hours: "Mon - Fri: 9:00 AM - 6:00 PM"
    }
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-amber-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center max-w-lg w-full">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Message Sent Successfully!</h2>
          <p className="text-gray-600 mb-8">
            Thank you for reaching out. One of our legal experts will get back to you within 24 hours.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setFormData({
                name: '', email: '', phone: '', subject: '',
                caseType: '', message: '', preferredContact: 'email', urgency: 'normal'
              });
            }}
            className="px-8 py-3 bg-linear-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl
              hover:shadow-lg hover:shadow-amber-200 transition-all duration-300"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-amber-50">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-linear-to-l from-amber-100/50 to-transparent -z-10"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-200/30 rounded-full blur-3xl -z-10"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Get In Touch
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Contact Our
              <span className="block text-transparent bg-clip-text bg-linear-to-r from-amber-600 to-orange-600">
                Legal Team
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Have questions or need legal assistance? We're here to help. 
              Reach out to us and our experienced attorneys will respond promptly.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Contact Cards */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Phone */}
            <div className="group bg-white p-6 rounded-2xl shadow-lg shadow-gray-100/50 hover:shadow-xl transition-all duration-300 text-center">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4
                group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Call Us</h3>
              <p className="text-amber-600 font-medium">+1 (800) 555-LEGAL</p>
              <p className="text-gray-500 text-sm mt-1">Available 24/7</p>
            </div>

            {/* Email */}
            <div className="group bg-white p-6 rounded-2xl shadow-lg shadow-gray-100/50 hover:shadow-xl transition-all duration-300 text-center">
              <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4
                group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Email Us</h3>
              <p className="text-amber-600 font-medium">contact@lawfirm.com</p>
              <p className="text-gray-500 text-sm mt-1">Response within 24hrs</p>
            </div>

            {/* Location */}
            <div className="group bg-white p-6 rounded-2xl shadow-lg shadow-gray-100/50 hover:shadow-xl transition-all duration-300 text-center">
              <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4
                group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Visit Us</h3>
              <p className="text-amber-600 font-medium">3 Locations</p>
              <p className="text-gray-500 text-sm mt-1">NYC, LA, Chicago</p>
            </div>

            {/* Live Chat */}
            <div className="group bg-white p-6 rounded-2xl shadow-lg shadow-gray-100/50 hover:shadow-xl transition-all duration-300 text-center">
              <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4
                group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Live Chat</h3>
              <p className="text-amber-600 font-medium">Chat Now</p>
              <p className="text-gray-500 text-sm mt-1">Instant Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-3xl shadow-xl shadow-gray-100/50 p-8 lg:p-10">
                <div className="mb-8">
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Send Us a Message</h2>
                  <p className="text-gray-600">Fill out the form below and we'll get back to you as soon as possible.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name & Email Row */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 
                          focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 
                          focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* Phone & Subject Row */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 
                          focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        placeholder="How can we help?"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 
                          focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* Case Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type of Legal Matter <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="caseType"
                      value={formData.caseType}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 
                        focus:ring-amber-500 focus:border-transparent transition-all duration-300 bg-white"
                    >
                      <option value="">Select a case type</option>
                      {caseTypes.map((type, idx) => (
                        <option key={idx} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  {/* Preferred Contact & Urgency */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Preferred Contact Method
                      </label>
                      <div className="flex gap-4">
                        {['email', 'phone'].map((method) => (
                          <label key={method} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="preferredContact"
                              value={method}
                              checked={formData.preferredContact === method}
                              onChange={handleChange}
                              className="w-4 h-4 text-amber-500 focus:ring-amber-500 border-gray-300"
                            />
                            <span className="text-gray-700 capitalize">{method}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Urgency Level
                      </label>
                      <div className="flex gap-4">
                        {['normal', 'urgent'].map((level) => (
                          <label key={level} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="urgency"
                              value={level}
                              checked={formData.urgency === level}
                              onChange={handleChange}
                              className="w-4 h-4 text-amber-500 focus:ring-amber-500 border-gray-300"
                            />
                            <span className={`capitalize ${level === 'urgent' ? 'text-red-600 font-medium' : 'text-gray-700'}`}>
                              {level}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Please describe your legal matter in detail..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 
                        focus:ring-amber-500 focus:border-transparent transition-all duration-300 resize-none"
                    ></textarea>
                  </div>

                  {/* Privacy Notice */}
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      required
                      className="w-5 h-5 mt-0.5 text-amber-500 focus:ring-amber-500 border-gray-300 rounded"
                    />
                    <p className="text-sm text-gray-600">
                      I agree to the <a href="#" className="text-amber-600 hover:underline">Privacy Policy</a> and 
                      consent to being contacted regarding my inquiry. All information shared is confidential.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-linear-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl
                      hover:shadow-lg hover:shadow-amber-200 transition-all duration-300 hover:-translate-y-0.5
                      disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0
                      flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Office Locations Sidebar */}
            <div className="lg:col-span-2">
              <div className="sticky top-8 space-y-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Our Offices</h3>
                
                {officeLocations.map((office, idx) => (
                  <div key={idx} className="bg-white rounded-2xl shadow-lg shadow-gray-100/50 p-6 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-linear-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shrink-0">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-lg">{office.city}</h4>
                        <p className="text-gray-600 text-sm mt-1">{office.address}</p>
                        <p className="text-gray-600 text-sm">{office.zip}</p>
                        
                        <div className="mt-4 space-y-2">
                          <a href={`tel:${office.phone}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-amber-600 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            {office.phone}
                          </a>
                          <a href={`mailto:${office.email}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-amber-600 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {office.email}
                          </a>
                          <p className="flex items-center gap-2 text-sm text-gray-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {office.hours}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Emergency Card */}
                <div className="bg-linear-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-lg">Emergency Legal Help</h4>
                  </div>
                  <p className="text-red-100 text-sm mb-4">
                    For urgent legal matters requiring immediate attention, call our 24/7 emergency line.
                  </p>
                  <a href="tel:+18005550911" className="inline-flex items-center gap-2 bg-white text-red-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-red-50 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    +1 (800) 555-0911
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="aspect-21/9 bg-gray-200 flex items-center justify-center">
              {/* Replace with actual map embed */}
              <div className="text-center text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <p className="font-medium">Interactive Map</p>
                <p className="text-sm">Embed Google Maps or Mapbox here</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Contact;