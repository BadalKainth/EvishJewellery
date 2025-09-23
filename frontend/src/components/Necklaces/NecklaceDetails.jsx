import React, { useEffect, useState } from "react";
import { useParams} from "react-router-dom";
import { apiGet } from "../../api/client";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import CartDesignId from "../CartDesignCode/CartDesignId";

const NecklaceDetails = ({ addToCart }) => {
  const [necklace, setnecklace] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { id } = useParams();

  useEffect(() => {
    const fetchnecklace = async () => {
      try {
        const response = await apiGet("/products", { category: "necklaces" });
        setnecklace(response.data?.products || []);
        console.log("Fetched necklaces:", response.data?.products);
      } catch (err) {
        setError(err.message || "Failed to load necklace");
      } finally {
        setLoading(false);
      }
    };
    fetchnecklace();
  }, []);

  const product = necklace.find((p) => p.id.toString() === id);

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
export default NecklaceDetails;
