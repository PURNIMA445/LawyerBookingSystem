import React from 'react'

const HomePage = () => {
  return (
    <div>
      <div
        className="relative flex flex-col items-center justify-center text-center py-20 px-6 md:px-12  bg-[#142768]"
        
      >


     
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white/90">
            Book a trusted lawyer in minutes
          </h1>

          <p className="mt-6 text-sm sm:text-base md:text-lg text-white/80 leading-relaxed">
            Connect with trusted legal experts, compare profiles, and schedule
            consultations instantly—anytime, anywhere.
          </p>
        </div>
      </div>
      <div className="w-full p-4 ">
      <div className="flex flex-col max-w-7xl md:flex-row gap-3  md:px-7 py-4 mx-auto">

          {/* Location Input */}
          <div className="flex-1">
            <label className="block text-sm text-gray-900 mb-2">
              Location
            </label>
            <input
              type="text"
              placeholder="City, region, or online"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="flex-1">
            <label className="block text-sm text-gray-900 mb-2">
              Legal area
            </label>
            <input
              type="text"
              placeholder="e.g. Family law, Contracts"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />
          </div>

        
          <div className="flex-1">
            <label className="block text-sm text-gray-900 mb-2">
              Preferred date
            </label>
            <input
              type="date"
              placeholder="Select a date"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />
          </div>

        
          <div className="flex-1 md:flex-none">
            <label className="block text-sm text-gray-900 mb-2 md:hidden">
              &nbsp;
            </label>
            <button className="w-full py-2 md:w-auto md:py-7 px-6 bg-blue-600 text-white rounded-lg">
  Search
</button>

          </div>
        </div>
      </div>
    </div>

  )
}

export default HomePage