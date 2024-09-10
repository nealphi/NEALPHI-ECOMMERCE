import { useContext, useEffect, useState } from "react";
import {
  Button,
  Flex,
  Grid,
  GridItem,
  Image,
  Text,
  useToast,
} from "@chakra-ui/react";
import { IShopContext, ShopContext } from "../../context/shop-contex";
import AvatarUpload from "../../components/AvatarUpload";
import axios from "axios";
import ChangePasswordForm from "../../components/ChangePasswordForm";
import { useNavigate } from "react-router-dom";

const AccountPage = () => {
  const username = localStorage.getItem("username");
  const [email, setEmail] = useState<string>("");
  const api = process.env.REACT_APP_BASE_URL;
  const toast = useToast();
  let navigate = useNavigate();
  const redirect = () => {
    navigate("/shop");
  };

  const { getCartItemCount, addToCart, purchasedItems } =
    useContext<IShopContext>(ShopContext);

  const fetchEmail = async () => {
    try {
      const res = await axios.get(`${api}/user/email`, {
        withCredentials: true,
      });
      setEmail(res.data.email);
    } catch (error) {
      console.log("Error fetching Email", error);
    }
  };

  const handleChangePassword = async (currentPassword, newPassword) => {
    try {
      const response = await fetch(`${api}/user/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast({
          title: data.message,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "An error occurred.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchEmail();
  }, []);

  return (
    <Flex
      flexDirection={"column"}
      justifyContent={"center"}
      alignContent={"center"}
      alignItems={"center"}
      backgroundColor={"gray.800"}
      minHeight="100vh" // Ensures the footer stays at the bottom of the page
    >
      <Grid
        width={"70%"}
        maxWidth={"900px"}
        templateColumns={{
          sm: "repeat(1, 1fr)",
          md: "repeat(1, 1fr)",
          lg: "repeat(2, 1fr)",
        }}
        p={[5, 10]}
      >
        <GridItem textAlign={"center"} colSpan={[1, 1, 2]}>
          <Text fontSize={["16px", "24px"]} m={5}>
            {" "}
            {username}'s Account{" "}
          </Text>
        </GridItem>
        <GridItem
          display={"flex"}
          gap={"21px"}
          m={2}
          flexDirection={"column"}
          alignItems={"center"}
        >
          <Flex flexDirection={"column"} justifyContent={"left"}>
            <Text fontSize={["16px", "18px"]} color={"lightGreen"}>
              Email: {email}
            </Text>
            <Text
              textAlign={"left"}
              color={"lightGreen"}
              fontSize={["16px", "18px"]}
              mb={2}
            >
              Username: {username}{" "}
            </Text>
          </Flex>

          <AvatarUpload />
        </GridItem>
        <GridItem
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          m={2}
        >
          <ChangePasswordForm onChangePassword={handleChangePassword} />
        </GridItem>
      </Grid>

      <Flex
        flexDirection={"column"}
        alignItems={"center"}
        borderRadius={10}
        border={"1px solid rgb(134, 174, 173)"}
        m={10}
        width="100%"
        maxWidth="800px"
      >
        <Text fontSize={["16px", "24px"]} m={5}>
          {purchasedItems.length === 0
            ? "No Purchase History"
            : "Previously Purchased Items"}
        </Text>

        {purchasedItems.length === 0 ? (
          <Flex flexDirection="column" alignItems="center">
            <Text>Make your first purchase!</Text>
            <Button
              fontFamily={"body"}
              fontSize={["18px", "24px"]}
              onClick={redirect}
              p={[5, 10]}
              my={[5, 10]}
              backgroundColor={"lightGreen"}
              color={"white"}
              _hover={{ backgroundColor: "darkGreen" }}
            >
              SHOP NEALPHI
            </Button>
          </Flex>
        ) : (
          <Flex wrap={"wrap"} justifyContent={"center"} m={5}>
            {purchasedItems.map((item) => {
              const count = getCartItemCount(item._id);
              return (
                <Flex
                  key={item._id}
                  flexDirection={"column"}
                  p={5}
                  justifyContent={"center"}
                  width={"200px"}
                  gap={2}
                >
                  <Text>{item.productName}</Text>
                  <Image
                    src={item.imageURL}
                    alt={item.productName}
                    borderRadius={5}
                  />
                  <Text>${item.price}</Text>
                  <Button onClick={() => addToCart(item._id)}>
                    Purchase Again {count > 0 && <>{count}</>}
                  </Button>
                </Flex>
              );
            })}
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

export default AccountPage;
