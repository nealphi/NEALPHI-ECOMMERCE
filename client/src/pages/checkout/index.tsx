import { useContext } from "react";
import useGetProducts from "../../hooks/useGetProducts";
import { IShopContext, ShopContext } from "../../context/shop-contex";
import { IProduct } from "../../models/interfaces";
import CartItem from "./CartItem";
import { useNavigate } from "react-router-dom";
import { Button, Flex, Stack, Text } from "@chakra-ui/react";

const CheckoutPage = () => {
  const { getCartItemCount, getTotalCartAmount, checkout } =
    useContext<IShopContext>(ShopContext);
  const { products } = useGetProducts();
  const navigate = useNavigate();
  const totalAmount = getTotalCartAmount();


  return (
    <Flex bg={"gray.200"} width={"100%"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"} gap={5} p={10}>
      <Stack >
        {products.map((product: IProduct) => {
          if (getCartItemCount(product._id) !== 0)
            return <CartItem product={product} key={product.productName} />;
        })}
      </Stack>
      {totalAmount > 0 ? (
        <Flex flexDirection={["column","column","row"]} justifyContent={"center"} alignItems={"center"} gap={5}>
          <Text fontSize={"lg"} as={"b"} color={"white"}>Subtotal: ${totalAmount.toFixed(2)}</Text>
          <Button  bg={"lightGreen"} _hover={{bg:"darkGreen" }} color={"white"}  onClick={() => navigate("/shop")}>Continue Shopping </Button>
          <Button bg={"lightGreen"} _hover={{bg:"darkGreen" }} color={"white"} onClick={checkout}>Checkout</Button>
        </Flex>
      ) : (
        <Text>Your Shopping Cart is Empty</Text>
      )}
    </Flex>
  );
};

export default CheckoutPage;
