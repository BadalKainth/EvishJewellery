import React from "react";
import { Link } from "react-router-dom";
import tinytreasure from "../../img/tiny tressure.jpeg";
import hydroluxe from "../../img/hydro luxe.jpeg";
import smartliving from "../../img/smartliving.jpeg";
import auradecor from "../../img/auradecor.jpeg";
import newlaunches from "../../img/new launches.jpeg";
import sheverse from "../../img/sheverse.jpeg";

const collections = [
  {
    title: "Tiny Treasures",
    subtitle: "Kids & Toys Collection",
    image: tinytreasure,
    path: "/category/bracelets",
    imageClassName: "object-cover",
  },
  {
    title: "Hydro Luxe",
    subtitle: "Water Bottles & Drinkware",
    image: hydroluxe,
    path: "/category/rings",
    imageClassName: "object-cover",
  },
  {
    title: "Smart Living",
    subtitle: "Home & Kitchen Essentials",
    image: smartliving,
    path: "/category/earrings",
    imageClassName: "object-fill",
  },
  {
    title: "Aura Decor",
    subtitle: "Home Decor Collection",
    image: auradecor,
    path: "/category/necklaces",
    imageClassName: "object-cover",
  },
  {
    title: "New Launches",
    subtitle: "Fresh arrivals just in",
    image: newlaunches,
    path: "/category/couple-sets",
    imageClassName: "object-cover",
  },
  {
    title: "SheVerse",
    subtitle: "All women-related products.",
    image: sheverse,
    path: "/category/anklets",
    imageClassName: "object-cover",
  },
];

const OurCollections = () => {
  return (
    <section
      id="collections"
      className="theme-page-bg overflow-hidden py-8 poppins-regular"
    >
      <div className="container mx-auto px-4">
        <div className="pb-6 text-center">
          <h2 className="cormorant-garamond-bold mb-2 text-4xl uppercase text-[#2b3134]">
            Our Collections
          </h2>
          <p className="mx-auto max-w-2xl text-[#6b7277]">
            Each piece is crafted with precision and passion to celebrate
            life&apos;s special moments.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {collections.map((collection) => (
            <div
              key={collection.path}
              className="theme-card overflow-hidden rounded-[1.75rem] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_rgba(30,47,56,0.14)]"
            >
              <div className="relative overflow-hidden">
                <Link to={collection.path} className="block">
                  <img
                    src={collection.image}
                    alt={collection.title}
                    className={`h-52 w-full cursor-pointer ${collection.imageClassName}`}
                  />
                </Link>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1f2427] via-transparent to-transparent opacity-75"></div>
                <div className="pointer-events-auto absolute bottom-0 left-0 p-4 text-white">
                  <h3 className="text-xl poppins-semibold">
                    {collection.title}
                  </h3>
                  <p className="poppins-medium text-[#ece6de]">
                    {collection.subtitle}
                  </p>
                </div>
              </div>

              <div className="p-4">
                <Link to={collection.path} className="theme-link poppins-medium">
                  View Collection &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurCollections;
