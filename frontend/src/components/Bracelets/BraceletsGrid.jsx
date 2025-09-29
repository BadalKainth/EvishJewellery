import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet } from "../../api/client";
import { CartContext } from "../../context/CartContext";
import CartDesign from "../CartDesignCode/CartDesign";

const BraceletsGrid = () => {
  const navigate = useNavigate();
  const { addItem } = useContext(CartContext);

  const [bracelets, setBracelets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12; // Number of products per page

  const gridRef = useRef(null);

  const fetchBracelets = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const response = await apiGet("/products", {
        category: "bracelets",
        page: pageNumber,
        limit,
      });
      setBracelets(response.data?.products || []);
      setTotalPages(response.data?.pagination?.totalPages || 1);
    } catch (err) {
      setError(err.message || "Failed to load Bracelets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBracelets(page);
    if (gridRef.current) {
      gridRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [page]);

  if (loading) return <p className="text-center py-6">Loading bracelet...</p>;
  if (error) return <p className="text-center text-red-600 py-6">{error}</p>;

  const handlePrev = () => page > 1 && setPage(page - 1);
  const handleNext = () => page < totalPages && setPage(page + 1);

  return (
    <div
      className="scroll-mt-24 flex flex-col bg-[#ECEEDF] w-full pb-10 md:px-10"
      ref={gridRef}
    >
      <div className="w-full">
        {/* Title Section */}
        <div className="items-center text-center">
          <div className="bg-[#eceacb] py-4 rounded-md">
            <h2 className="text-4xl poppins-semibold text-[#e28e45] uppercase">
              Bracelets
            </h2>
            <p className="text-lg poppins-medium text-amber-800">
              Elegance that shines on your wrist
            </p>
          </div>
        </div>

        {/* ✅ Grid Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 px-1 md:px-20 gap-2 md:gap-4 mt-6">
          {bracelets.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              addToCart={() => addItem(product._id)}
              onClick={() => navigate(`/category/bracelets/${product._id}`)}
            />
          ))}
        </div>

        {/* Pagination Buttons */}
        <div className="flex justify-center mt-8 space-x-2">
          <button
            onClick={handlePrev}
            disabled={page === 1}
            className={`px-3 py-1 rounded ${
              page === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-amber-500 hover:bg-amber-600 text-white"
            }`}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx + 1}
              onClick={() => setPage(idx + 1)}
              className={`px-3 py-1 rounded ${
                page === idx + 1
                  ? "bg-amber-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {idx + 1}
            </button>
          ))}

          <button
            onClick={handleNext}
            disabled={page === totalPages}
            className={`px-3 py-1 rounded ${
              page === totalPages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-amber-500 hover:bg-amber-600 text-white"
            }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* Existing Paragraphs & FAQ Section remain unchanged */}
      <div className="p-10 text-justify poppins-regular text-xs md:text-base">
        <h1 className="font-bold">
          Bracelets – Elegant & Stylish Bracelet Designs for Every Occasion
        </h1>
        Shop elegant and stylish bracelet designs for every occasion. Discover
        gold, silver, and designer bracelets crafted to add charm, style, and
        sophistication to your look. <br />
        <br />
        A bracelet is more than just a fashion accessory—it’s a reflection of
        personality, emotions, and style. Whether it symbolizes love,
        friendship, or individuality, a bracelet tells a story about the one who
        wears it. From subtle elegance to bold statements, bracelets have the
        power to transform an outfit and add that extra touch of charm. <br />
        <br />
        At <b>Jewellers</b>, we bring you a stunning collection of bracelets
        designed to suit every mood and occasion. Crafted with precision and
        creativity, our range includes everything from classic gold and silver
        pieces to contemporary designer bracelets. If you love minimal elegance,
        our delicate chains and bangles are perfect for daily wear. For those
        who want to make a statement, bold gemstone or diamond-studded bracelets
        add sparkle and sophistication. <br />
        <br />
        Available in traditional and modern designs, our bracelets are versatile
        enough to complement casual outfits, party looks, or even wedding
        attire. Each piece blends durability, comfort, and unmatched
        craftsmanship, ensuring that your bracelet doesn’t just look beautiful
        but also feels perfect on your wrist. <br />
        <br />
        Whether you’re shopping for yourself or searching for a meaningful gift,
        our bracelets are crafted to celebrate life’s special moments with
        elegance and style. <br />
        <br />
        <h1>Elegant & Stylish Bracelet Designs for Every Occasion</h1>
        <h1>What Makes a Bracelet Special?</h1>A bracelet is not just a piece of
        jewelry; it tells a story about the person who wears it.
        <b>Bracelets can symbolize love, friendship, or personal style.</b>
        Many people choose bracelets because they are versatile and can
        complement any outfit. Whether made of gold, silver, or colorful beads,
        bracelets add a charming touch to your overall look. So, the next time
        you pick a bracelet, think about the meaning it holds for you.
        <h1>Different Styles of Bracelets</h1>
        There are many styles of bracelets available, and each style has its
        unique charm. For example, charm bracelets allow you to collect charms
        that represent special moments or interests. On the other hand, bangles
        are solid and often worn in groups to create an eye-catching effect.
        Leather bracelets give a rugged look, while pearl bracelets are perfect
        for elegant occasions. So, whether you prefer casual wear or something
        more formal, there’s a bracelet out there just for you!
        <h6>How to Choose the Right Bracelet</h6>
        When choosing a bracelet, consider your personal style and the occasions
        you will wear it for. Think about the materials that you’re comfortable
        with and the colors that suit your wardrobe. For daily wear, you might
        want something lightweight and durable, while for special events, you
        might choose a more glamorous piece. It’s essential to find a bracelet
        that not only looks good but also feels good on your wrist. Because a
        perfect bracelet can boost your confidence and make you feel fabulous!{" "}
        <br />
        Discover our exclusive collection of{" "}
        <b>bracelets that blend elegance with modern style.</b> Whether you’re
        looking for a delicate daily wear piece, a bold statement design, or a
        meaningful gift for someone special, our bracelets are crafted to suit
        every mood and occasion. From traditional to contemporary styles, each
        bracelet adds a touch of sophistication and charm, making it the perfect
        accessory to complete your look.
        <br />
        <br />
        <div>
          <h1>FAQs</h1>
          <h2 className="font-bold">
            1. What makes a bracelet a perfect gift?
          </h2>
          <b>Answer:</b> A bracelet is a timeless gift because it carries
          emotional value and symbolizes love, friendship, or special memories.
          Its versatility makes it suitable for birthdays, anniversaries,
          weddings, or “just because” moments.
          <h2 className="font-bold">
            2. Which bracelet styles are best for daily wear ?
          </h2>
          <b>Answer:</b> For daily wear, lightweight and durable designs such as
          delicate chains, bangles, or leather bracelets are ideal. These pieces
          are comfortable, stylish, and easy to pair with any outfit.
          <h3 className="font-bold">
            3. How do I choose the right bracelet for a special occasion?
          </h3>
          <b> Answer:</b> For parties, weddings, or formal events, opt for bold
          designs like diamond-studded, gemstone, or pearl bracelets. They add
          sparkle and sophistication, perfectly complementing elegant attire.
          <h3 className="font-bold">
            4. Are bracelets suitable for both men and women?
          </h3>
          <b>Answer:</b> Yes, bracelets are unisex accessories. Men often prefer
          leather, beaded, or metal cuff styles, while women enjoy delicate
          chains, bangles, and designer gemstone bracelets. There’s a bracelet
          to suit everyone’s personality and taste.
          <h4 className="font-bold">
            5. What materials are most popular in bracelets?
          </h4>
          <b> Answer:</b> Popular bracelet materials include gold, silver,
          platinum, leather, pearls, beads, and gemstones. Each material offers
          a unique style—whether you prefer classic elegance, modern chic, or
          casual charm.
        </div>
      </div>
    </div>
  );
};

const ProductCard = ({ product, addToCart, onClick }) => {
  return (
    <CartDesign product={product} addToCart={addToCart} onClick={onClick} />
  );
};

export default BraceletsGrid;

// swip vala codee

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Pagination } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";

