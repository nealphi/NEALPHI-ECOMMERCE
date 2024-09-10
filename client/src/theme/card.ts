import { cardAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(cardAnatomy.keys);

// define the base component styles
const baseStyle = definePartsStyle({
  // define the part you're going to style
  container: {
    color: "gray.100",
    backgroundColor: "mocha",
  },
  header: {
    paddingBottom: "2px",
  },
  body: {
    paddingTop: "2px",
  },
  footer: {
    paddingTop: "4px",
    button: {
      color: "white",
      backgroundColor: "lightGreen",
      _hover: { backgroundColor: "darkGreen" },
    },
  },
});

const sizes = {
  md: definePartsStyle({
    container: {
      borderRadius: "0",
    },
  }),
  // define custom styles for xl size
  xl: definePartsStyle({
    container: {
      borderRadius: "10px",
      padding: "40px",
    },
  }),
};

// define custom variant
const variants = {
  funky: definePartsStyle({
    container: {
      //   borderColor: "#459cc6",
      //   borderWidth: "3px",
      //   color: "chakra-body-text"
    },
  }),
};

// export the component theme
export const cardTheme = defineMultiStyleConfig({
  baseStyle,
  sizes,
  variants,
  defaultProps: {
    // define which size and variant is applied by default
    size: "xl",
    variant: "funky",
  },
});
