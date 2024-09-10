import Product from "../../components/Product";
import useGetProducts from "../../hooks/useGetProducts";
import { useEffect, useState } from "react";
import { Flex, Grid, GridItem } from "@chakra-ui/react";
const ShopPage = () => {
  const { products } = useGetProducts();
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);


  return (
    <Flex flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
      <Grid
        templateColumns={{
          sm: "repeat(1, 1fr)",
          md: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
          xl: "repeat(4, 1fr)",
        }}
      >
        {products.map((product) => (
          <GridItem key={product.productName}>
            <Product product={product}  />
          </GridItem>
        ))}
      </Grid>
    </Flex>
  );
};

export default ShopPage;
