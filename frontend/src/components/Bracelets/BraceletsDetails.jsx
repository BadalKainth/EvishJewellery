import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiGet } from "../../api/client";
import {CartContext} from "../../context/CartContext"

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import CartDesignId from "../CartDesignCode/CartDesignId";

const BraceletsDetails = ({ addToCart }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { id } = useParams();
    const { addItem } = useContext(CartContext);


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await apiGet(`/products/${id}`);
        setProduct(response.data?.product || null);
      } catch (err) {
        setError(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);


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
        key={product._id}
        product={product}
        addToCart={() => addItem(product._id)} // 🔹 _id bhejo
      />
    </>
  );
};
export default BraceletsDetails;
