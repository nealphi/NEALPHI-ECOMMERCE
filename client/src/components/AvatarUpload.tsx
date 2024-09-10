import { Box, Button, Flex, Image, Input, Stack, useToast } from "@chakra-ui/react";
import type { PutBlobResult } from "@vercel/blob";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa"; // Importing a default profile icon

export default function AvatarUpload() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  const [avatar, setAvatar] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const api = process.env.REACT_APP_BASE_URL;
  const toast = useToast();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      throw new Error("No file selected");
    }

    const response = await fetch(
      `${api}/user/blobUpload?filename=${file.name}`,
      {
        method: "POST",
        body: file,
      }
    );

    const newBlob = (await response.json()) as PutBlobResult;
    setBlob(newBlob);
    await updateImageUrl(newBlob.url);
    fetchImageUrl();
    toast({
      title: "New Image Submitted Successfully!",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  const updateImageUrl = async (url: string) => {
    try {
      await axios.post(
        `${api}/user/imageurl`,
        { url } , {withCredentials: true,}
      );
    } catch (error) {
      console.error("Error updating image URL", error);
    }
  };

  const fetchImageUrl = async () => {
    try {
      const res = await axios.get(
        `${api}/user/imageurl` , {withCredentials: true});
      setAvatar(res.data.profileImageUrl);
    } catch (error) {
      console.log("Error fetching image URL", error);
    }
  };

  useEffect(() => {
    fetchImageUrl();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);

      // Preview the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  return (
    <Stack>
      <Flex
        width={"200px"}
        height={"200px"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        {avatar ? (
          <Image
            objectFit={"cover"}
            borderRadius={"full"}
            src={avatar}
            cursor={"pointer"}
            onClick={() => inputFileRef.current?.click()} // Trigger file input click
            boxSize={"200px"}
          />
        ) : (
          <Box
            as={FaUserCircle}
            boxSize={"200px"}
            color={"lightGreen"}
            cursor={"pointer"}
            onClick={() => inputFileRef.current?.click()} // Trigger file input click
          />
        )}
        <Input
          hidden
          id="upload"
          name="file"
          ref={inputFileRef}
          type="file"
          onChange={handleFileChange}
          required
        />
      </Flex>
      <Flex flexDirection={"column"}>
        <form
          style={{ display: "flex", flexDirection: "column" }}
          onSubmit={handleSubmit}
        >
          <Button
            type="button"
            width={"200px"}
            backgroundColor={"lightGreen"}
            color={"white"}
            _hover={{ backgroundColor: "darkGreen" }}
            my={2}
            onClick={() => inputFileRef.current?.click()} // Trigger file input click
          >
            Upload Image
          </Button>

          {file && (
            <Button
              type="submit"
              width={"200px"}
              backgroundColor={"lightGreen"}
              color={"white"}
              _hover={{ backgroundColor: "darkGreen" }}
              my={2}
            >
              Submit Changes
            </Button>
          )}
        </form>
      </Flex>
    </Stack>
  );
}
