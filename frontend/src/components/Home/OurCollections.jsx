import React from "react";

import bracelet9 from "../Bracelets/img/bracelet9.jpg";
import necklaces1 from "../Necklaces/img/necklaces1.jpg";
import { Link } from "react-router-dom";
import coupleset from "../Home/coupleset.png"
import anklet from "../Home/anklet.png";
import tinytreasure from "../../img/tiny tressure.jpeg";
import hydroluxe from "../../img/hydro luxe.jpeg";

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
                    src={tinytreasure}
                    alt="Tiny Treasures"
                    className="w-full h-52 object-cover cursor-pointer"
                  />
                </Link>

                {/* gradient overlay — क्लिक को इमेज तक जाने देना */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70 pointer-events-none"></div>

                <div className="absolute bottom-0 left-0 p-4 text-white pointer-events-auto">
                  <h3 className="text-xl poppins-semibold">Tiny Treasures</h3>
                  <p className="text-accent poppins-medium">Kids &amp; Toys Collection</p>
                </div>
              </div>

              <div className="p-4">
                <a
                  href="category/bracelets"
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
                    src={hydroluxe}
                    alt="Hydro Luxe"
                    className="w-full h-52 object-cover cursor-pointer"
                  />
                </Link>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 p-4 text-white">
                  <h3 className="text-xl poppins-semibold">Hydro Luxe</h3>
                  <p className="text-accent poppins-medium">Water Bottles &amp; Drinkware</p>
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
                    src="https://images.unsplash.com/photo-1716461534906-d31a17008801?q=80&w=655&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Delicate gold earrings with pearl drops on a pastel pink background"
                    className="w-full h-52 object-fill cursor-pointer"
                  />
                </Link>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 p-4 text-white">
                  <h3 className="text-xl poppins-semibold">Smart Living</h3>
                  <p className="text-accent poppins-medium">Home &amp; Kitchen Essentials</p>
                </div>
              </div>
              <div className="p-4">
                <a
                  href="category/earrings"
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
                    src="https://images.unsplash.com/photo-1641290748359-1d944fc8359a?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Delicate gold earrings with pearl drops on a pastel pink background"
                    className="w-full h-52 object-cover cursor-pointer"
                  />
                </Link>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 p-4 text-white">
                  <h3 className="text-xl poppins-semibold">
                    Aura Decor
                  </h3>
                  <p className="text-accent poppins-medium">Home Decor Collection</p>
                </div>
              </div>
              <div className="p-4">
                <a
                  href="category/necklaces"
                  className="text-primary hover:underline text-amber-700 hover:text-amber-800 hover:shadow-lg hover:shadow-[#ed9d58] "
                >
                  View Collection →
                </a>
              </div>
            </div>
            {/* <!-- Collection 5 --> */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl hover:shadow-[#ed9d] transition">
              <div className="relative overflow-hidden">
                <Link to="/category/couple-sets" className="block">
                  <img
                    src={coupleset}
                    alt="Delicate gold earrings with pearl drops on a pastel pink background"
                    className="w-full h-52 object-cover cursor-pointer"
                  />
                </Link>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 p-4 text-white">
                  <h3 className="text-xl poppins-semibold">
                    New Launches
                  </h3>
                  <p className="text-accent poppins-medium">Fresh arrivals just in</p>
                </div>
              </div>
              <div className="p-4">
                <a
                  href="category/couple-sets"
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
                    src={anklet}
                    alt="Delicate gold earrings with pearl drops on a pastel pink background"
                    className="w-full h-52 object-cover cursor-pointer"
                  />
                </Link>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 p-4 text-white">
                  <h3 className="text-xl poppins-semibold">SheVerse</h3>
                  <p className="text-accent poppins-medium">All women-related products.</p>
                </div>
              </div>
              <div className="p-4">
                <a
                  href="category/anklets"
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
