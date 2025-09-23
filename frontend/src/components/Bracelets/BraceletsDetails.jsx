import React, { useEffect, useState } from "react";
import { useParams} from "react-router-dom";
import { apiGet } from "../../api/client";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import CartDesignId from "../CartDesignCode/CartDesignId";

const BraceletsDetails = ({ addToCart }) => {
  const [bracelets, setbracelets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

 


  useEffect(() => {
    const fetchbracelets = async () => {
      try {
        const response = await apiGet("/products", { category: "bracelets" });
        setbracelets(response.data?.products || []);
        console.log("Fetched bracelets:", response.data?.products);
      } catch (err) {
        setError(err.message || "Failed to load bracelets");
      } finally {
        setLoading(false);
      }
    };
    fetchbracelets();
  }, []);
  const { id } = useParams();
  const product = bracelets.find((p) => p.id.toString() === id);

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
export default BraceletsDetails;
