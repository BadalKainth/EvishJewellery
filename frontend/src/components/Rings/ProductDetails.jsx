import React, { useEffect, useState } from "react";
import { useParams} from "react-router-dom";
import { apiGet } from "../../api/client";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import CartDesignId from "../CartDesignCode/CartDesignId";

const ProductDetails = ({ addToCart }) => {
  const [rings, setrings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { id } = useParams();

  useEffect(() => {
    const fetchrings = async () => {
      try {
        const response = await apiGet("/products", { category: "rings" });
        setrings(response.data?.products || []);
        console.log("Fetched ringss:", response.data?.products);
      } catch (err) {
        setError(err.message || "Failed to load rings");
      } finally {
        setLoading(false);
      }
    };
    fetchrings();
  }, []);

  const product = rings.find((p) => p.id.toString() === id);

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

export default ProductDetails;
