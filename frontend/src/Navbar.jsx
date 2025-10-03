import React, { useContext, useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { CartContext } from "./context/CartContext";
import { FaUserCircle } from "react-icons/fa";
import Logo from "../src/img/avishlogo.jpeg";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);

  const menuLinks = [
    { name: "Home", path: "/" },
    { name: "Bracelets", path: "/category/bracelets" },
    { name: "Rings", path: "/category/rings" },
    { name: "Earrings", path: "/category/earrings" },
    { name: "Necklaces", path: "/category/necklaces" },
    // { name: "Couple-Sets", path: "/category/couple-sets" },
    // { name: "Anklets", path: "/category/anklets" },
    { name: "Bags", path: "/category/bags" },
    { name: "Women-Dress", path: "/category/womendress" },
    { name: "Watch", path: "/category/watch" },
    { name: "About", path: "/about" },
  ];

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-[#faf9eb] shadow-md sticky px-2 top-0 z-50 text-amber-700 poppins-semibold text-lg uppercase">
      <div className="mx-auto">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-3xl font-bold text-[#ed9d58]">Avish</span>
            <span className="text-1xl font-bold pl-1 pt-4">JEWELS</span>
            {/* <img
              src={Logo}
              alt="Avish Jewels"
              className=" h-20 w-40 rounded-md"
              
            /> */}
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4 relative">
            {menuLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-dark hover:text-amber-600 transition"
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/search"
              className="text-dark hover:text-amber-600 transition"
            >
              Search
            </Link>

            {/* User Icon Dropdown */}
            {user ? (
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center text-dark hover:text-amber-600 transition focus:outline-none"
                >
                  <FaUserCircle className="h-8 w-8" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-[#faf9eb] shadow-lg rounded-md z-50">
                    <Link
                      to="/account"
                      className="block px-4 py-2 text-dark hover:text-amber-600 transition"
                    >
                      Account
                    </Link>
                    {user.role === "admin" && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-dark hover:text-amber-600 transition"
                      >
                        Admin
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-dark hover:text-amber-600 transition"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/authForm"
                className="text-dark hover:text-amber-600 transition"
              >
                Login
              </Link>
            )}

            {/* Cart Icon */}
            <Link to="/cart" className="relative">
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
              <span className="absolute -top-2 -right-2 bg-primary text-green-600 font-bold text-base rounded-full h-5 w-5 flex items-center justify-center">
                {cart?.totals?.totalItems || 0}
              </span>
            </Link>
          </div>

          {/* Mobile Menu Button & Cart */}
          <div className="flex md:hidden items-center space-x-4">
            {/* Cart Icon for mobile */}
            <Link to="/cart" className="relative">
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
              <span className="absolute -top-2 -right-2 bg-primary text-green-600 font-bold text-base rounded-full h-5 w-5 flex items-center justify-center">
                {cart?.totals?.totalItems || 0}
              </span>
            </Link>

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

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
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
            <Link
              to="/search"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 text-dark hover:text-amber-600 transition"
            >
              Search
            </Link>

            {user ? (
              <>
                <Link
                  to="/account"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 text-dark hover:text-amber-600 transition"
                >
                  Account
                </Link>
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 text-dark hover:text-amber-600 transition"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block py-2 text-left w-full text-dark hover:text-amber-600 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/authForm"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-dark hover:text-amber-600 transition"
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
