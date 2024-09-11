import { createContext, useEffect, useState } from "react";
import useGetProducts from "../hooks/useGetProducts";
import { IProduct } from "../models/interfaces";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";

export interface IShopContext {
  addToCart: (itemId: string) => void;
  removeFromCart: (itemId: string) => void;
  updateCartItemCount: (newAmount: number, itemId: string) => void;
  getCartItems: () => void;
  getCartItemCount: (itemId: string) => number;
  getTotalCartAmount: () => number;
  getTotalCartItems: () => number;
  checkout: () => void;
  setProfileImage: (profileImage: string) => void;
  profileImage: string;
  availableMoney: number;
  fetchAvailableMoney: () => void;
  purchasedItems: IProduct[];
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthentcated: boolean) => void;
  selectedTab: string;
  setSelectedTab: (selectedTab: string) => void;
  logout: () => void;
}

const defaultVal: IShopContext = {
  addToCart: () => null,
  removeFromCart: () => null,
  updateCartItemCount: () => null,
  getCartItems: () => null,
  getCartItemCount: () => 0,
  getTotalCartAmount: () => 0,
  getTotalCartItems: () => 0,
  checkout: () => null,
  setProfileImage: () => null,
  profileImage: " ",
  availableMoney: 0,
  fetchAvailableMoney: () => null,
  purchasedItems: [],
  isAuthenticated: false,
  setIsAuthenticated: () => null,
  selectedTab: "top",
  setSelectedTab: () => null,
  logout: () => null,
};

export const ShopContext = createContext<IShopContext>(defaultVal);

export const ShopContextProvider = (props) => {
  const [cartItems, setCartItems] = useState<{ [key: string]: number } | {}>(
    {}
  );
  const [profileImage, setProfileImage] = useState<string | " ">(" ");
  const [availableMoney, setAvailableMoney] = useState<number>(0);
  const [purchasedItems, setPurchasedItems] = useState<IProduct[]>([]);
  const { products, fetchProducts } = useGetProducts();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<string>("top");
  const api = process.env.REACT_APP_BASE_URL;
  const toast = useToast();

  const checkAuthentication = async () => {
    try {
      const response = await axios.get(`${api}/user/validate-token`, {
        withCredentials: true,
      });
      setIsAuthenticated(response.status === 200);
    } catch (err) {
      setIsAuthenticated(false);
    }
  };

  const fetchAvailableMoney = async () => {
    try {
      const res = await axios.get(`${api}/user/available-money`, {
        withCredentials: true,
      });
      setAvailableMoney(res.data.availableMoney);
    } catch (err) {
      console.log("ERROR: fetchAvailableMoney!", err);
    }
  };

  const fetchPurchasedItems = async () => {
    try {
      const res = await axios.get(`${api}/product/purchased-items`, {
        withCredentials: true,
      });
      setPurchasedItems(res.data.purchasedItems);
    } catch (err) {
      console.log("ERROR: fetchPurchasedItems!", err);
    }
  };

  const getCartItemCount = (itemId: string): number => {
    if (cartItems && itemId in cartItems) {
      return cartItems[itemId];
    }
    return 0;
  };

  const addToCart = async (itemId: string) => {
    setCartItems((prev) => {
      const updatedCartItems = { ...prev, [itemId]: (prev[itemId] || 0) + 1 };
      const body = {
        cartItems: updatedCartItems,
      };

      // Make sure to use updatedCartItems here
      axios
        .post(`${api}/product/cart/edit`, body, {
          withCredentials: true,
        })
        .catch((error) => console.error("Error adding to cart", error));

      return updatedCartItems;
    });
  };

  const removeFromCart = async (itemId: string) => {
    setCartItems((prev) => {
      if (!prev[itemId]) return prev;
      const updatedCartItems = { ...prev, [itemId]: prev[itemId] - 1 };
      const body = {
        cartItems: updatedCartItems,
      };
      axios
        .post(`${api}/product/cart/edit`, body, {
          withCredentials: true,
        })
        .catch((error) => console.error("Error removing from cart", error));
      return updatedCartItems;
    });
  };

  const updateCartItemCount = async (newAmount: number, itemId: string) => {
    if (newAmount < 0) return;

    setCartItems((prev) => {
      const updatedCartItems = { ...prev, [itemId]: newAmount };
      const body = {
        cartItems: updatedCartItems,
      };

      axios
        .post(`${api}/product/cart/edit`, body, {
          withCredentials: true,
        })
        .catch((error) =>
          console.error("Error updating cart item count", error)
        );

      return updatedCartItems;
    });
  };

  const getCartItems = async () => {
    try {
      const response = await axios.get(`${api}/product/cart`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setCartItems(response.data.cartItems);
      }
    } catch (error) {
      console.error("Error getting cart items", error);
    }
  };

  const getTotalCartAmount = () => {
    if (products.length === 0) return 0;

    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo: IProduct = products.find(
          (product) => product._id === item
        );
        totalAmount += cartItems[item] * itemInfo.price;
      }
    }
    return Number(totalAmount.toFixed(2));
  };

  const getTotalCartItems = () => {
    return Object.values(cartItems).reduce((total, num) => total + num, 0);
  };

  const checkout = async () => {
    const body = { cartItems };
    try {
      // Perform the checkout operation
      await axios.post(`${api}/product/checkout`, body, {
        withCredentials: true,
      });

      // Reset the cart items in the database to 0
      const resetCartBody = {
        cartItems: {},
      };
      await axios.post(`${api}/product/cart/edit`, resetCartBody, {
        withCredentials: true,
      });

      // Clear the cart in the local state
      setCartItems({});

      // Refresh the data
      fetchAvailableMoney();
      fetchPurchasedItems();
      fetchProducts();

      navigate("/");
      toast({
        title: "Purchased Successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${api}/user/logout`, {}, { withCredentials: true });
      setIsAuthenticated(false);
      window.localStorage.clear();
      navigate("/auth");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  useEffect(() => {
    isAuthenticated && fetchAvailableMoney();
    fetchPurchasedItems();
    getCartItems();
  }, [isAuthenticated]);

  const contextValue: IShopContext = {
    addToCart,
    removeFromCart,
    updateCartItemCount,
    getCartItems,
    getCartItemCount,
    getTotalCartAmount,
    getTotalCartItems,
    checkout,
    profileImage,
    setProfileImage,
    availableMoney,
    fetchAvailableMoney,
    purchasedItems,
    isAuthenticated,
    setIsAuthenticated,
    selectedTab,
    setSelectedTab,
    logout,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};
