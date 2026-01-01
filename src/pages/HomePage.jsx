import React, { useState } from "react";

const HomePage = () => {
  const [searchData, setSearchData] = useState({
    location: "",
    specialization: "",
    date: ""
  });

  const lawyers = [
    { id: 1, name: "Dr. Sarah Mitchell", specialization: "Corporate Law", experience: "15 years", availability: "Available" },
    { id: 2, name: "James Anderson", specialization: "Criminal Defense", experience: "12 years", availability: "Available" },
    { id: 3, name: "Maria Santos", specialization: "Family Law", experience: "10 years", availability: "Busy" },
    { id: 4, name: "Robert Chen", specialization: "Real Estate Law", experience: "18 years", availability: "Available" },
  ];

  const specializations = [
    "Corporate Law",
    "Criminal Defense",
    "Family Law",
    "Real Estate Law",
    "Immigration Law",
    "Tax Law",
    "Intellectual Property",
    "Employment Law"
  ];

  const handleSearch = () => {
    console.log("Search Data:", searchData);
    // Add your search API call here
  };

  const handleBookAppointment = (lawyerId) => {
    console.log("Booking appointment with lawyer:", lawyerId);
    // Add your booking logic here
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* Hero Section */}
      <div className="bg-[#182347] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            Professional Legal Consultation
          </h1>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto opacity-90">
            Schedule your appointment with qualified legal professionals
          </p>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                placeholder="Enter city"
                value={searchData.location}
                onChange={(e) => setSearchData({...searchData, location: e.target.value})}
                className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#142768]"
              />
            </div>

            {/* Specialization */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specialization
              </label>
              <select
                value={searchData.specialization}
                onChange={(e) => setSearchData({...searchData, specialization: e.target.value})}
                className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#142768]"
              >
                <option value="">All Specializations</option>
                {specializations.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={searchData.date}
                onChange={(e) => setSearchData({...searchData, date: e.target.value})}
                className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#142768]"
              />
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                className="w-full bg-[#142768] hover:bg-indigo-700 text-white font-medium py-2.5 px-6 rounded transition duration-300"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lawyers List */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-[#142768] mb-8 text-center">
          Available Lawyers
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {lawyers.map(lawyer => (
            <div key={lawyer.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-xl transition relative overflow-hidden group">
              
              {/* Accent stripe */}
              <div className="absolute top-0 left-0 h-full w-1 bg-[#142768] group-hover:w-full transition-all duration-500 opacity-14"></div>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative z-10">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{lawyer.name}</h3>
                  <p className="text-gray-600 mb-2">{lawyer.specialization}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Experience: {lawyer.experience}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      lawyer.availability === 'Available' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {lawyer.availability}
                    </span>
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => handleBookAppointment(lawyer.id)}
                    disabled={lawyer.availability !== 'Available'}
                    className={`px-6 py-2.5 rounded font-medium transition duration-300 ${
                      lawyer.availability === 'Available'
                        ? 'bg-[#142768] hover:bg-indigo-700 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

   
    </div>
  );
};

export default HomePage;
