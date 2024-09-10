import React, { useContext } from "react";
import { IProduct } from "../../models/interfaces";
import { IShopContext, ShopContext } from "../../context/shop-contex";
import { Button, Flex, Image, Input, Stack, Text } from "@chakra-ui/react";

interface Props {
  product: IProduct;
}
const CartItem = (props: Props) => {
  const { _id, productName, price, imageURL } = props.product;
  const { addToCart, getCartItemCount, removeFromCart, updateCartItemCount} =
    useContext<IShopContext>(ShopContext);
  const cartItemCount = getCartItemCount(_id);
  const totalPrice = price * cartItemCount ;
  return (
    <Flex
      flexDirection={["column", "column", "row"]}
      width={["80vw", "80vw", "60vw"]}
      padding={"30px"}
      bg={"gray.100"}
      gap={5}
      m={5}
      borderRadius={"20px"}
      justifyContent={"space-between"}
      alignItems={"center"}
    >
      <Image
        width={["80%", "80%", "30%"]}
        src={imageURL}
        alt={productName}
        borderRadius={"20px"}
      />
      <Stack width={"150px"}>
      <Text color={'darkGreen'}>Price ${totalPrice} </Text>

        <Button bg={"lightGreen"} _hover={{bg:"darkGreen" }} color={"white"} onClick={() => removeFromCart(_id)}>
          {" "}
          -{" "}
        </Button>
        <Input
          type="number"
          value={cartItemCount}
          onChange={(e) => updateCartItemCount(Number(e.target.value), _id)}
        />
        <Button bg={"lightGreen"} _hover={{bg:"darkGreen" }} color={"white"} onClick={() => addToCart(_id)}>
          {" "}
          +{" "}
        </Button>
      </Stack>
    </Flex>
  );
};

export default CartItem;
