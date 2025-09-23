import React from "react";

import bracelet9 from "../Bracelets/img/bracelet9.jpg";
import necklaces1 from "../Necklaces/img/necklaces1.jpg";
import { Link } from "react-router-dom";

const OurCollections = () => {
  return (
    <>
      {/* <!-- Collections Section --> */}
      <section
        id="collections"
        className="py-6 bg-[#fcf8dd] poppins-regular overflow-hidden"
      >
        <div className="container mx-auto px-4">
          <div className="text-center pb-5">
            <h2 className="text-4xl text-gray-950 mb-2 uppercase cormorant-garamond-bold">
              Our Collections
            </h2>
            <p className="text-dark max-w-2xl mx-auto">
              Each piece is crafted with precision and passion to celebrate
              life's special moments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* <!-- Collection 1 --> */}

            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition">
              <div className="relative overflow-hidden">
                {/* Link सिर्फ image को घेरता है */}
                <Link to="/category/bracelets" className="block">
                  <img
                    src={bracelet9}
                    alt="Sparkling diamond necklace on a woman's neck with elegant evening dress"
                    className="w-full h-52 object-cover cursor-pointer"
                  />
                </Link>

                {/* gradient overlay — क्लिक को इमेज तक जाने देना */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70 pointer-events-none"></div>

                <div className="absolute bottom-0 left-0 p-4 text-white pointer-events-auto">
                  <h3 className="font-sans text-xl font-semibold">Bracelets</h3>
                  <p className="text-accent">Bold and beautiful</p>
                </div>
              </div>

              <div className="p-4">
                <a
                  href="#bracelets"
                  className="text-primary hover:underline text-amber-700 hover:text-amber-800 hover:shadow-lg"
                >
                  View Collection →
                </a>
              </div>
            </div>
            {/* <!-- Collection 2 --> */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl hover:shadow-[#ed9d] transition">
              <div className="relative overflow-hidden">
                <Link to="/category/rings" className="block">
                  <img
                    src="https://cdn.pixabay.com/photo/2018/04/04/18/28/golden-3290604_1280.jpg"
                    alt="Golden engagement ring with diamond setting on a romantic wedding photo background"
                    className="w-full h-52 object-cover cursor-pointer"
                  />
                </Link>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 p-4 text-white">
                  <h3 className=" font-sans text-xl font-semibold">Rings</h3>
                  <p className="text-accent">Promise of forever</p>
                </div>
              </div>
              <div className="p-4">
                <a
                  href="#rings"
                  className="text-primary hover:underline text-amber-700 hover:text-amber-800 hover:shadow-lg hover:shadow-[#ed9d58] "
                >
                  View Collection →
                </a>
              </div>
            </div>
            {/* <!-- Collection 3 --> */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl hover:shadow-[#ed9d] transition">
              <div className="relative overflow-hidden">
                <Link to="/category/earrings" className="block">
                  <img
                    src="https://cdn.pixabay.com/photo/2019/02/11/19/53/jewel-3990596_1280.jpg"
                    alt="Delicate gold earrings with pearl drops on a pastel pink background"
                    className="w-full h-52 object-fill cursor-pointer"
                  />
                </Link>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 p-4 text-white">
                  <h3 className=" font-sans text-xl font-semibold">Earrings</h3>
                  <p className="text-accent">Subtle sophistication</p>
                </div>
              </div>
              <div className="p-4">
                <a
                  href="#earrings"
                  className="text-primary hover:underline text-amber-700 hover:text-amber-800 hover:shadow-lg hover:shadow-[#ed9d58] "
                >
                  View Collection →
                </a>
              </div>
            </div>
            {/* <!-- Collection 4 --> */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl hover:shadow-[#ed9d] transition">
              <div className="relative overflow-hidden">
                <Link to="/category/necklaces" className="block">
                  <img
                    src={necklaces1}
                    alt="Delicate gold earrings with pearl drops on a pastel pink background"
                    className="w-full h-52 object-cover cursor-pointer"
                  />
                </Link>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 p-4 text-white">
                  <h3 className=" font-sans text-xl font-semibold">
                    Necklaces
                  </h3>
                  <p className="text-accent">Grace That Speaks</p>
                </div>
              </div>
              <div className="p-4">
                <a
                  href="#necklaces"
                  className="text-primary hover:underline text-amber-700 hover:text-amber-800 hover:shadow-lg hover:shadow-[#ed9d58] "
                >
                  View Collection →
                </a>
              </div>
            </div>
            {/* <!-- Collection 5 --> */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl hover:shadow-[#ed9d] transition">
              <div className="relative overflow-hidden">
                <Link to="/category/couplesets" className="block">
                  <img
                    src="https://salty.co.in/cdn/shop/files/BC24358-G_MODEL.jpg?v=1754893646&width=1800"
                    alt="Delicate gold earrings with pearl drops on a pastel pink background"
                    className="w-full h-52 object-cover cursor-pointer"
                  />
                </Link>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 p-4 text-white">
                  <h3 className=" font-sans text-xl font-semibold">
                    Couple Sets
                  </h3>
                  <p className="text-accent">Crafted for Eternal Love</p>
                </div>
              </div>
              <div className="p-4">
                <a
                  href="#couple_sets"
                  className="text-primary hover:underline text-amber-700 hover:text-amber-800 hover:shadow-lg hover:shadow-[#ed9d58] "
                >
                  View Collection →
                </a>
              </div>
            </div>
            {/* <!-- Collection 6 --> */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl hover:shadow-[#ed9d] transition">
              <div className="relative overflow-hidden">
                <Link to="/category/anklets" className="block">
                  <img
                    src="https://images.pexels.com/photos/7068000/pexels-photo-7068000.jpeg"
                    alt="Delicate gold earrings with pearl drops on a pastel pink background"
                    className="w-full h-52 object-cover cursor-pointer"
                  />
                </Link>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 p-4 text-white">
                  <h3 className=" font-sans text-xl font-semibold">Anklet</h3>
                  <p className="text-accent">Elegance in Every Step</p>
                </div>
              </div>
              <div className="p-4">
                <a
                  href="#anklets"
                  className="text-primary hover:underline text-amber-700 hover:text-amber-800 hover:shadow-lg hover:shadow-[#ed9d58] "
                >
                  View Collection →
                </a>
              </div>
            </div>
            
          </div>
        </div>
      </section>
    </>
  );
};

export default OurCollections;
