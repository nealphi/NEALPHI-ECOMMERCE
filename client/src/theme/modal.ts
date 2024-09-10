import { modalAnatomy as parts } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/styled-system";

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(parts.keys);

const baseStyle = definePartsStyle({
  overlay: {
    bg: "blackAlpha.800", // Dark background
    height: "100vh",
  },
  dialog: {
    borderRadius: "0px",
    bg: "transparent",
    width: "fit-content", // Define a specific width or fit-content
    maxWidth: "80%", // Optional: Set a max-width to prevent overflow
    margin: "auto", // Center using margin auto
  },
  closeButton: {
    zIndex: "1000",
    color: "darkGreen",
    border: "none",
  },
  body: {
    padding: "0px",
  },
  footer: {
    button: {
      bg: "lightGreen",
      color: "white",
      _hover: {
        bg: "darkGreen",
      },
    },
  },
});

export const modalTheme = defineMultiStyleConfig({
  baseStyle,
});
