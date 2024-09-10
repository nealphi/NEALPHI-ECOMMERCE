import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Image,
  Link,
  Text,
} from "@chakra-ui/react";
import {  useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import VideoComponent from "../../components/Video";
import { ContactUs } from "../../components/ContactUs";

const NealphiPage = () => {
  const topRef = useRef(null);
  const collectionRef = useRef(null);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);

  const imageSrc = [
    { src: "../1.jpeg", url: "/p/CV7wLvUopaZ/" },
    { src: "../2.jpeg", url: "/p/Cry06NBIH7z/" },
    { src: "../3.jpeg", url: "/p/CgbfLyioJdR/" },
    { src: "../4.jpeg", url: "/p/CaKO8gUoZTI/" },
    { src: "../5.jpeg", url: "/p/Cn9sYccI9OF/" },
    { src: "../6.jpeg", url: "/p/CiFTPAeofaL/" },
    { src: "../7.jpeg", url: "/p/CTcbIXrIi7d/" },
    { src: "../8.jpeg", url: "/p/CW50vtWoOGg/" },
  ];
  const openUrl = (url) => {
    window.open(
      `https://www.instagram.com${url}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  let navigate = useNavigate();
  const redirect = () => {
   navigate("/shop");
  };

  useEffect(() => {
    const refs = [topRef, collectionRef, aboutRef, contactRef];

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        } else {
          entry.target.classList.remove("visible");
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
    });

    refs.forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      refs.forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, []);

  return (
    <Box>
      <Grid
        backgroundColor={"mocha"}
        templateColumns={{
          sm: "repeat(1, 1fr)",
          md: "repeat(2, 1fr)",
          lg: "repeat(2, 1fr)",
          xl: "repeat(2, 1fr)",
        }}
        p={[0, 10]}
        gap={[5, 10]}
      >
        <GridItem>
          <VideoComponent />
        </GridItem>
        <GridItem
          h={"100%"}
          minH={"200px"}
          textAlign={"center"}
          alignContent={"center"}
          ref={topRef}
          className="fade-in"
          color={'white'}
        >
          <Text fontFamily={"body"} fontSize={["14px", "16px", "20px"]}>
            Hey Bag Lovers! Welcome to the NEALPHI's
          </Text>
          <Text fontFamily={"headings"} fontSize={["24px","28px", "40px", "48px"]}>
            SUMMER PARTY!
          </Text>
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
        </GridItem>
      </Grid>

      <Grid
        backgroundColor={"beige"}
        templateColumns={{
          sm: "repeat(1, 1fr)",
          md: "repeat(1, 1fr)",
          lg: "repeat(1, 1fr)",
          xl: "repeat(2, 1fr)",        }}
        p={[5, 10]}
        gap={[5, 10]}
        color={"black"}
      >
        <GridItem textAlign={"center"} alignContent={"center"} gap={5}>
          <Text fontFamily={"body"} fontSize={["22px", "34"]} color={"black"}>
            Discover the NEALPHI collection
          </Text>
          <Text
            fontFamily={"title"}
            fontSize={["14px", "20px"]}
            color={"black"}
            mb={10}
          >
            "where each pouch offers something special"
          </Text>

          <Text
            p={[5, 10]}
            fontFamily={"body"}
            textAlign={"justify"}
            fontSize={["14px", "18px"]}
            backgroundColor={"lightBeige"}
            borderRadius={["30px","50px"]}
          >
            The fluffy pouch feels as smooth and airy as a marshmallow, like
            snuggling up to a soft rabbit—perfect for adding a gentle, soothing
            touch to your day, whether you’re stashing it in your beach bag
            filled with cosmetics, skin care products, and other personal stuff
            for a summer vacation.
            <br />
            <br />
            The puffy pouch, with its smooth, classy feel, is ideal for keeping
            your essentials organized, bringing a touch of elegance whether
            you're lounging by the pool or enjoying an evening out.
            <br />
            <br />
            The transparent pouch is a must-have for summer—simple yet
            stylish, it lets you see your sunscreen, lip balm, and other
            personal items at a glance while adding a hint of glamour to your
            getaway.
            <br /> Each pouch in the NEALPHI collection offers something unique,
            making them perfect companions for all your summer adventures.
          </Text>
        </GridItem>

        <GridItem >
          <Image
            src="../collection.jpeg"
            ref={collectionRef}
            className="fade-in"
          />
        </GridItem>
      </Grid>
      <Grid
        templateColumns={{
          sm: "repeat(1, 1fr)",
          md: "repeat(1, 1fr)",
          lg: "repeat(2, 1fr)",
        }}
        p={[5, 10]}
        bgColor={"lightBeige"}
        gap={[5, 10]}
      >
        <GridItem>
          <Image
            ref={aboutRef}
            className="fade-in"
            src="../neginpanahi.jpeg"
          />
        </GridItem>
        <GridItem
          display={"flex"}
          justifyContent={"space-between"}
          flexDirection={"column"}
          textAlign={"justify"}
          color={"black"}
          fontSize={["14px", "18px"]}
        >
          <Text>
            After graduating from the Art University of Tehran in 2020, Negin
            Alphi started her business, NEALPHI, by turning an old garage into
            her workspace. NEALPHI offers handmade products, each showing
            Negin's dedication to quality and detail. Her focus on authenticity
            and craftsmanship helped NEALPHI quickly gain recognition and a
            loyal customer base.
          </Text>
          <Text>
            NEALPHI's story is not just about high quality handmade items but
            also about the strength and power of women. It highlights the
            success of a business run entirely by women and demonstrates how
            female entrepreneurship can transform simple beginnings into
            thriving ventures.
          </Text>
          <Text>
            Aligned with her dedication to women empowerment, Negin also
            publishes free tutorials on NEALPHI's{" "}
            <Link color={"darkGreen"} href="https://www.youtube.com/@NEALPHI">
              YouTube channel
            </Link>{" "}
            and runs workshops to help other women start their own businesses.
            She believes in sharing her knowledge and skills to support and
            inspire other women to pursue their entrepreneurial dreams.
          </Text>
        </GridItem>
      </Grid>
      <Box backgroundColor={"lightBeige"} p={[5, 10]}>
        <Grid
          templateColumns={{
            base: "repeat(2, 1fr)",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          }}
          gap={2}
        >
          {imageSrc.map((image) => (
            <GridItem key={image.url} cursor={"pointer"}>
              <Image src={image.src} onClick={() => openUrl(image.url)} />
            </GridItem>
          ))}
        </Grid>
        <Flex
          justifyContent={"center"}
          alignItems={"center"}
          h={"100px"}
          color={"black"}
          p={10}
        >
          <Text
            textAlign={"center"}
            fontFamily={"body"}
            fontSize={{ sm: "18px", md: "24px" }}
            color={"mocha"}
          >
            For more inspiration, follow us on Instagram at{" "}
            <Link href="https://www.instagram.com/nealphi/"> @nealphi </Link>
          </Text>
        </Flex>
      </Box>
      <Flex ref={contactRef}>
        <ContactUs />
      </Flex>
    </Box>
  );
};

export default NealphiPage;


