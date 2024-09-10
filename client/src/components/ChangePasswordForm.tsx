import { useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Text,
} from "@chakra-ui/react";

const ChangePasswordForm = ({ onChangePassword }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords do not match.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    onChangePassword(currentPassword, newPassword);
  };

  return (
    <Box as="form"  onSubmit={handleSubmit}>
      <Text textAlign={"left"} fontSize={["16px","18px"]} mb={10} color={'lightGreen'}>
        Change Password:
      </Text>

      <FormControl id="current-password" isRequired>
        <FormLabel>Current Password</FormLabel>
        <Input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
      </FormControl>
      <FormControl id="new-password" isRequired mt={4}>
        <FormLabel>New Password</FormLabel>
        <Input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </FormControl>
      <FormControl id="confirm-password" isRequired mt={4}>
        <FormLabel>Confirm New Password</FormLabel>
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </FormControl>
      <Button
        fontFamily={"body"}
        width={"100%"}
        my={[5, 10]}
        backgroundColor={"lightGreen"}
        color={"white"}
        _hover={{ backgroundColor: "darkGreen" }}
        colorScheme="teal"
        type="submit"
      >
        Change Password
      </Button>
    </Box>
  );
};

export default ChangePasswordForm;
