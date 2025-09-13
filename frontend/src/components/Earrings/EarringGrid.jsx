import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Earringsdata from "./Earringsdata";

const EarringsGrid = ({ addToCart }) => {
  const navigate = useNavigate();

  return (
    <div
      id="earrings"
      className="scroll-mt-24 flex flex-col bg-[#ECEEDF] w-full pb-10"
    >
      <div className="w-full">
        {/* Heading */}
        <div className="items-center text-center">
          <div className="bg-[#eceacb] py-4 rounded-md">
            <h2 className="text-4xl poppins-semibold text-[#e28e45] uppercase">
              Earrings
            </h2>
            <p className="text-lg poppins-medium text-amber-800">
              Elegance that completes your style
            </p>
          </div>
        </div>

        {/* ✅ Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-5 md:px-20 gap-4 mt-6">
          {Earringsdata.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={addToCart}
              onClick={() => navigate(`/earrings/${product.id}`)}
            />
          ))}
        </div>
      </div>
      <div className="p-10 px-5 md:px-20 text-justify">
        <h1 className="font-bold">
          {" "}
          Earrings – Beautiful Earrings Collection to Elevate Your Style
        </h1>
        "Discover beautiful silver earrings online. Shop to your heart's content
        from pearls, classic stud earrings, or contemporary Sui Dhaga earrings
        or minimalistic studs and quirky designs. All available in 925 sterling
        (also known as .925)/ sterling silver with free delivery and returns.{" "}
        <br />
        Earrings have always been more than just jewelry, they occupy a place in
        fashion that is timeless. Since the early Egyptian and Greek eras,
        earrings (or eardrops) have been cherished and have been eternal staples
        of culture and fashion. They continue to function as accessories to
        build, charm, elegance, and personality into every look. Acting as a
        transformative piece, earrings can elevate an otherwise simple outfit
        into something truly astonishing, legitimately owning the term a
        'statement piece'. Among the endless style choices of earrings, silver
        earrings have been a comfortable go-to choice; they maintain
        versatility, shine beautifully, and flawlessly complement the most
        number of skin tones and outfits. <br />
        Explore Our Collection of Silver Earrings At we have a large selection
        of silver earrings for all face shapes and style profiles. Both dainty
        everyday earrings to big beautiful statement earrings for special
        occasions, you will find a pair of silver earrings to suit everyone's
        needs. <br />
        Studded Silver Earrings: With their beautiful shine and elegant look,
        studded silver earrings are the truly versatile earring. Whether for
        business or play, studded silver earrings are a great addition to any
        outfit and can easily be a wardrobe staple. <br />
        Pearl Earrings: Pearls are a timeless classic that has been in fashion
        for centuries. Zavya's selection of pearl earrings modernizes this
        beautiful classic look, perfect for those wishing to add a little royal
        elegance to any look on either a casual or formal day. <br />
        Sui Dhaga Gold Earrings: If you are attracted to light-weight trendy
        jewelry, Sui Dhaga earrings in gold, rose gold and silver will be a
        perfect choice. Sui Dhaga earrings are light-weight, stylish, gentle on
        the skin, and are suited for everyday wear. <br />
        New Pearl Earrings selection: In with the new! Our collection of pearl
        earrings is modern and trendy. Classic white pearls are interpreted in
        modern forms that can be used with western or formal clothing. <br />
        We strive to offer a complete range of trendy, high-quality earrings
        made with silver that are beautiful and made with a solution for quality
        earring crafting. Our handcrafted silver earrings represent good
        investment in style and elegance. <br />
        <br />
        <b>Why Choose Silver Earrings from?</b> <br />
        We have a supreme selection on sterling silver earrings, to fit your
        style. We have earrings to match any occasion to help you feel great,
        Look great, always. Made of 925 Sterling Silver with a genuine hallmark.
        Hypoallergenic and safe for sensitive skin. New collections released
        every week. Includes a jewelry kit and certificate of authentication
        Free delivery and a 30-day return Great customer care Visit discover
        your perfect pair of silver earrings for every occasion. <br />
        <br />
        <b>FAQs</b>
        <b>
          1. How should I care for silver earrings to keep them looking shiny?
        </b>
        Response: With proper storage in an airtight box, avoidance of direct
        contact with perfume and water, and a gentle clean with a soft jewelry
        cloth, your silver earrings can stay shining. Our anti-tarnish rhodium
        plating means they will stay looking shiny for much longer.
        <br />
        <b>2. Can pearl earrings be worn everyday?</b>
        Response: Pearl earrings are certainly a wonderful option for everyday
        wear, but be careful if they get in contact with strong chemicals or if
        they are handled too roughly. You cannot wrong with a simple pearl
        earring which can be dressed up or down and suits every occasion.
        <br />
        <b>3. Will Sui Dhaga gold earrings irritate my skin?</b>
        Response: Our Sui Dhaga gold earrings will not irritate your skin, as
        they are not only made with skin-friendly materials, but are also
        extremely lightweight making them great for even very sensitive ears.
        The design means you do not need to compromise comfort for style.
        <br />
        <b>4. Can I buy these earrings with packaging?</b>
        Response: Of course, we package all our earrings in premium packaging
        with a jewelry care kit, and you can also choose gift wrapping during
        checkout. They will make the perfect gift for your loved ones.
        <br />
        <b>5. Do the earrings come with a warranty or certificate?</b>
        Answer: Yes. All our earrings come with an authentication certificate of
        purity and quality. All gold and silver product are hallmarked and all
        pieces are quality checked before they are dispatched.
      </div>
    </div>
  );
};

// ==================== PRODUCT CARD ====================
const ProductCard = ({ product, addToCart, onClick }) => {
  const [showPopup, setShowPopup] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 1500);
  };

  // Discount calculation
  const discount = product.discountPrice
    ? product.price - product.discountPrice
    : 0;
  const discountPercent = product.discountPrice
    ? Math.round((discount / product.price) * 100)
    : 0;

  return (
    <div className="px-2 relative poppins">
      {/* Popup */}
      {showPopup && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-md shadow-lg text-sm z-10">
          ✅ Added to Cart
        </div>
      )}

      <div className="product-card bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <div className="relative overflow-hidden">
          <img
            onClick={onClick}
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="w-full h-64 object-cover transform hover:scale-110 transition duration-500 cursor-pointer"
          />
          {product.badge && (
            <span
              className={`absolute top-3 right-3 text-white text-xs font-semibold px-2 py-1 rounded-lg shadow ${
                product.badge === "SALE" ? "bg-red-500" : "bg-amber-500"
              }`}
            >
              {product.badge}
            </span>
          )}
        </div>

        <div className="py-4 px-2">
          <h3 className="flex items-center justify-between">
            <span className="font-semibold text-gray-900 poppins-semibold uppercase text-lg">
              {product.name}
            </span>
            {product.size && (
              <span className="text-green-600 font-medium text-lg">
                Size No: {product.size}
              </span>
            )}
          </h3>
          <p className="text-sm text-gray-800 poppins-medium mt-1 line-clamp-2">
            {product.description}
          </p>

          <p className="text-gray-500 text-sm mt-1">
            Delivery: ₹
            {product.deliveryCharge !== null ? product.deliveryCharge : 0}
          </p>

          {/* Price Section */}
          <div className="flex justify-between items-center mt-4">
            <div className="flex flex-col font-bold text-amber-600 text-lg">
              {product.discountPrice ? (
                <>
                  <span>
                    Price:{" "}
                    <span className="line-through decoration-2 decoration-black">
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>
                  </span>
                  <span className="font-bold text-green-600 text-lg">
                    Discount Price: ₹
                    {product.discountPrice.toLocaleString("en-IN")}
                  </span>
                  <span className="text-sm text-gray-600 line-clamp-1 animate-pulse">
                    🎉 You saved ₹{discount} ({discountPercent}% OFF)
                  </span>
                </>
              ) : (
                <span>₹{product.price.toLocaleString("en-IN")}</span>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md transition"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarringsGrid;
