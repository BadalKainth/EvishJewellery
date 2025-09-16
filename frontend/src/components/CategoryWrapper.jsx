import React from "react";
import { useParams } from "react-router-dom";
import ProductsList from "./ProductsList";

export default function CategoryWrapper() {
  const { category } = useParams();
  return <ProductsList category={category} />;
}
