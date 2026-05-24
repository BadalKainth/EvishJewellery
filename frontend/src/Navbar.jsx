import React, { useContext, useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { CartContext } from "./context/CartContext";
import { FaUserCircle } from "react-icons/fa";
import Logo from "../src/img/avishlogo.jpeg";
import { primaryCategoryLinks } from "./constants/categories";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);

  const menuLinks = [
    { name: "Home", path: "/" },
    ...primaryCategoryLinks.map((category) => ({
      name: category.label,
      path: category.path,
    })),
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
    <nav className="sticky top-0 z-50 border-b border-[rgba(102,109,113,0.16)] bg-[rgba(251,249,242,0.92)] px-2 text-[#2b3134] shadow-[0_16px_40px_rgba(33,38,41,0.08)] backdrop-blur-xl poppins-semibold text-lg uppercase">
      <div className="mx-auto">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-3xl font-bold text-[#343b40]">Avish</span>
            <span className="text-1xl font-bold pl-1 pt-4 text-[#9b6b3f]">JEWELS</span>
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
                className="text-[#424a4f] hover:text-[#5b6268] transition"
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/search"
              className="text-[#424a4f] hover:text-[#5b6268] transition"
            >
              Search
            </Link>

            {/* User Icon Dropdown */}
            {user ? (
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center text-[#424a4f] hover:text-[#5b6268] transition focus:outline-none"
                >
                  <FaUserCircle className="h-8 w-8" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 z-50 w-40 rounded-2xl border border-[rgba(102,109,113,0.16)] bg-[rgba(255,253,249,0.98)] shadow-[0_18px_36px_rgba(33,38,41,0.12)]">
                    <Link
                      to="/account"
                      className="block px-4 py-2 text-[#424a4f] hover:text-[#5b6268] transition"
                    >
                      Account
                    </Link>
                    {user.role === "admin" && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-[#424a4f] hover:text-[#5b6268] transition"
                      >
                        Admin
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="w-full px-4 py-2 text-left text-[#424a4f] hover:text-[#5b6268] transition"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/authForm"
                className="text-[#424a4f] hover:text-[#5b6268] transition"
              >
                Login
              </Link>
            )}

            {/* Cart Icon */}
            <Link to="/cart" className="relative">
              <svg
                className="h-6 w-6 text-[#424a4f] hover:text-[#5b6268] transition"
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
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#ece4d8] text-[#5f4c38] font-bold text-base">
                {cart?.totals?.totalItems || 0}
              </span>
            </Link>
          </div>

          {/* Mobile Menu Button & Cart */}
          <div className="flex md:hidden items-center space-x-4">
            {/* Cart Icon for mobile */}
            <Link to="/cart" className="relative">
              <svg
                className="h-6 w-6 text-[#424a4f] hover:text-[#5b6268] transition"
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
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#ece4d8] text-[#5f4c38] font-bold text-base">
                {cart?.totals?.totalItems || 0}
              </span>
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-[#424a4f] focus:outline-none"
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
                className="block py-2 text-[#424a4f] hover:text-[#5b6268] transition"
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/search"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 text-[#424a4f] hover:text-[#5b6268] transition"
            >
              Search
            </Link>

            {user ? (
              <>
                <Link
                  to="/account"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 text-[#424a4f] hover:text-[#5b6268] transition"
                >
                  Account
                </Link>
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 text-[#424a4f] hover:text-[#5b6268] transition"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full py-2 text-left text-[#424a4f] hover:text-[#5b6268] transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/authForm"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-[#424a4f] hover:text-[#5b6268] transition"
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
