import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = ({ cartItems }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // सारे menu links एक array में रखे
  const menuLinks = [
    { name: "Home", path: "/" },
    { name: "Bracelets", path: "/braceletsgrid" },
    { name: "Rings", path: "/ringsgrid" },
    { name: "Earrings", path: "/earringsgrid" },
    { name: "Necklaces", path: "/necklacesgrid" },
    { name: "Couple Sets", path: "/couplesetsgrid" },
    { name: "Anklet", path: "/ankletgrid" },
    { name: "About", path: "/about" },
  ];

  return (
    <nav className="bg-[#faf9eb] shadow-md sticky top-0 z-50 text-amber-700 poppins-semibold text-lg uppercase overflow-x-hidden">
      <div className="container mx-auto px-1 overflow-x-hidden">
        <div className="flex justify-between items-center py-4 px-1">
          {/* Logo - Left side */}
          <Link
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            to="/"
            className="flex items-center"
          >
            <span className="text-4xl font-sans font-bold text-[#ed9d58]">
              LUXURY
            </span>
            <span className="text-2xl font-sans font-bold pl-1 pt-4">
              JEWELS
            </span>
          </Link>
         
          {/* Right side (Links + Cart + Mobile Button) */}
          <div className="flex items-center space-x-4">
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-6">
              {menuLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-dark hover:text-amber-600 transition"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Cart Icon (Desktop) */}
            <div className="hidden md:flex items-center">
              <Link to="/cart">
                <button className="relative">
                  <svg
                    className="h-6 w-6 text-dark hover:text-amber-600 transition"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  <span className="absolute -top-2 -right-2 bg-primary text-green-600 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                </button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-dark focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4">
            {menuLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-dark hover:text-amber-600 transition"
              >
                {link.name}
              </Link>
            ))}

            {/* Cart Icon (Mobile) */}
            <div className="pt-2">
              <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)}>
                <button className="relative">
                  <svg
                    className="h-6 w-6 text-dark hover:text-amber-600 transition"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  <span className="absolute -top-2 -right-2 bg-primary text-green-600 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