// import braceletsdata from "./BraceletsData";

// const BraceletsGrid = ({ addToCart }) => {
//   const navigate = useNavigate();

//   return (

//     <div className="scroll-mt-24 flex flex-col bg-[#ECEEDF] w-full pb-10 p-0 md:px-10">

//       <div className="w-full">
//         {/* Title Section */}
//         <div className="items-center text-center">
//           <div className="bg-[#eceacb] py-4 rounded-md">
//             <h2 className="text-4xl poppins-semibold text-[#e28e45] uppercase">
//               Bracelets
//             </h2>
//             <p className="text-lg poppins-medium text-amber-800">
//               Elegance that shines on your wrist
//             </p>
//           </div>
//         </div>

//         {/* ✅ Grid Layout (PC: 3, Tablet: 2, Mobile: 1) */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 px-4">
//           {braceletsdata.map((product) => (
//             <ProductCard
//               key={product.id}
//               product={product}
//               addToCart={addToCart}
//               onClick={() => navigate(`/bracelets/${product.id}`)}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// const ProductCard = ({ product, addToCart, onClick }) => {
//   const [showPopup, setShowPopup] = useState(false);

//   const discount = product.price - product.discountPrice;
//   const discountPercent = Math.round((discount / product.price) * 100);

//   const handleAddToCart = () => {
//     addToCart(product);
//     setShowPopup(true);
//     setTimeout(() => setShowPopup(false), 1500);
//   };

