import React from "react";
import { MapPinPlus, Phone, MailPlus,  } from "lucide-react";



const AboutUsPage = () => {
  return (
    <div className="min-h-screen bg-white poppins-regular">
      {/* Hero Section */}
      <section className=" p-8 md:px-8 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-amber-800 p-2">
            
            About Avish Jewellery
          </h1>
          <p className="text-lg md:text-xl text-justify md:text-center text-gray-950 max-w-7xl mx-auto leading-relaxed">
            Avish Jewellery presents to you an eternally elegant combination of
            tradition and modern style in genuine hallmarked gold and 925
            sterling silver jewellery. Each piece is made with love, purity, and
            artistry – elevating jewellery from mere ornament to a tale of love,
            elegance, and uniqueness.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-xl font-bold text-amber-700 mb-6 md:text-justify">
                Avish Jewellery – Authentic Gold & Silver Jewellery That Blends
                Tradition with Modern Elegance
              </h2>
              <p className="md:text-base text-sm text-gray-900 mb-6 text-justify">
                At Avish Jewellery, authenticity is paramount. Every item is
                accompanied by a certificate of purity, crafted with
                skin-friendly, hypoallergenic metals, and nicely packaged for
                giving. With free delivery, hassle-free returns, and dependable
                service, we make your jewellery buying experience convenient,
                dependable, and memorable.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-4">
                    <div className="w-6 h-6 bg-blue-600 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Innovation</h3>
                    <p className="text-gray-600">
                      Constantly pushing boundaries
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
                      Excellence in everything we do
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-purple-100 p-2 rounded-full mr-4">
                    <div className="w-6 h-6 bg-purple-600 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Collaboration
                    </h3>
                    <p className="text-gray-600">
                      Working together for success
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

      {/* Team Section */}
      <section className="p-6 md:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 p-6">
            Our Product
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8  md:h-72">
            {/* Team Member 1 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow hover:scale-105">
              <div className="h-full overflow-hidden">
                <img
                  src="https://cdn.pixabay.com/photo/2017/03/17/02/40/rings-2150772_1280.jpg"
                  alt="Portrait of Sarah Johnson, CEO and founder with professional attire and confident smile in a modern office setting"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Team Member 2 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow hover:scale-105">
              <div className="h-full overflow-hidden">
                <img
                  src="https://cdn.pixabay.com/photo/2023/06/02/18/27/ai-generated-8036196_640.jpg"
                  alt="Portrait of Michael Chen, Lead Developer wearing casual attire and glasses, working at a computer workstation"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Team Member 3 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow hover:scale-105">
              <div className="h-full overflow-hidden">
                <img
                  src="https://plus.unsplash.com/premium_photo-1681276169450-4504a2442173?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Portrait of Emily Rodriguez, Design Director with creative style and warm expression in a design studio environment"
                  className="w-full h-full object-cover "
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
            Interested in working with us or learning more about our services?
            We'd love to hear from you.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <a
                  href="mailto:hello@gmail.com"
                  className="text-gray-600 hover:underline"
                >
                  <div className="w-6 h-6 rounded-sm">
                    <MailPlus />
                  </div>
                </a>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
              <a
                href="mailto:hello@gmail.com"
                className="text-gray-600 hover:underline"
              >
                hello@company.com
              </a>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <a
                  href="tel:+919876543210"
                  className="text-blue-600 hover:underline"
                >
                  <div className="w-6 h-6 rounded-sm">
                    <Phone />
                  </div>
                </a>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Phone</h3>
              <a
                href="tel:+919876543210"
                className="text-blue-600 hover:underline"
              >
                +91 98765 43210
              </a>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <a
                  href="https://www.google.com/maps?q=28.6139,77.2090"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:underline"
                >
                  <div className="w-6 h-6  rounded-sm">
                    <MapPinPlus />
                  </div>
                </a>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
              <a
                href="https://www.google.com/maps?q=28.6139,77.2090"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:underline"
              >
                📍 New Delhi, India
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="py-8 px-5 text-sm md:text-base  md:px-20 space-y-2 text-justify text-gray-950 ">
        <h1 className="font-bold text-lg md:text-xl text-amber-600 text-start  md:text-center py-2 md:py4">
          About Avish Jewellery – Fusing Tradition with Contemporary Elegance
        </h1>
        <p>
          Whether you wish to purchase online gold and silver jewellery in
          India, find innovative temple-inspired jewellery designs, or search
          through new-age, designer jewellery collections, Avish Jewellery is
          your go-to destination.
        </p>
        <p>
          At Avish Jewellery, we love each piece of jewellery more than a mere
          accessory – it is a reflection of beauty, affection, and uniqueness.
          In tradition yet guided by contemporary trends, our collections are
          designed in hallmarked gold and 925 sterling silver with
          uncompromising integrity. From anklets that proclaim elegance, to
          necklaces that pay homage to heritage, bracelets that infuse charm,
          rings that speak of ageless love, and earrings that inspire everyday
          style – each piece is imagined to commemorate life's treasured
          moments. When you wear Avish Jewellery, you don't merely adorn
          yourself with jewellery; you are carrying art that fuses tradition
          with your style.
        </p>
        <p>
          We, at Avish Jewellery, feel that jewellery is more than just an
          accessory, but something that reflects your personality, feelings, and
          ageless memories. Every piece is designed with passion, genuineness,
          and artistry – something more than a mere adornment, but something
          that is a part of your life's story.
        </p>
        <p>
          Our in-house collections are created in hallmarked gold and 925
          sterling silver, guaranteeing purity, strength, and reliability. From
          bracelets which add effortless glamour to your daily fashion, to rings
          that represent love and devotion, from earrings which add a touch of
          glamour to your style, to necklaces which combine modern style with
          cultural heritage – Avish Jewellery has it all. For couples, we have
          matching sets of jewellery which commemorate unity, while our anklets
          combine traditional beauty with stylish, contemporary designs for
          women of all ages.
        </p>
        <p>
          We pride ourselves on the blending of classic motifs with modern
          styles and thus present jewellery that is chic enough for weddings,
          festivals, parties, or everyday wear. Each piece is specially designed
          to be suitable for the contemporary woman yet remains grounded in
          classic Indian craftsmanship.
        </p>
        <p>
          Authenticity is the priority at Avish Jewellery. All purchases come
          with a certificate of purity, beautiful packaging, and a guarantee of
          skin-safe, hypoallergenic materials. With free shipping, hassle-free
          returns, and customer-centric service, we make your jewellery shopping
          experience as lovely to have as it is to wear.
        </p>
        <p>
          Whether you want to purchase gold & silver jewellery in India online,
          browse designer & traditional collections or shop for trendy jewellery
          pieces, Avish Jewellery is your go-to destination. We don't only make
          jewellery – we make memories that last a lifetime.
        </p>
      </div>
    </div>
  );
};

export default AboutUsPage;
