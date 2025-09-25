import React from "react";
import { Link } from "react-router-dom";
import SearchPage from "../Search/SearchPage";

const Hero = () => {
  return (
    <>
      {/* <!-- Jewelry Hero Section --> */}
      <section className="relative overflow-hidden h-[560px]">
        {/* <!-- Background overlay and content container --> */}
        <div className="absolute inset-96 bg-black/5 z-10"></div>

        {/* <!-- Hero image with elegant jewelry --> */}
        <div className="absolute inset-0">
          <img
            src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/b95210f9-638e-4f7b-8092-0b82bd86d93c.png"
            alt="Luxury jewelry collection displayed on velvet cushions with diamonds sparkling under soft lighting"
            className="w-full h-full object-cover"
          />
        </div>

        {/* <!-- Content --> */}
        <div className="relative z-20 px-4 md:px-8 lg:px-32 py-24 md:py-32 lg:py-24">
          <div className="max-w-7xl mx-auto">
            {/* <!-- Main heading --> */}
            <h1 className="font-playfair text-4xl md:text-6xl lg:text-7xl font-bold text-amber-50 pb-10 leading-tight poppins-semibold">
              Timeless Shine <br />
              <span className="text-[#f3c806] pl-10 md:pl-36">
                Endless Love
              </span>
            </h1>
            {/* <!-- Description --> // bg-[#888885] bg-opacity-80 */}
            <p className="text-white md:bg-transparent p-2 font-montserrat max-w-xl text-lg md:text-xl mb-8 opacity-100 poppins-regular">
              Celebrate lifes most precious moments with jewelry that blends
              tradition and modern design, crafted to shine as brightly as your
              story.
            </p>
            {/* <!-- CTA Buttons --> */}
            <div className="flex flex-wrap gap-4 pl-32">
              <Link
                to="/"
                className="px-5 py-2 md:px-8 md:py-3 text-lg md:text-2xl bg-yellow-600 hover:bg-yellow-700 text-white font-montserrat font-medium rounded-xl md:rounded-full transition-all duration-300 transform hover:scale-105 poppins-regular"
              >
                Explore Collection
              </Link>
            </div>
            {/* <SearchPage /> */}
          </div>
        </div>

        {/* <!-- Floating jewelry elements (decoration) --> */}
        <div className="absolute bottom-10 md:bottom-24 left-8 z-20 w-20 opacity-100 animate-float">
          <img
            src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/fb831114-cd0a-4e9e-ae16-eec361188134.png"
            alt="Diamond ring with platinum band sparkling on velvet"
            className="w-full rounded-lg"
          />
        </div>
        <div className="absolute top-10 md:top-56 right-3 md:right-16 z-20 w-20 md:w-44 opacity-90 animate-float-delay">
          <img
            src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/c81c2584-afef-4784-85c0-29efc96d8bce.png"
            alt="Pearl necklace displayed elegantly on jewelry stand"
            className="w-full rounded-lg"
          />
        </div>

        <div className="absolute top-24 right-80 z-20 w-72 opacity-0 xl:opacity-90 animate-float">
          <img
            src="https://images.pexels.com/photos/177332/pexels-photo-177332.jpeg"
            alt="Pearl necklace displayed elegantly on jewelry stand"
            className="w-full rounded-lg"
          />
        </div>
      </section>
    </>
  );
};

export default Hero;
