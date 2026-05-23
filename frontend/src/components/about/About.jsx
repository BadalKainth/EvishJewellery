import React from "react";
import { 
  MapPinPlus, 
  Phone, 
  MailPlus, 
  Award, 
  Sparkles, 
  Heart, 
  Gem,
  CheckCircle2
} from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../img/avishlogo.jpeg";

const AboutUsPage = () => {
  return (
    <div className="min-h-screen bg-white poppins-regular">
      {/* Hero Section */}
      <section className="py-16 px-4 md:px-8 bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <Gem className="w-12 h-12 text-amber-600 animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-amber-800 p-2 font-serif">
            Welcome to Avish Jewels
          </h1>
          <p className="text-xl md:text-2xl text-amber-900 max-w-4xl mx-auto font-medium mt-4 leading-relaxed italic">
            "At Avish Jewels, we believe every product should feel special —just like a precious jewel."
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-amber-700 mb-6 font-serif">
                Our Mission & Story
              </h2>
              <p className="md:text-lg text-base text-gray-800 mb-6 text-justify leading-relaxed">
                Our mission is to bring unique, stylish, useful, and premium-quality products that add happiness and value to everyday life.
              </p>
              <p className="md:text-base text-sm text-gray-600 mb-8 text-justify leading-relaxed">
                From kids’ learning toys to modern water bottles, smart home essentials, and decorative items, every product at Avish Jewels is selected with care, quality, and creativity. We inspect each offering to ensure it meets our strict standards of craftsmanship and modern design.
              </p>
              
              <div className="border-l-4 border-amber-500 pl-4 py-2 bg-amber-50 rounded-r-md">
                <p className="text-amber-950 font-medium italic">
                  Just like every jewel has its own shine, every product at Avish Jewels is designed to stand out with uniqueness, durability, and a premium feel.
                </p>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-2xl transition-transform duration-300 hover:scale-105">
              <Link to="/">
                <img
                  src={logo}
                  alt="Avish Jewels Storefront Logo"
                  className="w-full h-[450px] object-cover"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Focus Points Section */}
      <section className="py-16 px-4 md:px-8 bg-amber-50/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-amber-800 mb-12 font-serif">
            What We Focus On
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow border border-amber-100 flex flex-col items-center">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4 text-amber-700">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">Premium Quality</h3>
              <p className="text-gray-600 text-xs sm:text-sm">Finest craftsmanship and top-tier materials.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow border border-amber-100 flex flex-col items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4 text-orange-600">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">Trendy & Unique</h3>
              <p className="text-gray-600 text-xs sm:text-sm">Distinctive designs that stand out in style.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow border border-amber-100 flex flex-col items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4 text-yellow-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">Everyday Essentials</h3>
              <p className="text-gray-600 text-xs sm:text-sm">Highly useful products for modern daily lives.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow border border-amber-100 flex flex-col items-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4 text-emerald-600">
                <Gem className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">Affordable Luxury</h3>
              <p className="text-gray-600 text-xs sm:text-sm">High-end luxury experiences within your reach.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow border border-amber-100 flex flex-col items-center">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mb-4 text-rose-600">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">Trust & Satisfaction</h3>
              <p className="text-gray-600 text-xs sm:text-sm">Prioritizing customer happiness above all.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Section */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-amber-800 mb-12 font-serif">
            Our Curated Ranges
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group">
              <div className="h-64 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1515488042361-404e9250afef?q=80&w=640"
                  alt="Kids learning toys collection"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/25 flex items-end p-4">
                  <span className="text-white font-bold text-lg font-serif">Tiny Treasures (Kids & Toys)</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group">
              <div className="h-64 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=640"
                  alt="Hydro Luxe insulated bottles"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/25 flex items-end p-4">
                  <span className="text-white font-bold text-lg font-serif">Hydro Luxe (Drinkware)</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group">
              <div className="h-64 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=640"
                  alt="Aura Decor collection"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/25 flex items-end p-4">
                  <span className="text-white font-bold text-lg font-serif">Aura Decor (Home Essentials)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Slogan Ribbon */}
      <section className="py-12 bg-amber-800 text-white text-center px-4">
        <h2 className="text-2xl md:text-3xl font-bold font-serif italic tracking-wide">
          Avish Jewels — Where Every Product Shines Like a Jewel.
        </h2>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 md:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-amber-800 mb-6 font-serif">
            Get In Touch
          </h2>
          <p className="text-lg text-gray-700 mb-12">
            Have questions about our collections, customized orders, or want to say hello? Reach out anytime!
          </p>

          <div className="grid sm:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-amber-100 flex flex-col items-center">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4 text-amber-700">
                <MailPlus className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Email</h3>
              <a
                href="mailto:info.avishjewels@gmail.com"
                className="text-amber-800 hover:underline break-all"
              >
                info.avishjewels@gmail.com
              </a>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-amber-100 flex flex-col items-center">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4 text-amber-700">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Phone</h3>
              <a
                href="tel:+918882825761"
                className="text-amber-800 hover:underline"
              >
                +91 8882825761
              </a>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-amber-100 flex flex-col items-center">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4 text-amber-700">
                <MapPinPlus className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Location</h3>
              <a
                href="https://maps.app.goo.gl/HUmqtcZjdoruMQD5A"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-800 hover:underline text-sm leading-relaxed"
              >
                📍 510 5thFloor Vishwa Sadan Building , Distt Centre Janak Puri New Delhi -110058
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;