//   return (
//     <div className="px-2 relative poppins">
//       {/* ✅ Cart Popup */}
//       {showPopup && (
//         <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md z-50">
//           Added to Cart!
//         </div>
//       )}

//       {/* ✅ Product Card */}
//       <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
//         {/* ✅ Swiper Slider (Images + Video) */}
//         <div className="relative h-64">
//           <Swiper
//             modules={[Navigation, Pagination]}
//             navigation
//             pagination={{ clickable: true }}
//             spaceBetween={10}
//             slidesPerView={1}
//             // lazy={true} // ✅ Lazy load
//             // virtual // ✅ Virtual mode
//             className="h-64 rounded-md custom-swiper"
//           >
//             {product.images?.map((img, index) => (
//               <SwiperSlide key={index}>
//                 <img
//                   onClick={onClick}
//                   src={product.images[0]}
//                   alt={`${product.name}-${index}`}
//                   loading="lazy" // ✅ Lazy load
//                   className="w-full h-64 object-cover cursor-pointer rounded-md"
//                 />
//               </SwiperSlide>
//             ))}
//             {/* ✅ Video Slide */}
//             {product.videos && product.videos.length > 0 && (
//               <SwiperSlide>
//                 <video
//                   controls
//                   autoPlay
//                   muted
//                   loop
//                   loading="lazy" // ✅ Lazy load
//                   className="w-full h-64 rounded-md object-cover"
//                 >
//                   <source src={product.videos} type="video/mp4" />
//                   Your browser does not support the video tag.
//                 </video>
//               </SwiperSlide>
//             )}
//           </Swiper>
//         </div>

//         {/* ✅ Badge (SALE / NEW) */}
//         {product.badge && (
//           <span
//             className={`absolute top-3 right-3 text-white text-xs font-semibold px-2 py-1 rounded-lg shadow ${
//               product.badge === "SALE" ? "bg-red-500" : "bg-amber-500"
//             }`}
//           >
//             {product.badge}
//           </span>
//         )}

//         {/* ✅ Product Details */}
//         <div className="py-4 px-2">
//           <h3 className="flex justify-between">
//             <span className="font-semibold uppercase text-lg">
//               {product.name}
//             </span>
//             <span className="text-green-600 font-medium text-lg">
//               Size No: {product.size}
//             </span>
//           </h3>

//           <p className="text-sm text-gray-800 mt-1 line-clamp-2">
//             {product.description}
//           </p>

//           <p className="text-gray-500 text-sm mt-1">
//             Delivery: ₹ {product.deliveryCharge}
//           </p>

//           {/* ✅ Price + Discount */}
//           <div className="flex justify-between items-center mt-4">
//             <div className="flex flex-col text-amber-600 text-lg">
//               <span>
//                 Price: <span className="line-through">₹{product.price}</span>
//               </span>
//               <span className="font-bold text-green-600 text-lg">
//                 ₹{product.discountPrice}
//               </span>
//               <span className="text-sm text-gray-600">
//                 🎉 You saved ₹{discount} ({discountPercent}% OFF)
//               </span>
//             </div>

//             {/* ✅ Add to Cart Button */}
//             <button
//               onClick={handleAddToCart}
//               className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm"
//             >
//               Add to Cart
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BraceletsGrid;
