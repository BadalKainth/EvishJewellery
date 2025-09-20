import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Ringsdata from "./Ringsdata";
import { CartContext } from "../../context/CartContext";
import { apiGet } from "../../api/client";

const RingsGrid = ({ addToCart }) => {
  const navigate = useNavigate();

  const [rings, setrings] = useState([]);
  const [loading, setLoading] = useState([]);
  const [error, setError] = useState("");

  const {addItem} = useContext(CartContext);

  useEffect(() => {
    const fetchrings = async () => {
      try {
        const response = await apiGet("/products", {category: "rings"});
        setrings(response.data?.products || []);
        const data = response.data?.products;
        console.log(data);
      } catch (err) {
        setError(err.message || "Failed to load Rings"); 
      } finally {
        setLoading(false);
      }
    };
    fetchrings ();
  }, []);

   if (loading) return <p className="text-center py-6">Loading rings...</p>;
   if (error) return <p className="text-center text-red-600 py-6">{error}</p>;

  return (
    <div id="rings" className="scroll-mt-24 flex flex-col bg-[#ECEEDF] w-full">
      <div className="w-full">
        {/* Heading */}
        <div className="items-center text-center">
          <div className="bg-[#eceacb] py-4 rounded-md">
            <h2 className="text-4xl poppins-semibold text-[#e28e45] uppercase">
              Rings
            </h2>
            <p className="text-lg poppins-medium text-amber-800">
              Elegance that sparkles on your fingers
            </p>
          </div>
        </div>

        {/* ✅ Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-5 md:px-20 gap-4 mt-6">
          {rings.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={() => addItem(product._id)}  //  send product backend
              onClick={() => navigate(`/category/rings/${product._id}`)}
            />
          ))}
        </div>
      </div>
      <div className="p-20 text-justify poppins-regular">
        <h1 className="font-bold">
          Rings – Timeless & Trendy Rings for Men & Women
        </h1>
        Shop timeless and trendy rings for men, women, and kids. Explore gold,
        silver, diamond, and designer rings in 18KT & 22KT crafted for weddings,
        daily wear, and special occasions.
        <br />
        <br />
        Shop timeless and trendy rings for men and women. Discover gold, silver,
        diamond, and designer ring collections crafted to suit every style and
        special occasion. Rings are more than just ornaments—they are timeless
        symbols of love, commitment, style, and individuality. From elegant
        engagement rings to everyday wear bands, each ring tells a unique story
        and adds a touch of sophistication to your personality. Whether crafted
        in gold, silver, diamonds, or gemstones, rings have the power to
        transform an outfit and create lasting impressions. At Jewellers, we
        bring you a diverse collection of rings for men, women, and even kids,
        designed to suit every style and occasion. Our range includes
        traditional gold bands, modern diamond-studded pieces, and trendy
        fashion rings, all crafted with precision and passion. Available in 18KT
        and 22KT gold, our rings offer both beauty and durability, making them
        ideal for everything from daily wear to weddings and grand celebrations.
        From classic solitaires to bold cocktail rings, from simple bands to
        intricate gemstone designs, we have something for everyone. Each piece
        reflects excellent craftsmanship, premium quality, and timeless
        elegance. Whether you’re searching for the perfect engagement ring, a
        thoughtful gift, or a stylish accessory for yourself, our collection
        ensures you’ll find a ring that truly matches your personality and
        special moments. Rings – Timeless & Trendy Rings for Men & Women <br />
        <br />
        Rings have always been more than just jewelry—they’re symbols of love,
        style, and personality. From classic gold bands to modern designer
        pieces, rings hold a special place in every collection. Whether you’re
        choosing an elegant engagement ring, a stylish everyday accessory, or a
        meaningful gift, the right ring adds charm and confidence to your look.
        Our collection brings you a wide variety of rings for men and women,
        blending timeless elegance with the latest trends. Crafted in gold,
        silver, diamonds, and contemporary designs, each piece is made to suit
        every occasion—be it casual, formal, or celebratory. With so many styles
        to choose from, you’re sure to find the perfect ring that reflects your
        taste and tells your story. Explore the Timeless Elegance of Rings at
        Jewellers
        <br />
        <br />
        At Jewellers, we present a stunning collection of rings that cater to
        every style, occasion, and personality. From engagement rings and
        wedding bands to fashion rings and statement pieces, each design is
        crafted with precision and passion, ensuring unmatched quality and
        sophistication. Whether you're looking for classic gold rings,
        diamond-studded rings, or gemstone rings in 22KT and 18KT gold, we have
        the perfect piece to add elegance to your collection. Bhima's rings come
        in a variety of styles, from simple and subtle to bold and intricate,
        allowing you to express your individuality in the most stylish way. Our
        rings are designed to elevate your look for any occasion, be it daily
        wear, weddings, engagements, or casual outings. With options for men,
        women, and kids, Bhima’s rings are the perfect way to celebrate life’s
        special moments.
        <br />
        <br />
        <div className="text-sm">
          <b className="bg-gray-100 m-2 cursor-pointer">Jewellery</b>
          <b className="bg-gray-100 m-2 cursor-pointer">Gold Jewellery</b>
          <b className="bg-gray-100 m-2 cursor-pointer">Silver Jewellery</b>
          <b className="bg-gray-100 m-2 cursor-pointer">Diamond Jewellery</b>
          <b className="bg-gray-100 m-2 cursor-pointer">Women Jewellery</b>
          <b className="bg-gray-100 m-2 cursor-pointer">Men Jewellery</b>
          <b className="bg-gray-100 m-2 cursor-pointer">Jewellery under 10K</b>
          <b className="bg-gray-100 m-2 cursor-pointer">Jewellery under 50K</b>
          <b className="bg-gray-100 m-2 cursor-pointer">Jewellery under 2L</b>
          <b className="bg-gray-100 m-2 cursor-pointer">Jewellery above 2L</b>
          <b className="bg-gray-100 m-2 cursor-pointer">Gold Chain</b>
          <b className="bg-gray-100 m-2 cursor-pointer">Gold Chain for Women</b>
          <b className="bg-gray-100 m-2 cursor-pointer">Gold Chain for Men</b>
          <b className="bg-gray-100 m-2 cursor-pointer">22 Karat Gold Chain</b>
          <b className="bg-gray-100 m-2 cursor-pointer">18 Karat Gold Chain</b>
          <b className="bg-gray-100 m-2 cursor-pointer">Gold Chain for Kids</b>
          <b className="bg-gray-100 m-2 cursor-pointer">Gold Chain under 50K</b>
          <b className="bg-gray-100 m-2 cursor-pointer">Gold Earrings</b>
          <b className="bg-gray-100 m-2 cursor-pointer">
            Gold Earrings for Women
          </b>
          <b className="bg-gray-100 m-2 cursor-pointer">
            Gold Earrings for Kids
          </b>
          <b className="bg-gray-100 m-2 cursor-pointer">Gold Stud Earrings</b>
          <b className="bg-gray-100 m-2 cursor-pointer">Jhumka Earrings Gold</b>
          <b className="bg-gray-100 m-2 cursor-pointer">
            Daily Wear Gold Earrings
          </b>
          <b className="bg-gray-100 m-2 cursor-pointer">
            Chandbali Earrings Gold
          </b>
          <b className="bg-gray-100 m-2 cursor-pointer">Plain Gold Earrings</b>
          <b className="bg-gray-100 m-2 cursor-pointer">Gold Pearl Earrings</b>
          <b className="bg-gray-100 m-2 cursor-pointer">
            22 Karat Gold Earrings
          </b>
          <b className="bg-gray-100 m-2 cursor-pointer">Ruby Earrings Gold</b>
          <b className="bg-gray-100 m-2 cursor-pointer">Rose Gold Earrings</b>
          <b className="bg-gray-100 m-2 cursor-pointer">
            Gold Earrings under 10K
          </b>
          <b className="bg-gray-100 m-2 cursor-pointer">
            Gold Earrings under 50K
          </b>
          <b className="bg-gray-100 m-2 cursor-pointer">
            Gold Earrings under 2L
          </b>
          <b className="bg-gray-100 m-2 cursor-pointer">Gold Bangles</b>
          <b className="bg-gray-100 m-2 cursor-pointer">Baby Bangles Gold</b>
          <b className="bg-gray-100 m-2 cursor-pointer">
            Gold Bangles for Women
          </b>
          <b className="bg-gray-100 m-2 cursor-pointer">22KT Gold Bangles</b>
          <b className="bg-gray-100 m-2 cursor-pointer">Kada Gold Bangles</b>
          <b className="bg-gray-100 m-2 cursor-pointer">
            Gold Bangles under 50K
          </b>
          <b className="bg-gray-100 m-2 cursor-pointer">Necklaces</b>
          <b className="bg-gray-100 m-2 cursor-pointer">Gold Necklaces</b>
          <b className="bg-gray-100 m-2 cursor-pointer">Silver Necklaces</b>
          <b className="bg-gray-100 m-2 cursor-pointer">Diamond Necklaces</b>
          <b className="bg-gray-100 m-2 cursor-pointer">Necklaces for Women</b>
          <b className="bg-gray-100 m-2 cursor-pointer">Party Wear Necklaces</b>
          <b className="bg-gray-100 m-2 cursor-pointer">Necklaces above 50K</b>
          <b className="bg-gray-100 m-2 cursor-pointer">Rings</b>
          <b className="bg-gray-100 m-2 cursor-pointer">Diamond Rings</b>
          <b className="bg-gray-100 m-2 cursor-pointer">Silver Rings</b>
          <b className="bg-gray-100 m-2 cursor-pointer">Gold Rings for Men</b>
          <b className="bg-gray-100 m-2 cursor-pointer">Gold Rings for Women</b>
          <b className="bg-gray-100 m-2 cursor-pointer">Gold Rings for Kids</b>
          <b className="bg-gray-100 m-2 cursor-pointer">
            22 Karat Gold Rings for Men & Women
          </b>
          <b className="bg-gray-100 m-2 cursor-pointer">Plain Gold Rings</b>
          <b className="bg-gray-100 m-2 cursor-pointer">Rose Gold Rings</b>
          <b className="bg-gray-100 m-2 cursor-pointer">
            Daily Wear Gold Ring Designs
          </b>
          <b className="bg-gray-100 m-2 cursor-pointer">Gold Rings under 10K</b>
          <b className="bg-gray-100 m-2 cursor-pointer">Gold Rings under 50K</b>
          <b className="bg-gray-100 m-2 cursor-pointer">Gold Rings under 2L</b>
          <b className="bg-gray-100 m-2 cursor-pointer">
            Less Than 4 Gram Gold Rings
          </b>
          <b className="bg-gray-100 m-2 cursor-pointer">
            Less Than 8 Gram Gold Rings
          </b>
          <b className="bg-gray-100 m-2 cursor-pointer">Gold Pendant</b>
          <b className="bg-gray-100 m-2 cursor-pointer">
            Gold Pendant for Women
          </b>
          <b className="bg-gray-100 m-2 cursor-pointer">Gold Pendant for Men</b>
          <b className="bg-gray-100 m-2 cursor-pointer">Rose Gold Pendant</b>
          <b className="bg-gray-100 m-2 cursor-pointer">
            Gold Pendant for Kids
          </b>
          <b className="bg-gray-100 m-2 cursor-pointer">
            Gold Pendant above 10K
          </b>
          <b className="bg-gray-100 m-2 cursor-pointer">Collections</b>
          <b className="bg-gray-100 m-2 cursor-pointer">Antique Jewellery</b>
          <b className="bg-gray-100 m-2 cursor-pointer">
            Modern Mangalsutra Design
          </b>
          <b className="bg-gray-100 m-2 cursor-pointer">
            18 Karat Gold Jewellery
          </b>
          <b className="bg-gray-100 m-2 cursor-pointer">
            Diamond Jewellery Collection
          </b>
          <b className="bg-gray-100 m-2 cursor-pointer">
            Silver Jewellery Collection
          </b>
          <b className="bg-gray-100 m-2 cursor-pointer">Gold God Pendant</b>
          <b className="bg-gray-100 m-2 cursor-pointer">Wedding Collection</b>
          <b className="bg-gray-100 m-2 cursor-pointer">Coins</b>
          <b className="bg-gray-100 m-2 cursor-pointer">Silver Coins</b>
          <b className="bg-gray-100 m-2 cursor-pointer">22 Karat Gold Coin</b>
          <b className="bg-gray-100 m-2 cursor-pointer">1 Gram Gold Coin</b>
          <b className="bg-gray-100 m-2 cursor-pointer">2 Gram Gold Coin</b>
          <b className="bg-gray-100 m-2 cursor-pointer">4 Gram Gold Coin</b>
          <b className="bg-gray-100 m-2 cursor-pointer">8 Gram Gold Coin</b>
          <b className="bg-gray-100 m-2 cursor-pointer">25 Gram Silver Coin</b>
          <b className="bg-gray-100 m-2 cursor-pointer">Lakshmi Gold Coin</b>
          <b className="bg-gray-100 m-2 cursor-pointer">Bars</b>
          <b className="bg-gray-100 m-2 cursor-pointer">Silver Bars</b>
          <b className="bg-gray-100 m-2 cursor-pointer">24 Karat Gold Bars</b>
          <b className="bg-gray-100 m-2 cursor-pointer">1 Gram Gold Bar</b>
          <b className="bg-gray-100 m-2 cursor-pointer">5 Gram Gold Bar</b>
          <b className="bg-gray-100 m-2 cursor-pointer">10 Gram Gold Bar</b>
          <b className="bg-gray-100 m-2 cursor-pointer">25 Gram Silver Bar</b>
          <b className="bg-gray-100 m-2 cursor-pointer">50 Gram Gold Bar</b>
          <b className="bg-gray-100 m-2 cursor-pointer">50 Gram Silver Bar</b>
          <b className="bg-gray-100 m-2 cursor-pointer">75 Gram Silver Bar</b>
          <b className="bg-gray-100 m-2 cursor-pointer">100 Gram Gold Bar</b>
          <b className="bg-gray-100 m-2 cursor-pointer">100 Gram Silver Bar</b>
          <b className="bg-gray-100 m-2 cursor-pointer">1000 Gram Gold Bar</b>
        </div>
      </div>
    </div>
  );
};

// ==================== PRODUCT CARD ====================
const ProductCard = ({ product, addToCart, onClick }) => {
  const [showPopup, setShowPopup] = useState(false);

  const discount = product.originalPrice - product.price;
  const discountPercent = Math.round((discount / product.originalPrice) * 100);

  const  handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 1500);
  };

 

  return (
    <div className="px-2 relative poppins">
      {/* ✅ Cart Popup */}
      {showPopup && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md z-50">
          Added to Cart!
        </div>
      )}

      {/* ✅ Product Card */}
      <div
        onClick={onClick}
        className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
      >
        {/* ✅ सिर्फ पहली Image */}
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="w-full h-64 object-cover"
        />

        {/* ✅ Badge */}
        {product.tags && (
          <span
            className={`absolute top-3 right-3 text-white text-xs font-semibold px-2 py-1 rounded-lg shadow ${
              product.tags === "SALE" ? "bg-red-500" : "bg-amber-500"
            }`}
          >
            {product.tags}
          </span>
        )}

        {/* ✅ Product Details */}
        <div className="py-4 px-2">
          <h3 className="flex justify-between">
            <span className="font-semibold uppercase text-lg">
              {product.name}
            </span>
            <span className="text-green-600 font-medium text-lg">
              Size No: {product.size}
            </span>
          </h3>

          <p className="text-sm text-gray-800 mt-1 line-clamp-2">
            {product.description}
          </p>

          <p className="text-gray-500 text-sm mt-1">
            Delivery: ₹ {product.deliveryCharge || 99}
          </p>

          {/* ✅ Price + Discount */}
          <div className="flex justify-between items-center mt-4">
            <div className="flex flex-col text-amber-600 text-xl font-bold">
              {product.price ? (
                <>
                  <span>
                    Price:{" "}
                    <span className="line-through decoration-2 decoration-amber-700 text-2xl">
                      ₹{product.originalPrice}
                    </span>
                  </span>
                  <span className="font-bold text-green-600 text-lg">
                    Discounted price : ₹{product.price}
                  </span>
                  <span className="text-sm text-gray-600">
                    🎉 You saved ₹{discount} ({discountPercent}% OFF)
                  </span>
                </>
              ) : (
                <span>₹{product.price}</span>
              )}
            </div>

            {/* ✅ Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RingsGrid;
