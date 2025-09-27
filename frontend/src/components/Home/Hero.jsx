import React from "react";
import { Link } from "react-router-dom";
import HeroImg from "../Home/Hero.png";
import phone from "../Home/phone.png";

const Hero = () => {
  return (
    <section className="w-full">
      {/* Desktop Hero Image */}
      <img
        src={HeroImg}
        alt="Luxury jewelry collection"
        className="hidden md:block w-full h-auto object-cover"
      />

      {/* Mobile Hero Image */}
      <img
        src={phone}
        alt="Luxury jewelry collection mobile"
        className="block md:hidden w-full h-auto object-cover"
      />

      {/* Content */}
      <div
        className={`
          w-full px-4 sm:px-6 md:px-32
           md:absolute md:top-0 md:left-0 md:h-full md:flex md:flex-col md:justify-center md:items-start
          bg-amber-50 md:bg-transparent p-4 md:p-0
        `}
      >
        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-amber-600 leading-tight">
          Timeless Shine <br />
          <span className="text-amber-800 pl-36">Endless Love</span>
        </h1>
        <p className="text-base sm:text-lg poppins-semibold md:pl-28 md:text-xl mt-4 max-w-2xl text-amber-900">
          Celebrate life's most precious moments with jewelry that blends
          tradition and modern design, crafted to shine as brightly as your
          story.
        </p>
      </div>
    </section>
  );
};

export default Hero;
