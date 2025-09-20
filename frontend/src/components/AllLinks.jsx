import React from "react";
import Bracelets from "./Bracelets/Bracelets";
import Hero from "./Home/Hero";
import OurCollections from "./Home/OurCollections";
import Rings from "./Rings/Rings";
import Earrings from "./Earrings/Earrings";
import Necklaces from "./Necklaces/Necklaces";
import CoupleSets from "./CoupleSets/CoupleSets";
import Anklets from "./Anklet/Anklets";

const AllLinks = ({ slider, cartItems, setCartItems, addToCart }) => {
  return (
    <>
      <Hero />
      <OurCollections />

      {/* <div className="w-full flex flex-col md:flex-row"> */}
        {/* Left Sidebar
        <div className="w-full md:w-2/5 p-4 ">
          <div className="sticky top-16 bg-white shadow-md p-4">
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit...</p>
          </div>
        </div>

        {/* Right Sidebar (Products + Cart) */}
        <div className="w-full p-4 flex flex-col gap-6"> 
          <Bracelets slider={slider} addToCart={addToCart} />
          <Rings slider={slider} addToCart={addToCart} />
          <Earrings slider={slider} addToCart={addToCart} />
          <Necklaces slider={slider} addToCart={addToCart} />
          <CoupleSets slider={slider} addToCart={addToCart} />
          <Anklets slider={slider} addToCart={addToCart} />
        </div>
      {/* </div> */}
    </>
  );
};

export default AllLinks;
