import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet } from "../../api/client";
import { CartContext } from "../../context/CartContext";
import CartDesign from "../CartDesignCode/CartDesign";

const BagsGrid = () => {
  const navigate = useNavigate();

  const [bags, setbags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { addItem } = useContext(CartContext);

  useEffect(() => {
    const fetchbags = async () => {
      try {
        const response = await apiGet("/products", { category: "bags" });
        setbags(response.data?.products || []);
        const data = response.data?.products;
        console.log(data);
      } catch (err) {
        setError(err.message || "Failed to load bags");
      } finally {
        setLoading(false);
      }
    };
    fetchbags();
  }, []);

  if (loading) return <p className="text-center py-6">Loading bags...</p>;
  if (error) return <p className="text-center text-red-600 py-6">{error}</p>;

  return (
    <div className="scroll-mt-24 flex flex-col bg-[#ECEEDF] w-full pb-10 md:px-10">
      <div className="w-full">
        {/* Title Section */}
        <div className="items-center text-center">
          <div className="bg-[#eceacb] py-4 rounded-md">
            <h2 className="text-4xl poppins-semibold text-[#e28e45] uppercase">
              bags
            </h2>
            <p className="text-lg poppins-medium text-amber-800">
              Elegance that shines on your wrist
            </p>
          </div>
        </div>

        {/* ✅ Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 px-4">
          {bags.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={() => addItem(product._id)} // ✅ send productId to backend
              onClick={() => navigate(`/category/bags/${product.id}`)}
            />
          ))}
        </div>
      </div>
      <div className="p-10 text-justify poppins-regular">
        


      </div>
    </div>
  );
};

const ProductCard = ({ product, addToCart, onClick }) => {


  return (
    <>
      <>
      <CartDesign
      product={product} 
      addToCart={addToCart} 
      onClick={onClick}
      />
      </>
    </>
  );
};

export default BagsGrid;
