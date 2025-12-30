import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle, Clock, DollarSign } from "lucide-react";
import { servicesData } from "../data/services";

export default function ServiceDetailsPage() {
  const { id } = useParams();
  const service = servicesData.find((s) => s.id === id);

  if (!service) return <h2 className="text-center mt-20">Service not found</h2>;

  const Icon = service.icon;

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100">
      
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-8">
        <Link
          to="/services"
          className="flex items-center text-blue-900 hover:text-blue-700 font-semibold transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Services
        </Link>
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="inline-block text-blue-900 mb-4">
            <Icon className="w-16 h-16" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {service.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {service.detail?.subtitle || service.description}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 pb-16">

        {/* What We Offer */}
        {service.detail?.offers && (
          <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200 mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">What We Offer</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {service.detail.offers.map((offer, i) => (
                <div key={i} className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">{offer.title}</h3>
                    <p className="text-slate-600">{offer.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Steps & Pricing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          
          {/* How It Works */}
          {service.detail?.steps && (
            <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
              <div className="flex items-center mb-6">
                <Clock className="w-8 h-8 text-blue-900 mr-3" />
                <h2 className="text-2xl font-bold text-slate-900">How It Works</h2>
              </div>
              <div className="space-y-4">
                {service.detail.steps.map((step, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <div className="shrink-0 w-8 h-8 bg-blue-900 text-white rounded-full flex items-center justify-center font-bold">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{step.title}</h3>
                      <p className="text-slate-600 text-sm">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pricing */}
          {service.detail?.pricing && (
            <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
              <div className="flex items-center mb-6">
                <DollarSign className="w-8 h-8 text-blue-900 mr-3" />
                <h2 className="text-2xl font-bold text-slate-900">Pricing</h2>
              </div>
              <div className="space-y-6">
                {service.detail.pricing.map((price, i) => (
                  <div 
                    key={i} 
                    className={`${i !== service.detail.pricing.length - 1 ? 'border-b border-slate-200 pb-4' : 'pb-4'}`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-slate-900">{price.title}</h3>
                      <span className="text-2xl font-bold text-blue-900">{price.price}</span>
                    </div>
                    <p className="text-slate-600 text-sm">{price.note}</p>
                  </div>
                ))}
                <div className="bg-blue-50 rounded-lg p-4 mt-4">
                  <p className="text-sm text-blue-900 font-semibold">
                    Free initial consultation • Flexible payment plans available
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="bg-linear-to-r from-blue-900 to-blue-700 rounded-xl shadow-2xl p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Schedule a consultation with our experienced legal team and let us help you navigate your legal matters.
          </p>
          <button className="bg-white text-blue-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg">
            Book Appointment Now
          </button>
        </div>

      </section>
    </div>
  );
}