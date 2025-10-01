import React from "react";
import {
  Facebook,
  Instagram,
  Twitter,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "../src/img/avishlogo.jpeg";


const Footer = () => {
  // Collections with routes
  const collections = [
    { name: "Bracelets", path: "/category/bracelets" },
    { name: "Rings", path: "/category/rings" },
    { name: "Earrings", path: "/category/earrings" },
    { name: "Necklaces", path: "/category/necklaces" },
    { name: "Couple Sets", path: "/category/couple-sets" },
    { name: "Anklet", path: "/category/anklets" },
    { name: "Bags", path: "/category/bags" },
    { name: "Women Dress", path: "/category/womendress" },
    { name: "Watch", path: "/category/watch" },
  ];

  // Quick Links with routes
  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Privacy Policy", path: "/privacy-policy" },
    { name: "Terms & Conditions", path: "/terms" },
  ];

  return (
    <footer className="bg-gradient-to-b from-[#0a0a0a] to-black text-white w-full shadow-2xl relative">
      <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Info */}
        <div>
          <h2 className="text-[#d4af37] font-serif font-semibold text-xl mb-6 border-b border-[#765900] pb-2">
            ✨{" "}
            <Link to="/">
              <span className="text-4xl font-sans font-bold text-[#ed9d58]">
                Avish
              </span>
              <span className="text-2xl font-sans font-bold pl-1 pt-4">
                JEWELS
              </span>
            </Link>
          </h2>

          <p className="text-gray-100">
            Avish jewels crafted with love and elegance, designed to shine with
            timeless beauty. Perfect for your special moments, anniversaries,
            weddings, and everyday elegance that reflects your true style.
          </p>
        </div>

        {/* Collections */}
        <div>
          <h3 className="text-[#d4af37] font-serif font-semibold text-xl mb-6 border-b border-[#765900] pb-2">
            Collections
          </h3>
          <ul className="space-y-2 text-gray-100 grid grid-cols-2 ">
            {collections.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className="flex items-center gap-2 hover:text-amber-500 transition-all hover:translate-x-1"
                >
                  <ChevronRight size={16} /> {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-[#d4af37] font-serif  font-semibold text-xl mb-6 border-b border-[#765900] pb-2">
            Quick Links
          </h3>
          <ul className="space-y-2 text-gray-100">
            {quickLinks.map((link, index) => (
              <li key={index}>
                <Link
                  to={link.path}
                  className="flex items-center gap-2 hover:text-amber-500 transition-all hover:translate-x-1"
                >
                  <ChevronRight size={16} /> {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-[#d4af37] font-serif font-semibold text-xl mb-6 border-b border-[#765900] pb-2">
            Contact Us
          </h3>
          <ul className="space-y-3 text-gray-100">
            <li className="flex items-center gap-2">
              <MapPin size={56} />{" "}
              <a
                href="https://maps.app.goo.gl/HUmqtcZjdoruMQD5A"
                target="_blank"
                rel="noopener noreferrer"
              >
                📍 35, I Block B, First floor, Arya samaj Road, Uttam Nagar New
                Delhi-110059
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={18} /> <a href="tel:+918882825761">+91 8882825761</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={18} />{" "}
              <a href="mailto:info.avishjewels@gmail.com ">
                info.avishjewels@gmail.com
              </a>
            </li>
          </ul>
          <div className="flex gap-8 px-6 py-4">
            <a
              target="_blank"
              href="https://www.facebook.com/people/World-Wide-Marketing/61564046626414/"
              className="hover:text-gold-400 transition-transform transform hover:scale-110"
            >
              <Facebook />
            </a>
            <a
              target="_blank"
              href="https://www.instagram.com/avish_jewels/"
              className="hover:text-gold-400 transition-transform transform hover:scale-110"
            >
              <Instagram />
            </a>
            <a
              target="_blank"
              href="#"
              className="hover:text-gold-400 transition-transform transform hover:scale-110"
            >
              <Twitter />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-4 text-center text-gray-100">
        © {new Date().getFullYear()} Avish Jewellery Store. All Rights Reserved.
      </div>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/918882825761
"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 text-white p-6 transition-all animate-bounce z-10"
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          alt="WhatsApp"
          className="w-16 h-16"
        />
      </a>
    </footer>
  );
};

export default Footer;
