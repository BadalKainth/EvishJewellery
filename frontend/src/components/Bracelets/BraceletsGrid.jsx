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

  if (loading) return <p className="text-center py-6">Loading products...</p>;
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
              Tiny Treasures
            </h2>
            <p className="text-lg poppins-medium text-amber-800">
              Joyful &amp; Safe Kids &amp; Toys Collection
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

      {/* Existing Paragraphs & FAQ Section for Tiny Treasures */}
      <div className="p-10 text-justify poppins-regular text-xs md:text-base">
        <h1 className="font-bold text-base md:text-2xl text-amber-700">
          Tiny Treasures – Joyful & Safe Kids & Toys Collection
        </h1>
        <p>
          Welcome to a world of wonder and imagination with our <b className="text-amber-700">Tiny Treasures</b> collection at <b className="text-amber-700">Avish</b>. Explore our curated selection of delightful, safe, and engaging toys and kids' essentials designed to inspire creativity, laughter, and endless hours of joyful play. From educational learning tools to soft, cuddly companions, we provide only the best quality for your little ones.
        </p>
        <br />
        <p>
          Toys are more than just playthings; they are the stepping stones of growth, curiosity, and learning. Every piece in our <b className="text-amber-700">Tiny Treasures</b> collection is carefully chosen to nurture developmental skills, cognitive abilities, and motor coordination, ensuring that playtime is both enriching and fun.
        </p>
        <br />
        <p>
          At <b className="text-amber-700">Avish</b>, we prioritize the health and happiness of your children above all else. Our toys are crafted from non-toxic, child-safe materials, meeting the highest standards of safety and durability. Whether you are searching for the perfect birthday gift, interactive puzzles, or cute room decor for kids, you will find options that make parenting a breeze and childhood truly magical.
        </p>
        <br />
        <h2 className="font-bold text-amber-700">
          What Makes Our Kids & Toys Collection Special?
        </h2>
        <p>
          Our toys are not just designed to entertain—they are built to educate and spark curiosity.
          <b> Each toy encourages active participation, cognitive growth, and social-emotional development.</b>
          With vibrant colors, sleek designs, and interactive elements, we bring a modern touch to classic childhood favorites.
        </p>
        <br />
        <h2 className="font-bold text-amber-700">
          Different Playstyles and Categories
        </h2>
        <p>
          Our collection spans across developmental toys, educational puzzles, creative building blocks, and plush cuddly companions. Whether your child is an aspiring builder, an artist, or a quiet daydreamer, our toys cater to every unique personality and age group, providing the ideal balance of entertainment and learning.
        </p>
        <br />
        <h2 className="font-bold text-amber-700">
          How to Choose the Right Toy
        </h2>
        <p>
          Consider your child's age group, interests, and developmental milestone needs. Choose interactive and open-ended toys that encourage creativity, or go for simple, comforting plush toys for cozy bedtime routines. At <b className="text-amber-700">Avish</b>, every toy is crafted with love to bring a smile to your child's face.
        </p>
        <br />
        <div>
          <h1 className="font-bold text-amber-700">FAQs</h1>
          <h2 className="font-bold">
            1. Are the toys in the Tiny Treasures collection safe for toddlers?
          </h2>
          <b>Answer:</b> Yes, absolutely! Every product in our <b className="text-amber-700">Tiny Treasures</b> collection undergoes strict safety evaluations and is made from high-quality, non-toxic, BPA-free materials that are completely safe for young children.
          <h2 className="font-bold">
            2. What types of educational toys do you offer?
          </h2>
          <b>Answer:</b> We offer a wide range of learning tools, including building block sets, puzzle sets, memory games, and sensory stimulation toys that help kids develop cognitive, critical-thinking, and fine-motor skills.
          <h2 className="font-bold">
            3. Do you have options suitable for baby shower or birthday gifts?
          </h2>
          <b>Answer:</b> Yes! Our beautifully designed collection makes the perfect gifting destination for birthdays, baby showers, and milestones, with items suitable for infants, toddlers, and young kids.
          <h2 className="font-bold">
            4. How can I clean and maintain these toys?
          </h2>
          <b>Answer:</b> Most of our plastic and wooden toys can be easily wiped down with a damp cloth and mild soap. Plush toys can be spot-cleaned or gently hand-washed as per their care labels.
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
