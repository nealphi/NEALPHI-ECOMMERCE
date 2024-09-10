import React, { useContext } from "react";
import { IProduct } from "../models/interfaces";
import { IShopContext, ShopContext } from "../context/shop-contex";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Flex,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,

  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Image,
  Stack,
} from "@chakra-ui/react";
import ImageMagnifier from "./ImageMagnifier";
import { useNavigate } from "react-router-dom";

interface Props {
  product: IProduct;
}

const Product = (props: Props) => {
  const { _id, productName, price, stockQuantity, imageURL } =
    props.product;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { addToCart, getCartItemCount, isAuthenticated } =
    useContext<IShopContext>(ShopContext);
  const count = getCartItemCount(_id);
  let navigate = useNavigate();
  return (
    <>
      <Card maxW="sm" m={3}>
        <CardBody >
          <Image
            onClick={onOpen}
            cursor={"zoom-in"}
            src={imageURL}
            alt={productName}
            borderRadius="lg"
            
          />
          <Stack mt="6" spacing="3">
            <Text fontSize={["16px"]} as={"b"}>
              {productName}
            </Text>
            <Text fontSize="xl">$ {price} </Text>
          </Stack>
        </CardBody>
        <Divider />
        <CardFooter>
         
            <Flex
              mt={2}
              width={"100%"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Button onClick={() => { 
                (isAuthenticated) ? addToCart(_id) : navigate("/auth")}}>
             
                {count === 0 ? "Add To Cart" : "Add more"}{" "}
              </Button>
              <Text margin={1} fontSize={"medium"}>
                {count === 0 ? " " : `${count} in Cart`}
              </Text>
              {stockQuantity === 0 && <Text>Out Of Stock</Text>}
            </Flex>
    
        </CardFooter>
      </Card>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <ImageMagnifier src={imageURL} zoomLevel={3} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Product;
