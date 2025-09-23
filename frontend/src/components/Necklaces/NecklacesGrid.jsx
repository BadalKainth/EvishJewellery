import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { apiGet } from "../../api/client";
import CartDesign from "../CartDesignCode/CartDesign";

const NecklacesGrid = () => {
  const navigate = useNavigate();

  
     const [necklaces, setnecklaces] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState("");
      
        const { addItem } = useContext(CartContext);
      
        useEffect(() => {
          const fetchnecklaces = async () => {
            try {
              const response = await apiGet("/products", {
                category: "necklaces",
              });
              setnecklaces(response.data?.products || []);
              const data = response.data?.products;
              console.log(data);
            } catch (err) {
              setError(err.message || "Failed to load Necklaces");
            } finally {
              setLoading(false);
            }
          };
          fetchnecklaces();
        }, []);
      
        if (loading) return <p className="text-center py-6">Loading necklaces...</p>;
        if (error)
          return <p className="text-center text-red-600 py-6">{error}</p>;
  

  return (
    <div
      id="necklaces"
      className="scroll-mt-24 flex flex-col bg-[#ECEEDF] w-full pb-10 poppins"
    >
      <div className="w-full">
        {/* Heading */}
        <div className="items-center text-center mb-6">
          <div className="bg-[#eceacb] py-4 rounded-md">
            <h2 className="text-4xl poppins-semibold text-[#e28e45] uppercase">
              Necklaces
            </h2>
            <p className="text-lg poppins-medium text-amber-800">
              Elegance that sparkles around your neck
            </p>
          </div>
        </div>

        {/* ✅ Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-5 md:px-20 gap-4 mt-6">
          {necklaces.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={() => addItem(product._id)} // ✅ send productId to backend
              onClick={() => navigate(`/category/necklaces/${product._id}`)}
            />
          ))}
        </div>
      </div>

      <div className="p-10 px-6 md:px-20 text-justify poppins-regular">
        <b>Necklaces – Modern & Traditional Necklace Designs Online</b>
        <br />
        Find traditional and modern necklace designs online. Shop designer,
        gold, silver and diamond necklaces for weddings, occasions, every day.{" "}
        <br />
        <br />
        Necklaces are one of the most beloved pieces of jewelry, representing
        elegance, beauty and individuality. Whether it is a simple modern
        necklace for daily wear or a comprehensive traditional gold necklace for
        weddings, cultural events or festival occasions, necklaces lend charm
        and purpose to every outfit. In our online store, you will discover an
        exquisite variety of designer necklaces for sale in an array of styles,
        including silver necklaces, diamond necklaces, statement chokers or
        layered necklaces that can be worn as trendy or contemporary necklaces.
        Each necklace is designed with meticulous precision, bringing together
        classic tradition with modern style. You will discover more than just
        necklaces, you will find necklaces that embrace your style and make
        moments more memorable! A necklace is more than just an accessory, it is
        a timeless piece of jewelry to finish any look or reflect your
        creativity. Whether you are gazing at intricate traditional gold
        necklaces, wearing simple modern silver and diamond link necklaces,
        there are a world of necklaces and styles that have the ability to
        unlock your outfit or special occasion. Whether you are looking for
        elegance in daily wear, a gift for a loved one, or bridal jewelry that
        makes a statement, you will find an exclusive private collection of
        necklaces for every style and occasion.
        <br />
        <br />
        <b>Buy Designer Necklaces Online</b> <br /> Purchasing necklaces on the
        web has never been easier. We offer a large assortment of designer
        necklace collections, and within minutes you can experience beautiful
        and unique necklaces from the comfort of home. Every necklace is made
        safely with precision and creativity. So whether you are looking to for
        necklaces that suit your style, our website offers a range to help
        define your personality. Whether that be a minimal chain for everyday
        use or layering necklaces, bold chokers, or a statement pendant, we try
        our best to keep ahead of the curve. Each necklace provides amazing
        charm, grace, and sophistication for each person once on, and make's
        online shopping effortlessly easy. <br />
        <br />
        <b>Traditional Gold Necklace Designs</b> <br /> Gold is more than simply
        a precious metal—it's a representation of purity, lineage, and life
        celebrations. Our traditional gold necklace designs are created to
        acknowledge cultural roots while incorporating a contemporary feel. As
        artifacts of weddings, festivals, or traditional ceremonial occasions,
        traditional necklaces often contain intricate display designs often in
        temple jewelry style, in addition to intricacy of design; notably, the
        popular use of kundan work and meenakari. Traditional gold necklaces can
        range from a simple, everyday gold chain to elaborate bridal necklaces
        with added bangles. Each style has unique historical, cultural meaning
        and sentimental value that denotes an indelible form of elegance and
        beauty that can retain its value for future generations of heirloom
        jewelry. <br />
        <br />
        <b>Modern Silver & Diamond Necklaces</b> <br /> If you enjoy
        contemporary elegance, our modern silver and diamond necklaces are a
        beautiful option for you. Silver necklaces have a universal appeal and
        effortlessly complement both western and traditional styles. Diamond
        necklaces epitomize luxury and brilliance, representing decadence and
        sophistication. Diamonds can be subtle and elegant, such as in a
        solitaire pendant, or make a statement in a diamond set that shines from
        every angle. Our modern silver and diamond collections are for the
        modern person who celebrates their individuality and never forgets a
        moment. They are beautiful gifts for your loved ones, fun items for
        yourself, or just pretty jewelry to include in your life, adding both
        glamour and meaning. <br />
        <br />
        <b>Stylish Necklaces for Weddings & Parties</b> <br /> No celebration
        look is complete without the right necklace. Our selective variety of
        stylish necklaces for weddings and parties includes bold chokers,
        layered pearl sets, glittering diamond constructions, and designer
        unique jewelry. Whether you are the bride making your big-day entrance,
        the bridesmaid looking for something stylist, or the guest adding your
        sparkle to the event, our necklaces are designed for your garments and
        your confidence. Every piece is made for you to shine at every occasion.{" "}
        <br />
        <br />
        <b>Necklaces are not simply jewelry—</b> they are symbols of love,
        culture, and personal style, but also memories. Whether you want to find
        designer necklaces online for everyday wear, select a traditional gold
        necklace for your cultural celebrations, or even choose a modern silver
        & diamond necklace for a sophisticated chic look, we have carefully
        curated our necklaces to ensure we have the perfect piece for your mood
        and occasion. When it comes to life's most special celebrations, our
        wedding and party necklaces will ensure you shine with dignity and
        grace. By combining artistry, tradition, and quality craftsmanship, our
        necklaces are stories you can wear, memories you can hold on to, and
        timeless elements that will add value to your style.
      </div>
    </div>
  );
};

// ==================== PRODUCT CARD ====================
const ProductCard = ({ product, addToCart, onClick }) => {
 
  return (
    <>
    <CartDesign 
    product={product} 
      addToCart={addToCart} 
      onClick={onClick}
      />
    
    
    </>
  );
};

export default NecklacesGrid;
