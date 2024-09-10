import { useState } from "react";
import { Text, Button, Box } from "@chakra-ui/react";

const MaskedText = ({ text = "", maskChar = "•" }) => {
  const [isMasked, setIsMasked] = useState(true);

  const toggleMask = () => {
    setIsMasked(!isMasked);
  };

  const maskedText = text.toString().split("").map(() => maskChar).join("");

  return (
    <Box display="flex" alignItems="center">
      <Text>{isMasked ? maskedText : text}</Text>
      <Button
        ml={4}
        size="sm"
        onClick={toggleMask}
        variant="outline"
        colorScheme="teal"
      >
        {isMasked ? "Show" : "Hide"}
      </Button>
    </Box>
  );
};

export default MaskedText;
