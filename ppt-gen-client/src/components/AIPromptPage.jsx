import {
  Box,
  VStack,
  Text,
  Button,
  Image,
  Textarea,
  Spinner,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import aiIllustration from "../assets/robot2.png";
import { keyframes } from "@emotion/react";

const AIPromptPage = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://68.154.99.58:5000/api/generate-preview", {
        
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) throw new Error("Failed to generate preview.");

      const data = await res.json();
      toast.success("Generated!", {
        position: "top-right",
        autoClose: 3000,
      });

      navigate("/generated-content", {
        state: { slides: data },
      });
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };
  const float = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-14px); }
  100% { transform: translateY(0); }
`;
  return (
    <Box
      h="100vh"
      display="flex"
      flexDirection={{ base: "column", md: "row" }}
      overflow="hidden"
      bg="linear-gradient(to bottom,rgb(0, 61, 108),rgb(0, 1, 7))"
    >
      <ToastContainer />

      {/* Left: Neon Robot Image */}
      <Box
        flex="1"
        display="flex"
        justifyContent="center"
        alignItems="center"
        p={6}
        bg="transparent"
      >
        <VStack
          spacing={6}
          w="100%"
          maxW="500px"
          bg="rgba(255, 255, 255, 0.05)"
          border="1px solid rgb(3, 69, 251)"
          borderRadius="2xl"
          backdropFilter="blur(16px)"
          p={8}
          boxShadow="0 0 40px rgba(3, 69, 251, 0.4)"
        >
          <Text
            fontSize="2xl"
            fontWeight="bold"
            color="cyan.200"
            textAlign="center"
          >
            🔷 AI Digital Assistant
          </Text>

          <Text fontSize="md" color="gray.300" textAlign="center">
            Enter your prompt to generate futuristic AI content.
          </Text>

          <Textarea
            placeholder="Type your AI prompt here..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            bg="rgba(255, 255, 255, 0.05)"
            border="1px solid cyan"
            color="white"
            rows={5}
            _focus={{
              borderColor: "cyan.400",
              boxShadow: "0 0 8px cyan",
            }}
          />

          <Button
            w="100%"
            bgGradient="linear(to-r, #00FFFF, #3D5AFE)"
            color="black"
            fontWeight="bold"
            _hover={{
              transform: "scale(1.05)",
              boxShadow: "0 0 20px rgba(0,255,255,0.5)",
            }}
            onClick={handleGenerate}
            isLoading={loading}
            loadingText="Generating..."
          >
            ✨ Generate
          </Button>

          {loading && <Spinner color="cyan.400" />}
        </VStack>
      </Box>

      {/* Right: Prompt Area */}

      <Box
        flex="1"
        display="flex"
        justifyContent="center"
        alignItems="center"
        p={6}
        bg="transparent"
      >
        <Image
          src={aiIllustration}
          alt="Futuristic AI Bot"
          maxH="100%"
          maxW="100%"
          objectFit="contain"
          animation={`${float} 3s ease-in-out infinite`}
        />
      </Box>
    </Box>
  );
};

export default AIPromptPage;
