import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { apiGet } from "../../api/client";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import CartDesignId from "../CartDesignCode/CartDesignId";

const WatchDetails = ({ addToCart }) => {
  const [watch, setwatch] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();

  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchwatch = async () => {
      try {
        const response = await apiGet("/products", { category: "watch" });
        setwatch(response.data?.products || []);
        console.log("Fetched Watches:", response.data?.products);
      } catch (err) {
        setError(err.message || "Failed to load watch");
      } finally {
        setLoading(false);
      }
    };
    fetchwatch();
  }, []);

  const product = watch.find((p) => p.id.toString() === id);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-20">{error}</div>;
  }

  if (!product) {
    return (
      <div className="text-center text-red-500 mt-20">Product not found</div>
    );
  }

  return (
    <>
    <CartDesignId
      product={product} 
      addToCart={addToCart} 
      />
    </>
  );
};
export default WatchDetails;
