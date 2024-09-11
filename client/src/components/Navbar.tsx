import { FaWallet } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { useContext } from "react";
import { IShopContext, ShopContext } from "../context/shop-contex";
import { FaCartShopping } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";

import {
  Button,
  Flex,
  Icon,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";

export const Navbar = () => {
  const {
    availableMoney,
    isAuthenticated,
    setSelectedTab,
    getTotalCartItems,
    logout,
  } = useContext<IShopContext>(ShopContext);
  const username = localStorage.getItem("username");

  const count = getTotalCartItems();

  return (
    <Flex className="navbar" px={[5, 10]}>
      <Link
        _hover={{ textDecoration: "none" }}
        onClick={() => setSelectedTab("top")}
        href="/"
        fontSize={"24px"}
        fontFamily={"nealphi"}
        letterSpacing={"10px"}
      >
        NEALPHI
      </Link>
      <Flex gap={5}>
        <Link href="https://www.instagram.com/nealphi/">
          <Icon boxSize={6} as={FaInstagram} />
        </Link>
        <Link href="https://www.youtube.com/channel/UC7HuDqoVYuXIVbM_QT54nCg">
          <Icon boxSize={6} as={FaYoutube} />
        </Link>

        {isAuthenticated && (
          <Menu>
            <MenuButton>
              <Link>
                <Icon boxSize={5} as={FaUser} mr={1} />
              </Link>
            </MenuButton>
            <MenuList>
              <MenuGroup>
                <Link href="/account" _hover={{ textDecoration: "none" }}>
                  <MenuItem>
                    <Text>{username}'s Account</Text>{" "}
                  </MenuItem>
                </Link>
                <Link href="/checkout" _hover={{ textDecoration: "none" }}>
                  <MenuItem justifyContent={"space-between"}>
                    <Text>
                      {count} {count > 1 ? "items" : "item"} in Cart
                    </Text>

                    <Icon boxSize={6} as={FaCartShopping} />
                  </MenuItem>
                </Link>
                <MenuItem justifyContent={"space-between"}>
                  <Text> ${availableMoney.toFixed(2)} Credit</Text>{" "}
                  <Icon boxSize={5} as={FaWallet} />
                </MenuItem>
              </MenuGroup>
              <MenuDivider />
              <MenuGroup>
                <Link
                  href="/auth"
                  _hover={{ textDecoration: "none" }}
                  onClick={logout}
                >
                  <MenuItem justifyContent={"space-between"}>
                    Logout
                    <Icon boxSize={5} as={FaArrowRightFromBracket} />
                  </MenuItem>
                </Link>
              </MenuGroup>
            </MenuList>
          </Menu>
        )}

        {!isAuthenticated && (
          <Link href="/auth" _hover={{ textDecoration: "none" }}>
            Login
          </Link>
        )}
      </Flex>
    </Flex>
  );
};
