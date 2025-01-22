import { Box, Text, VStack, Button } from "@chakra-ui/react";

import backImg from "../assets/background.jpg";

const Landingpage = () => {
  return (
    <Box
      h="100vh"
      backgroundImage={`url(${backImg})`}
      backgroundSize="cover"
      backgroundPosition="center"
      display="flex"
      justifyContent="center"
      alignItems="center"
      textAlign="center"
      position="relative"
    >
      <Box
        position="absolute"
        top="0"
        left="0"
        width="100%"
        height="100%"
        bg="rgba(0, 0, 0, 0.4)"
        zIndex="1"
      />

      {/* Content */}
      <VStack zIndex="2" gap={2} px={4}>
        <Text
          color="#E555F3"
          fontSize="4xl"
          fontWeight="bold"
          textTransform="uppercase"
        >
          Welcome to AI-Powered PowerPoint Creation
        </Text>
        <Text color="#fff" fontSize="2xl" fontWeight="semibold">
          Revolutionize the way you build presentations
        </Text>
        <Text maxW={"md"} color="#fff" fontSize="14px" fontWeight="normal">
          Effortlessly convert your ideas into professional slides in minutes
          using our AI-powered platform.
        </Text>
        <Text maxW={"md"} color="#fff" fontSize="14px" fontWeight="normal">
          No more manual formatting or design hassle—just focus on your content
          and let us handle the rest!
        </Text>
        <Button padding={4} borderColor={"#fff"} variant={"outline"}>
          Get Started
        </Button>
      </VStack>
    </Box>
  );
};

export default Landingpage;
