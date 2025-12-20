import React, { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";

import { IoMdClose } from "react-icons/io";
const Header = () => {
    const [toggle, setToggle] = useState(false)
    const handleToggle = () => {
        setToggle(!toggle)

    }
    return (
        <header className="w-full border-b border-gray-200 bg-white">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

                {/* Logo */}
                <div className="text-xl font-bold tracking-wide">
                    LEXAPPOINTMENT
                </div>

                {/* Navbar Menu */}
                <nav
                    className={`${toggle ? "flex" : "hidden"} flex-col gap-4 lg:flex lg:flex-row lg:gap-8`}
                >
                    <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">
                        Home
                    </a>
                    <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">
                        About
                    </a>
                    <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">
                        Services
                    </a>
                    <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">
                        Contact
                    </a>
                    <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">
                        Terms and Conditions
                    </a>
                </nav>


                {/* Right Section */}
                <div className="flex items-center gap-4">

                    {/* Search (Desktop only) */}
                    <div className="hidden sm:flex items-center rounded-md ">
                        <button className="bg-blue-600  text-white px-6 py-2 rounded-md font-medium transition">
                            Login
                        </button>

                    </div>

                    {/* Hamburger icon*/}

                    <div
                        onClick={handleToggle}
                        className="lg:hidden cursor-pointer p-2 rounded-md 
                        text-gray-800 hover:text-blue-600 
                        hover:bg-gray-100 
                        transition-all duration-200 
                        active:scale-95"
                    >
                        {toggle ? (
                            <IoMdClose className="w-7 h-7 transition-transform duration-200" />
                        ) : (
                            <GiHamburgerMenu className="w-7 h-7 transition-transform duration-200" />
                        )}
                    </div>

                </div>
            </div>
        </header>
    );
};

export default Header;