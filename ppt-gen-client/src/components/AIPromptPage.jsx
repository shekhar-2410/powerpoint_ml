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
import aiIllustration from "../assets/robot.png";
import ppt_back from "../assets/prom_b3.png";
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
      const res = await fetch("http://localhost:5001/api/generate-preview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate preview. Please try again.");
      }

      const data = await res.json();
      console.log(data);

      toast.success("Content generated successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      // Redirect with state
      navigate("/generated-content", {
        state: {
          slides: data,
        },
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

  return (
    <Box
      display="flex"
      h="100vh"
      flexDirection={{ base: "column", md: "row" }}
      p={4}
      bgImage={`url(${ppt_back})`}
      bgSize="cover"
      bgPosition="center"
    >
      <ToastContainer />

      {/* Static Image (no animation) */}
      <Box
        flex="1"
        display="flex"
        justifyContent="center"
        alignItems="center"
        bgGradient="linear(to-r, #ABAFD4, #1C1C1C)"
        borderRadius="lg"
        p={4}
      >
        <Image src={aiIllustration} alt="AI Robot" maxW="70%" />
      </Box>

      <Box
        flex="1"
        p={6}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <VStack spacing={6} align="stretch" w="90%">
          <Text color="#002329" fontSize="3xl" fontWeight="bold" textAlign="center">
            Type Your Prompt Below
          </Text>
          <Textarea
            placeholder="Enter your prompt..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            bg="#B28003"
            borderColor="gray.300"
            resize="none"
            rows={6}
            padding={4}
            color={"white"}
          />
          <Button
            background={"#002329"}
            onClick={handleGenerate}
            isLoading={loading}
            loadingText="Generating..."
            color={"white"}
          >
            Generate
          </Button>

          {loading && <Spinner ml={"50%"} color="purple.500" size="lg" />}
        </VStack>
      </Box>
    </Box>
  );
};

export default AIPromptPage;
