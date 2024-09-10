import { SyntheticEvent, useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserErrors } from "../../models/errors";
import { IShopContext, ShopContext } from "../../context/shop-contex";
import {
  Flex,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
  Link,
  FormControl,
  InputRightElement,
  chakra,
  Text,
} from "@chakra-ui/react";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const CFaUserAlt = chakra(FaUserAlt);
const MdEmailAlt = chakra(MdEmail);
const CFaLock = chakra(FaLock);

const AuthPage = () => {
  const [isVisible, setIsVisible] = useState<string>("login");

  return (
    <Flex
      flexDirection={"column"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Register isVisible={isVisible} setIsVisible={setIsVisible} />
      <Login isVisible={isVisible} setIsVisible={setIsVisible} />
    </Flex>
  );
};

const Register = ({ isVisible, setIsVisible }) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  const handleShowClick = () => setShowPassword(!showPassword);

  const api = process.env.REACT_APP_BASE_URL;
  const handleRegister = async (event: SyntheticEvent) => {
    event.preventDefault();

    try {
      await axios.post(`${api}/user/register`, {
        email,
        username,
        password,
      });

      alert("registration completed! Now login!");
      setEmail(" ");
      setUsername(" ");
      setPassword(" ");
      setIsVisible("login");
    } catch (err) {
      let errorMessage: string = "";
      switch (err?.response?.data?.type) {
        case UserErrors.USERNAME_ALREADY_EXISTS:
          errorMessage = "Username already exists";
          break;
        case UserErrors.EMAIL_ALREADY_EXISTS:
          errorMessage = "Email already exists";
          break;
        default:
          errorMessage = "Something went wrong";
      }

      alert(`ERROR: ${errorMessage}`);
    }
  };

  return (
    <Flex
      display={isVisible === "register" ? "flex" : "none"}
      flexDirection="column"
      width="100wh"
      height={"calc(100vh - 80px)"}
      alignContent={"center"}
      justifyContent="center"
      alignItems="center"
      color="gray.300"
    >
      <Stack>
        <form onSubmit={handleRegister} style={{ width: "100%" }}>
          <Stack
            spacing={4}
            mb="2"
            p="1rem"
            backgroundColor="whiteAlpha.900"
            boxShadow="md"
          >
            <FormControl>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<MdEmailAlt color="gray.300" />}
                />
                <Input
                  placeholder={"Email"}
                  type="email"
                  id="email"
                  focusBorderColor="darkGreen"
                  borderColor="lightGreen"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </InputGroup>
            </FormControl>
            <FormControl>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<CFaUserAlt color="gray.300" />}
                />
                <Input
                  placeholder={"Username"}
                  type="text"
                  id="username"
                  focusBorderColor="darkGreen"
                  borderColor="lightGreen"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </InputGroup>
            </FormControl>
            <FormControl>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  color="gray.300"
                  children={<CFaLock color="gray.300" />}
                />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  id="password"
                  focusBorderColor="darkGreen"
                  borderColor="lightGreen"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    onClick={handleShowClick}
                    color={"darkGreen"}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Button
              fontSize={["14px", "16px"]}
              px={"20%"}
              py={"5%"}
              my={10}
              color={"white"}
              backgroundColor={"lightGreen"}
              _hover={{ backgroundColor: "darkGreen" }}
              transition={"all, linear, 0.1s"}
              type="submit"
              variant="solid"
              width="full"
            >
              Register
            </Button>
          </Stack>
        </form>
      </Stack>
      <Flex>
        <Text>Already a member?</Text>
        <Link
          pl={2}
          color="teal.500"
          href="#"
          onClick={() => setIsVisible("login")}
        >
          Login
        </Link>
      </Flex>
    </Flex>
  );
};

const Login = ({ isVisible, setIsVisible }) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  const handleShowClick = () => setShowPassword(!showPassword);

  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext<IShopContext>(ShopContext);
  const api = process.env.REACT_APP_BASE_URL;

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    try {
      const result = await axios.post(`${api}/user/login`, {
        username,
        password,
      },{ withCredentials: true });

      window.localStorage.setItem("userID", result.data.userId);
      window.localStorage.setItem("username", username);
      setIsAuthenticated(true);
      navigate("/");
    } catch (err) {
      let errorMessage: string = "";
      switch (err?.response?.data?.type) {
        case UserErrors.USERNAME_ALREADY_EXISTS:
          errorMessage = "User already exists";
          break;
        case UserErrors.WRONG_CREDENTIALS:
          errorMessage = "Wrong username/password combination";
          break;
        default:
          errorMessage = "Something went wrong";
      }

      alert(`ERROR: ${errorMessage}`);
    }
  };

  return (
    <Flex
      display={isVisible === "login" ? "flex" : "none"}
      flexDirection="column"
      height={"calc(100vh - 80px)"}
      justifyContent="center"
      alignItems="center"
      alignContent={"center"}
      color="gray.300"
    >
      <Stack>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <Stack
            spacing={4}
            mb="2"
            p="1rem"
            backgroundColor="whiteAlpha.900"
            boxShadow="md"
          >
            <FormControl>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<CFaUserAlt color="gray.300" />}
                />
                <Input
                  type="text"
                  id="username"
                  focusBorderColor="darkGreen"
                  borderColor="lightGreen"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </InputGroup>
            </FormControl>
            <FormControl>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  color="gray.300"
                  children={<CFaLock color="gray.300" />}
                />
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  focusBorderColor="darkGreen"
                  borderColor="lightGreen"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    onClick={handleShowClick}
                    color={"darkGreen"}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Button
              fontSize={["14px", "16px"]}
              px={"20%"}
              py={"5%"}
              my={10}
              backgroundColor={"lightGreen"}
              color={"white"}
              _hover={{ backgroundColor: "darkGreen" }}
              transition={"all, linear, 0.1s"}
              type="submit"
              variant="solid"
              width="full"
            >
              Login
            </Button>
          </Stack>
        </form>
      </Stack>
      <Flex>
        <Text> New to NEALPHI? </Text>

        <Link
          color="teal.500"
          href="#"
          onClick={() => setIsVisible("register")}
          pl={2}
        >
          Register
        </Link>
      </Flex>
    </Flex>
  );
};

export default AuthPage;
