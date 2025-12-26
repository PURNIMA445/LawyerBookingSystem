import React, { useState } from "react";
import { Link } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";

const Navbar = () => {
    const [toggle, setToggle] = useState(false);

    const handleToggle = () => {
        setToggle(!toggle);
    };

    const navLinks = [
        { to: "/home", label: "Home" },
        { to: "/aboutus", label: "About" },
        { to: "/services", label: "Services" },
        { to: "/contact", label: "Contact" },
        { to: "/terms", label: "Terms" },
        { to: "/FAQ", label: "FAQ" }
    ];

    return (
        <div className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-4">
                {/* Main Navbar Row */}
                <div className="flex items-center justify-between lg:justify-center relative">

                    {/* Logo - Center on Mobile, Left on Desktop */}
                    <Link
                        to="/"
                        className="text-xl font-bold tracking-wide text-orange-600 absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0"
                    >
                        LEGALCONNECT
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-8 ml-12">
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className="text-gray-700 hover:text-amber-600 font-medium transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link
                            to="/login"
                            className="bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-6 py-2 rounded-md transition-all"
                        >
                            Login
                        </Link>
                    </nav>

                    {/* Spacer for mobile */}
                    <div className="lg:hidden w-11"></div>
                    {/* Hamburger - Left Side on Mobile */}
                    <div
                        onClick={handleToggle}
                        className="lg:hidden cursor-pointer p-2 rounded-md text-gray-800 hover:text-amber-600 hover:bg-gray-100 transition-all duration-200 active:scale-95"
                    >
                        {toggle ? (
                            <IoMdClose className="w-7 h-7" />
                        ) : (
                            <GiHamburgerMenu className="w-7 h-7" />
                        )}
                    </div>

                </div>

                {/* Mobile Dropdown Menu */}
                {toggle && (
                    <div className="lg:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
                        <nav className="flex flex-col gap-3">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className="text-gray-700 hover:text-amber-600 hover:bg-gray-50 font-medium py-2 px-4 rounded-md transition-colors"
                                    onClick={handleToggle}
                                >
                                    {link.label}
                                </Link>
                            ))}

                            <Link
                                to="/login"
                                className="mt-2 bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white py-2 px-4 rounded-md text-center font-medium transition-all"
                                onClick={handleToggle}
                            >
                                Login
                            </Link>
                        </nav>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;