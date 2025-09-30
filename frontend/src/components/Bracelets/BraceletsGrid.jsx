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
        <h1 className="font-bold text-base md:text-2xl text-amber-700">
          Bracelets – Elegant & Stylish Bracelet Designs for Every Occasion
        </h1>
        <p>
          Explore elegant and stylish bracelet designs for every occasion at
          <b className="text-amber-700"> AvishJEWELS</b>. Shop bracelets that
          provide that extra touch of charm, sophistication, and timeless style
          to any look, perfect for daily wear, special occasions, celebrations,
          or gifting to someone special.
        </p>
        <br />
        <p>
          A bracelet is more than an accessory; it reflects personality,
          emotion, and style. Each bracelet at{" "}
          <b className="text-amber-700"> AvishJEWELS</b>
          tells a story—whether it represents love, friendship, or
          individuality. Bracelets can range from subtle elegance to bold
          statement pieces and can elevate any outfit from ordinary to
          extraordinary.
        </p>
        <br />
        <p>
          At <b className="text-amber-700">AvishJEWELS</b>, you will find a
          beautiful collection of bracelets for every mood and occasion. Our
          bracelets include delicate chains, minimalist bangles, and bold
          statement designs that enhance any look with sophistication and charm.
          Available in traditional and modern styles, our bracelets are
          versatile enough to complement casual outfits, party looks, or festive
          attire.
        </p>
        <br />
        <h2 className="font-bold text-amber-700">
          What Makes a Bracelet Special?
        </h2>
        <p>
          A bracelet is not just a piece of jewelry; it tells a story about the
          wearer.
          <b>Bracelets can symbolize love, friendship, or personal style.</b>
          Many people choose bracelets because they are versatile and can
          complement any outfit. At{" "}
          <b className="text-amber-700">AvishJEWELS</b>, we have bracelets that
          suit casual wear, party outfits, or formal looks.
        </p>
        <br />
        <h2 className="font-bold text-amber-700">
          Different Styles of Bracelets
        </h2>
        <p>
          Our collection features charm bracelets, bangles, leather bracelets,
          and delicate chains. Each style has its unique appeal—charm bracelets
          reflect memories, bangles create an eye-catching effect, leather
          bracelets give a rugged vibe, and delicate chains offer everyday
          elegance. There’s a bracelet for every occasion at{" "}
          <b className="text-amber-700">AvishJEWELS</b>.
        </p>
        <br />
        <h2 className="font-bold text-amber-700">
          How to Choose the Right Bracelet
        </h2>
        <p>
          Consider your personal style and the occasions you will wear it for.
          Look for comfort, design, and versatility. Daily wear pieces are
          lightweight and practical, while special event bracelets are bold and
          eye-catching. At <b className="text-amber-700">AvishJEWELS</b>, each
          bracelet is designed to look beautiful and feel perfect on your wrist.
        </p>
        <br />
        <p>
          Discover our exclusive collection of bracelets at{" "}
          <b className="text-amber-700">AvishJEWELS</b>
          that blend elegance with modern style. From delicate daily wear to
          bold statement designs, every bracelet is crafted to suit every mood
          and occasion, making it the perfect accessory to complete your look.
        </p>
        <br />
        <div>
          <h1 className="font-bold text-amber-700">FAQs</h1>
          <h2 className="font-bold">
            1. What makes a bracelet a perfect gift?
          </h2>
          <b>Answer:</b> A bracelet from{" "}
          <b className="text-amber-700">AvishJEWELS</b>
          is a timeless gift that carries emotional value and symbolizes love,
          friendship, or special memories. Its versatility makes it suitable for
          birthdays, anniversaries, or any thoughtful occasion.
          <h2 className="font-bold">
            2. Which bracelet styles are best for daily wear?
          </h2>
          <b>Answer:</b> Lightweight and durable designs like delicate chains,
          bangles, or leather bracelets are ideal for everyday wear, offering
          comfort and style.
          <h2 className="font-bold">
            3. How do I choose the right bracelet for a special occasion?
          </h2>
          <b>Answer:</b> For parties or formal events, choose bold statement
          designs or unique charms to add sparkle and sophistication to your
          outfit.
          <h2 className="font-bold">
            4. Are bracelets suitable for both men and women?
          </h2>
          <b>Answer:</b> Yes, <b className="text-amber-700">AvishJEWELS</b>{" "}
          bracelets are unisex, with options for every style and personality.
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
