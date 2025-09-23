import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet } from "../../api/client";
import { CartContext } from "../../context/CartContext";
import CartDesign from "../CartDesignCode/CartDesign";


const AnkletGrid = () => {
  const navigate = useNavigate();

   const [anklets, setanklets] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState("");
      
        const { addItem } = useContext(CartContext);
      
        useEffect(() => {
          const fetchanklets = async () => {
            try {
              const response = await apiGet("/products", {
                category: "anklets",
              });
              setanklets(response.data?.products || []);
              const data = response.data?.products;
              console.log(data);
            } catch (err) {
              setError(err.message || "Failed to load Anklets");
            } finally {
              setLoading(false);
            }
          };
          fetchanklets();
        }, []);
      
        if (loading) return <p className="text-center py-6">Loading anklets...</p>;
        if (error)
          return <p className="text-center text-red-600 py-6">{error}</p>;

  return (
    <div className="scroll-mt-24 flex flex-col bg-[#ECEEDF] w-full pb-10 p-0 md:px-10">
      <div className="w-full">
        {/* Heading */}
        <div className="items-center text-center">
          <div className="bg-[#eceacb] py-4 rounded-md">
            <h2 className="text-4xl poppins-semibold text-[#e28e45] uppercase">
              Anklets
            </h2>
            <p className="text-lg poppins-medium text-amber-800">
              Elegant anklets to adorn your feet
            </p>
          </div>
        </div>

        {/* ✅ Grid Layout (PC पर 3, Tablet पर 2, Mobile पर 1) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 px-4">
          {anklets.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={() => addItem(product._id)} // ✅ send productId to backend
              onClick={() => navigate(`/category/anklets/${product._id}`)}
            />
          ))}
        </div>
        <div className="p-10 text-justify">
          <h1 className="font-bold">
            Anklets – Chic & Fashionable Anklets to Complement Your Look Anklets
            – Chic & Fashionable Gold & Silver Anklets Online
          </h1>
          Shop chic anklets on-line - gold & silver anklets, daily trendy wear,
          party style anklets, and designer anklets. Perfect for elevating your
          look, every anklet is a timeless accessory. <br /> <br />
          Jewelry has long been a great way to express personality and style.
          Since the dawn of time accessories have played an important role in
          self-expression, but anklets are unique among all of the accessories.
          Once strictly considered traditional adornments for women, anklets
          have made their way into the global fashion lexicon. Anklets are a
          confluence of culture and modern style. Whether you are wearing them
          to work, school, or for a holiday ceremony, anklets add elegance,
          charm and playfulness to your overall presence. Aklets are for women
          of all ages and styles, from dainty anklets to bold designer anklets!
          Our collection of chic and fashionable anklets ensures that you will
          find the right option for your personality and style, mood, outfit, or
          ceremony. <br /> <br />
          <b>Trendy Anklet Designs Online</b> <br />
          It has never been easier to shop for unique anklet styles online. With
          so many options available, you can finally find an unusual anklet
          design that expresses your personality and style. There are chain
          anklets, charm anklets, layered anklets, beaded anklets, and countless
          other options; they each have their own story. You can also find
          trendy anklets available in online stores, so you'll always be
          in-the-know about what's new and trending. <br /> <br />
          Trendy anklets are a versatile piece of jewelry! They are suitable for
          all styles of clothing. You can wear trendy anklets with jeans,
          skirts, dresses, and ethnic wear alike, creating an elegant look.
          Trendy anklets are a perfect accessory when you are ready for your
          next beach vacation, casual day out, or festive season. They complete
          the outfit effortlessly. <br /> <br />
          <b>Gold & Silver Anklets for Women</b> <br />
          When it comes to classic sophistication, gold & silver anklets for
          women are unmatched! Gold anklets stand for tradition and opulence,
          and typically worn during weddings, festivals and other cultural
          festivities. Gold anklets can bathed intricate designs and motifs such
          as flowers, bells, moons and geometric patterns, so they suit
          occasions that require grandeur. <br /> <br />
          In contrast, silver anklets are both casual and festive. They are
          light-weight and appropriate for any occasion. They too can serve both
          ethnic and western, both as discrete chains that feel elegant for the
          everyday and then also decorated with tiny trinkets or beads decals to
          feel fun! Whether you choose gold, or silver anklets, they are made
          for every woman to discover her wearable self-expression of elegance.{" "}
          <br /> <br />
          <b>Stylish Anklets for Daily Wear & Parties</b> <br />
          Anklets have become more than just a piece of jewelry reserved for
          special occasions or formal wear, they have emerged into a staple of
          modern everyday style. Our collection of fashionable anklets for
          everyday wear & parties includes lightweight, easy-to-wear designs
          that can take you from the office to casual lunch and out for coffee.
          Think thin chains, tiny charms, or minimalist single-strand anklets
          that are style-conscious and comfortable for all-day wear. <br />{" "}
          <br />
          For parties and celebrations, bolder designs like gemstone anklets,
          layered chains, or anklets with jangling charms are a way to make a
          statement. You can wear them with heels, sandals or even traditional
          footwear and never be held back with a statement anklet by your side.
          Show off your ankles while adding a bit of sparkle to your outfit
          either under the radar or making a bold statement depending on your
          personal style and occasion. <br /> <br />
          <b>Buy Designer Anklets Online</b> <br />
          Consider buying designer anklets online if you want to add something
          special and exclusive to your collection to factor some fashion into
          modern art. Designer anklets are not just pieces, they become voice
          pieces. They integrate old craft with new design. Designer anklets
          come in various styles, from casual bohemian with starfish or shells
          and beads for beach days to provision for the luxury lover with
          authentic diamond-studded anklets, designer collections offer fashion
          to everyone. <br /> <br />
          The advantage of online shopping is more than inventory; you may also
          design a custom anklet to suit your needs with options of initials,
          charms, and birthstones. Ideal results for a great birthday gift,
          anniversary, or even just a pleasant surprise for someone special.{" "}
          <br /> <br />
          <b>Why Anklets Are a Must-Have Accessory</b> <br />
          Anklets are not just simply jewelry, an anklet can demonstrate your
          femininity, individuality, and personal style. They bring a subtle eye
          to your ankles and feet while pulling together your look as a whole.
          An anklet will take your basics and make them chic, stylish, and
          fashionable. <br /> <br />
          When you purchase gold & silver anklets for women, look for
          fashionable anklet designs online, stylish anklets for everyday wear &
          parties, or plan to buy a designer anklet online, our selection is
          created with time, creativity, and love. <br /> <br />
          ✨ Find anklets that are more than just an accessory and are a
          reflection of your style, personality, and mood. <br />
        </div>
      </div>
    </div>
  );
};

const ProductCard = ({ product, addToCart, onClick }) => {
  

  return (
    <>
    <CartDesign
    product={product} 
      addToCart={addToCart} 
      onClick={onClick}
      />
    </>
  );
};

export default AnkletGrid;
