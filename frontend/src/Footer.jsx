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
import { primaryCategoryLinks } from "./constants/categories";

const Footer = () => {
  // Collections with routes
  const collections = primaryCategoryLinks.map((category) => ({
    name: category.label,
    path: category.path,
  }));

  // Quick Links with routes
  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Privacy Policy", path: "/privacy-policy" },
    { name: "Terms & Conditions", path: "/terms" },
    { name: "Refund, Return Policy", path: "/refund" },
  ];

  return (
    <footer className="theme-footer text-white w-full shadow-2xl relative">
      <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Info */}
        <div>
          <h2 className="text-[#d8b07a] font-serif font-semibold text-xl mb-6 border-b border-[rgba(212,176,122,0.35)] pb-2">
            ✨{" "}
            <Link to="/">
              <span className="text-4xl font-sans font-bold text-[#f2f1ed]">
                Avish
              </span>
              <span className="text-2xl font-sans font-bold pl-1 pt-4 text-[#d8b07a]">
                JEWELS
              </span>
            </Link>
          </h2>

          <p className="text-slate-300 text-sm leading-relaxed">
            Welcome to Avish Jewels —your destination for premium-quality toys,
            stylish bottles, home essentials, and unique decor products. Every
            item is carefully selected to deliver quality, style, and uniqueness
            —just like a precious jewel.
          </p>
        </div>

        {/* Collections */}
        <div>
          <h3 className="text-[#d8b07a] font-serif font-semibold text-xl mb-6 border-b border-[rgba(212,176,122,0.35)] pb-2">
            Collections
          </h3>
          <ul className="space-y-2 text-slate-200">
            {collections.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className="flex items-center gap-2 hover:text-[#d8b07a] transition-all hover:translate-x-1"
                >
                  <ChevronRight size={16} /> {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-[#d8b07a] font-serif  font-semibold text-xl mb-6 border-b border-[rgba(212,176,122,0.35)] pb-2">
            Quick Links
          </h3>
          <ul className="space-y-2 text-slate-200">
            {quickLinks.map((link, index) => (
              <li key={index}>
                <Link
                  to={link.path}
                  className="flex items-center gap-2 hover:text-[#d8b07a] transition-all hover:translate-x-1"
                >
                  <ChevronRight size={16} /> {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-[#d8b07a] font-serif font-semibold text-xl mb-6 border-b border-[rgba(212,176,122,0.35)] pb-2">
            Contact Us
          </h3>
          <ul className="space-y-3 text-slate-200">
            <li className="flex items-center gap-2">
              <MapPin size={56} />{" "}
              <a
                href="https://maps.app.goo.gl/HUmqtcZjdoruMQD5A"
                target="_blank"
                rel="noopener noreferrer"
              >
                Office No. 510, 5thFloor Vishwa Sadan Building , Distt Centre
                Janak Puri New Delhi -110058
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
              className="hover:text-[#d8b07a] transition-transform transform hover:scale-110"
            >
              <Facebook />
            </a>
            <a
              target="_blank"
              href="https://www.instagram.com/avishenterprises_/"
              className="hover:text-[#d8b07a] transition-transform transform hover:scale-110"
            >
              <Instagram />
            </a>
            <a
              target="_blank"
              href="https://www.amazon.in/s?i=merchant-items&me=A3PX8ICH3WTR1O&s=popularity-rank&fs=true&ref=lp_27943762031_sar"
              className="hover:text-[#d8b07a] transition-transform transform hover:scale-110"
            >
              <Twitter />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[rgba(216,176,122,0.14)] py-4 text-center text-slate-300">
        &copy; 2025 Avish Jewellery Store. All Rights Reserved.
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
