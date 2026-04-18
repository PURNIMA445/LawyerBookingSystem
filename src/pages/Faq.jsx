import React, { useState, useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';
import axios from 'axios';

const AccordionItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border-b border-gray-200 last:border-none">
      <button
        onClick={onClick}
        className="w-full py-5 px-6 flex justify-between items-center text-left hover:bg-gray-50 transition-colors duration-300"
      >
        <span className="font-medium text-gray-800 pr-4">{question}</span>
        <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className="px-6 pb-5 text-gray-600 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
};

const ImageCard = ({ src, alt, delay = 0 }) => {
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    });

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-700 ease-out
        ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="aspect-4/3 overflow-hidden">
        <img src={src} alt={alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1" />
      </div>
      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          <p className="text-white font-medium">{alt}</p>
        </div>
      </div>
    </div>
  );
};

const FAQ = () => {
  const [faqData, setFaqData] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState(0);

  useEffect(() => {
    const lenis = new Lenis();
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, faqRes] = await Promise.all([
          axios.get('http://localhost:5000/api/faqCategory'),
          axios.get('http://localhost:5000/api/faqs')
        ]);

        const categories = catRes.data;
        const faqs = faqRes.data;

        const formatted = categories.map(cat => {
          const relatedFaqs = faqs
            .filter(f => f.category_id === cat.category_id)
            .map(f => ({
              q: f.question,
              a: f.answer
            }));

          return {
            category: cat.name,
            questions: relatedFaqs
          };
        });

        setFaqData(formatted);

      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (!faqData.length) {
    return <div className="text-center py-20">Loading FAQs...</div>;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-indigo-50">

      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Frequently Asked
              <span className="block text-transparent bg-clip-text bg-[#142768]">
                Questions
              </span>
            </h1>

            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about our lawyer appointment system.
            </p>

            <div className="mt-10 max-w-xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search your question..."
                  className="w-full px-6 py-4 pl-14 rounded-2xl border border-gray-500 shadow-lg shadow-gray-100/50"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="container mx-auto grid md:grid-cols-3 gap-6">
          <ImageCard src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600" alt="Legal Consultation" />
          <ImageCard src="https://images.unsplash.com/photo-1521791055366-0d553872125f?w=600" alt="Professional Lawyers" />
          <ImageCard src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600" alt="Document Review" />
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container mx-auto grid lg:grid-cols-12 gap-12">

          <div className="lg:col-span-4">
            <div className="sticky top-8 space-y-2">
              {faqData.map((category, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveCategory(idx)}
                  className={`w-full text-left px-5 py-4 rounded-xl flex items-center gap-3
                    ${activeCategory === idx ? 'bg-[#142768] text-white' : 'bg-white'}`}
                >
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  {category.category}
                  <span className="ml-auto">{category.questions.length}</span>
                </button>
              ))}
            </div>
            <div className="mt-8 p-6 bg-slate-900  rounded-2xl text-white">
              <div className="w-12 h-12 bg-indigo-900 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h4 className="font-semibold text-lg mb-2">Still have questions?</h4>
              <p className="text-slate-400 text-sm mb-4">Our support team is here to help you 24/7</p>
              <a href='tel:+9779800000001'>
                <button className="w-full py-3 bg-[#142768] hover:bg-indigo-600 rounded-xl font-medium transition-colors duration-300">
                  Contact Support
                </button>

              </a>
            </div>

          </div>

          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

              <div className="p-6 border-b">
                <h2 className="text-2xl font-bold">
                  {faqData[activeCategory].category}
                </h2>
                <p className="text-gray-500">
                  {faqData[activeCategory].questions.length} questions in this category
                </p>
              </div>

              <div className="divide-y">
                {faqData[activeCategory].questions.map((item, idx) => (
                  <AccordionItem
                    key={idx}
                    question={item.q}
                    answer={item.a}
                    isOpen={openIndex === idx}
                    onClick={() => handleToggle(idx)}
                  />
                ))}
              </div>




            </div>
            <div className="mt-8 grid sm:grid-cols-2 gap-6">
              <div className="group p-6 bg-white rounded-2xl shadow-lg shadow-gray-100/50 hover:shadow-xl transition-all duration-300 cursor-pointer">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4 
                    group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">User Guide</h3>
                <p className="text-gray-500 text-sm">Complete documentation for using our platform</p>
              </div>

              <div className="group p-6 bg-white rounded-2xl shadow-lg shadow-gray-100/50 hover:shadow-xl transition-all duration-300 cursor-pointer">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4
                    group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Video Tutorials</h3>
                <p className="text-gray-500 text-sm">Watch step-by-step guides and tutorials</p>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

export default FAQ;



