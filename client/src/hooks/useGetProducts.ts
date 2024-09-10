import axios from "axios";
import { useEffect, useState } from "react";
import { IProduct } from "../models/interfaces";

const useGetProducts = () => {
  const [products, setProducts] = useState<IProduct[]>([]);

  const api = process.env.REACT_APP_BASE_URL;

  const fetchProducts = async () => {
    try {
      const fetchedProducts = await axios.get(`${api}/product`);
      setProducts(fetchedProducts.data.products);
    } catch (err) {
      console.log("ERROR: fetchProducts!");
    }
  };
  
  useEffect(() => {
    fetchProducts();
  }, []);

  return {products, fetchProducts}
};

export default useGetProducts;
