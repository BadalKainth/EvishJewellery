import React from "react";
import { Link } from "react-router-dom";
import HeroImg from "../Home/Hero.jpeg";
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
    </section>
  );
};

export default Hero;
