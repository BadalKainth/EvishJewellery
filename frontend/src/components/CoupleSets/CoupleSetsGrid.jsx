import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet } from "../../api/client";
import { CartContext } from "../../context/CartContext";
import CartDesign from "../CartDesignCode/CartDesign";

const CoupleSetsGrid = () => {
  const navigate = useNavigate();

   const [CoupleSets, setCoupleSets] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState("");
      
        const { addItem } = useContext(CartContext);
      
        useEffect(() => {
          const fetchCoupleSets = async () => {
            try {
              const response = await apiGet("/products", {
                category: "couple-sets",
              });
              setCoupleSets(response.data?.products || []);
              const data = response.data?.products;
              console.log(data);
            } catch (err) {
              setError(err.message || "Failed to load CoupleSets");
            } finally {
              setLoading(false);
            }
          };
          fetchCoupleSets();
        }, []);
      
        if (loading) return <p className="text-center py-6">Loading Couple Sets...</p>;
        if (error)
          return <p className="text-center text-red-600 py-6">{error}</p>;
  

  return (
    <div
      id="couple_sets"
      className="scroll-mt-24 flex flex-col bg-[#ECEEDF] w-full poppins"
    >
      <div className="w-full">
        {/* Heading */}
        <div className="items-center text-center mb-6">
          <div className="bg-[#eceacb] py-4 rounded-md">
            <h2 className="text-4xl poppins-semibold text-[#e28e45] uppercase">
              Couple Sets
            </h2>
            <p className="text-lg poppins-medium text-amber-800">
              Perfectly paired elegance for you and your partner
            </p>
          </div>
        </div>
        {/* ✅ Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-5 md:px-20 gap-4 mt-6">
          {CoupleSets.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={() => addItem(product.id)} // ✅ send productId to backend
              onClick={() => navigate(`/category/couplesets/${product._id}`)}
            />
          ))}
        </div>
      </div>

      <div className="p-10 px-5 md:px-20 text-justify poppins-regular">
        <b> Couple Sets – Matching Jewelry Sets for Couples in Love </b>
        <br />
        Celebrate love with Couple Sets - Matching Jewelry for couples. Shop
        matching necklaces, matching bracelets and personalized jewelry gifts
        online. Great for weddings, anniversaries and more. <br /> <br />
        Love should be celebrated in every way, large and small! What better way
        to celebrate love than with Couple Sets - Matching Jewelry Sets for
        Couples in Love? Jewelry is more than a practical piece of clothing,
        jewelry holds emotion, memories and connection. Matching Couple Jewelry,
        the newest trend for couples in love! Matching couple jewelry is one of
        today's prettiest trends for couples in love that want to proudly wear
        their connection in a stylish and personal way. Whether you purchase
        matching necklaces, matching bracelets, or a complete set, couples can
        carry a little of each other wherever they go with their matching piece.{" "}
        <br /> <br />
        <b>Matching Couple Jewelry Sets</b> <br />
        Matching Couple Jewelry Sets are more than just accessories; they
        represent togetherness and connection. Usually sold in pairs, they
        feature designs that are the same or complementary to each other,
        representing two people's love for one another. There are lots of styles
        to choose from, including pendants, chains, charm bracelets, or rings.
        Matching Couple Jewelry Sets offer the unique opportunity for both
        partners to feel connected, even if they are miles apart. <br />
        Some popular motifs for jewelry sets include hearts, infinity shapes,
        crowns, or lock and key designs. Personalized couple jewelry sets can
        feature names, initials, or birthstones. These details create
        sentimental value and make the jewelry both aesthetically pleasing and
        meaningful. <br /> <br />
        <b>His and Her Necklace & Bracelet Sets</b> <br />
        His and Her Necklace & Bracelet Sets are perhaps among the most
        appealing options. These sets are multi-purpose, trendy and very easy to
        accessorize. As for men, the style ranges from bold sleek styles
        characterized by stainless steel, leather or tungsten, while women can
        choose chains or delicate looking bracelets with sparkling charms or
        gemstone features that add elegance and grace as well. <br /> <br />
        When worn together, both sets of necklaces and bracelets show the
        perfect combination of love and style. Puzzle pieces pendants that
        connect together, lock and key charms for trust, or engraved bracelets
        with heartfelt quotes create a long-lasting piece of jewelry that can
        serve as a reminder of your relationship. <br /> <br />
        <b>Romantic Couple Accessories Online</b> <br />
        It's now easier than ever to discover Romantic Couple Accessories
        Online, thanks to online shopping. Finding affordable bands for couples
        matching on a budget, even designer cool jewelry for couples, the
        options are endless. Online shops give you options designed and
        exclusive to them, as well as custom options with engravings, initials
        and other dates that have meaning. These accessories for couples are no
        longer ordinary, they'll become unique one-of-a-kind treasures. Also, it
        gives you the opportunity to purchase a meaningful gift for your partner
        to surprise them with directly or indirectly. Gifts for anniversaries,
        engagements, weddings or Valentine's Day can all be done easily online.{" "}
        <br /> <br />
        <b>Personalized Couple Jewelry Gifts</b> <br />
        When it comes to romance, there is nothing like the impact of
        Personalized Couple Jewelry Gifts. Adding initials, names, special
        coordinates, or even birthstones adds a layer of uniqueness and intimacy
        to each piece. Personalized jewelry holds memories and represents
        moments in time, making it more than just an accessory; it is a
        permanent reminder of love. <br /> <br />
        Imagine giving your partner a bracelet with your anniversary engraved on
        the inside or a necklace that features both of your birthstones. These
        details and touches make personalized gifts great for all
        milestones—weddings, birthdays, or even “just because.” <br /> <br />
        <b>Why Choose Matching Couple Jewelry?</b> <br />
        Jewelry sets for couples do more than help you look stylish—they are
        created to mark love, loyalty, and complimentary togetherness. Jewelry
        sets for couples will make couples feel more connected, make the perfect
        gift that they'll remember for a lifetime, and make any everyday look
        inspiring and chic. Whether it's a simple matching bracelet or an
        elaborate diamond necklace, couple jewelry sets speak the language of
        love that words just can't seem to convey. <br /> <br />
        <b>Celebrate love with Couple Sets –</b> Matching Jewelry Sets for
        Couples in Love. Explore many options from Matching Couple Jewelry Sets
        to His and Her Necklace & Bracelet Sets, and many more Romantic Couple
        Accessories Online when your partner needs a surprise. Let the memories
        of your relationship shine with personalized Couple Jewelry Gifts. More
        than just Jewelry, it's Something You'll Cherish Forever that represents
        your commitment, connectivity to another person, and love.
      </div>
    </div>
  );
};

// ==================== PRODUCT CARD ====================
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

export default CoupleSetsGrid;
