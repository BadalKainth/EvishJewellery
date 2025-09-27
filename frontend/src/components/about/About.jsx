import React from "react";
import { MapPinPlus, Phone, MailPlus } from "lucide-react";

const AboutUsPage = () => {
  return (
    <div className="min-h-screen bg-white poppins-regular">
      {/* Hero Section */}
      <section className="p-8 md:px-8 bg-gradient-to-r from-blue-100 to-indigo-50">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-amber-800 p-2">
            About Avish Jewellery
          </h1>
          <p className="text-lg md:text-xl text-justify md:text-center text-gray-950 max-w-7xl mx-auto leading-relaxed">
            Avish Jewellery brings you a world of exquisite craftsmanship and
            timeless designs. Each piece is thoughtfully created to elevate
            everyday style, celebrate special moments, and reflect your
            personality with elegance and sophistication.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-xl font-bold text-amber-700 mb-6 md:text-justify">
                Avish Jewellery – Designs That Speak Elegance and Uniqueness
              </h2>
              <p className="md:text-base text-sm text-gray-900 mb-6 text-justify">
                At Avish Jewellery, every creation is made with precision and
                care. We focus on bringing you pieces that are stylish, durable,
                and perfect for any occasion. Our collections are crafted to
                inspire confidence and leave a lasting impression.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-4">
                    <div className="w-6 h-6 bg-blue-600 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Innovation</h3>
                    <p className="text-gray-600">
                      Constantly creating unique and stylish designs
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-full mr-4">
                    <div className="w-6 h-6 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Quality</h3>
                    <p className="text-gray-600">
                      Durable and reliable pieces you can trust
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-purple-100 p-2 rounded-full mr-4">
                    <div className="w-6 h-6 bg-purple-600 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Customer Satisfaction
                    </h3>
                    <p className="text-gray-600">
                      We prioritize your happiness with every purchase
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img
                src="https://images.pexels.com/photos/6567673/pexels-photo-6567673.jpeg"
                alt="Team collaboration in a modern office space with diverse professionals working together around a table"
                className="w-full h-[550px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Product Section */}
      <section className="p-6 md:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 p-6">
            Our Collections
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:h-72">
            {/* product 1 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow hover:scale-105">
              <div className="h-full overflow-hidden">
                <img
                  src="https://cdn.pixabay.com/photo/2017/03/17/02/40/rings-2150772_1280.jpg"
                  alt="Elegant and stylish ring set designed for modern tastes"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* product 2 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow hover:scale-105">
              <div className="h-full overflow-hidden">
                <img
                  src="https://cdn.pixabay.com/photo/2023/06/02/18/27/ai-generated-8036196_640.jpg"
                  alt="Beautiful bracelet designed for everyday elegance"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* product 3 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow hover:scale-105">
              <div className="h-full overflow-hidden">
                <img
                  src="https://plus.unsplash.com/premium_photo-1681276169450-4504a2442173?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Exquisite earrings designed for elegance and charm"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-4 md:py-12 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Get In Touch
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Interested in collaborating with us or exploring our latest
            collections? We'd love to hear from you.
          </p>

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12 justify-center items-center">
            {/* Email */}
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <a
                  href="mailto:info.avishjewels@gmail.com "
                  className="text-gray-600 hover:underline"
                >
                  <div className="w-6 h-6 rounded-sm">
                    <MailPlus />
                  </div>
                </a>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
              <a
                href="mailto:info.avishjewels@gmail.com "
                className="text-gray-600 hover:underline"
              >
                info.avishjewels@gmail.com
              </a>
            </div>

            {/* Phone */}
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <a
                  href="tel:+9188828 25761"
                  className="text-gray-600 md:text-blue-600 hover:underline"
                >
                  <div className="w-6 h-6 rounded-sm">
                    <Phone />
                  </div>
                </a>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Phone</h3>
              <a
                href="tel:+9188828 25761"
                className="text-gray-600 md:text-blue-600 hover:underline"
              >
                +91 88828 25761
              </a>
            </div>

            {/* Location */}
            <div className="text-center col-span-2 md:col-span-1">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <a
                  href="https://maps.app.goo.gl/HUmqtcZjdoruMQD5A"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="md:text-gray-600 text-blue-600 hover:underline"
                >
                  <div className="w-6 h-6 rounded-sm">
                    <MapPinPlus />
                  </div>
                </a>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
              <a
                href="https://maps.app.goo.gl/HUmqtcZjdoruMQD5A"
                target="_blank"
                rel="noopener noreferrer"
                className="md:text-gray-600 text-blue-600 hover:underline"
              >
                📍 35, I Block B , First floor ,Arya samaj Road , Uttam Nagar
                New Delhi-110059
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Paragraphs */}
      <div className="py-8 px-5 text-sm md:text-base md:px-20 space-y-4 text-justify text-gray-950">
        <h1 className="font-bold text-lg md:text-xl text-amber-600 text-start md:text-center py-2">
          Avish Jewellery – Where Elegance Meets Creativity
        </h1>
        <p>
          Avish Jewellery is your ultimate destination for stylish,
          trend-forward collections. Each piece is crafted to reflect modern
          tastes while celebrating individuality and timeless beauty.
        </p>
        <p>
          We design pieces that become a part of your life story, whether for
          everyday elegance, special celebrations, or memorable gifts for loved
          ones.
        </p>
        <p>
          Our mission is to combine creativity, quality, and customer-centric
          service. Every creation reflects attention to detail, passion, and a
          commitment to exceed your expectations.
        </p>
        <p>
          With Avish Jewellery, you are not just buying accessories – you are
          choosing style, confidence, and moments that make a lasting impact.
        </p>
        <p>
          We ensure hassle-free service, responsive support, and a shopping
          experience that feels premium, enjoyable, and memorable. Your trust is
          our top priority, and every interaction is designed to delight you.
        </p>
      </div>
    </div>
  );
};

export default AboutUsPage;
