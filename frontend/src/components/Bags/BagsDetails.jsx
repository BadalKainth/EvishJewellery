import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { apiGet } from "../../api/client";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import CartDesignId from "../CartDesignCode/CartDesignId";

const BagsDetails = ({ addToCart }) => {
  const [bags, setbags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();

  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchbags = async () => {
      try {
        const response = await apiGet("/products", {
          category: "bags",
        });
        setbags(response.data?.products || []);
        console.log("Fetched bags:", response.data?.products);
      } catch (err) {
        setError(err.message || "Failed to load bags");
      } finally {
        setLoading(false);
      }
    };
    fetchbags();
  }, []);

  const product = bags.find((p) => p.id.toString() === id);

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
export default BagsDetails;
