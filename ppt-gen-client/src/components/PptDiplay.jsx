import { Box, Text, VStack, HStack, IconButton,Button } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useLocation,useNavigate } from "react-router";
import { BsFullscreen, BsFullscreenExit } from "react-icons/bs";
import { FaLightbulb } from "react-icons/fa";

const GeneratedContentPage = () => {
  const location = useLocation();
  const { response, imageUrl } = location.state || {};
  console.log(response);
  
  const navigate = useNavigate();
  const [isFullscreen, setIsFullscreen] = useState(false); // Fullscreen mode toggle
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0); // Track the current slide

  const slides = response
    ? response.split(/Slide \d+: /).filter((slide) => slide.trim() !== "")
    : [];

  const slideContent = slides[currentSlideIndex];
  const [title, ...content] = slideContent
    ? slideContent.split("- ")
    : ["", []];

  useEffect(() => {
    if (typeof response !== "string") {
      console.error("Invalid response data, expected a string.");
    }
  }, [response]);

  if (!response) {
    return <Text>No content available to display.</Text>;
  }
const handleGoBack = () => {
  navigate("/ai-prompt");
}

  return (
    <Box p={0} position="relative" background={"#F4F7FF"}>
      {/* Fullscreen Toggle Icon */}
      <IconButton
        position="absolute"
        top={8}
        right={8}
        onClick={() => setIsFullscreen(!isFullscreen)}
        aria-label="Toggle Fullscreen"
        size="lg"
        zIndex={10}
        variant={"outline"}
        _hover={{ bg: "transparent" }}
        fontWeight={"bold"}
        color={"#E555F3"}
        borderColor={"#E555F3"}
      >
        {isFullscreen ? (
          <BsFullscreenExit color="#E555F3" fontWeight={"bold"} />
        ) : (
          <BsFullscreen color="#E555F3" fontWeight={"bold"} />
        )}
      </IconButton>

      {/* Fullscreen Mode */}
      {isFullscreen ? (
        <Box
          position="relative"
          w="100%"
          h="100vh"
          display="flex"
          flexDirection={currentSlideIndex % 2 === 0 ? "row" : "row-reverse"}
          alignItems="center"
          bg={"#F4F7FF"} // Softer, cleaner background
          color="black"
          zIndex={1}
         
        >
          {/* Image Section */}
          <Box
            flex="0 0 50%"
            bgImage={`url(${imageUrl || "/path/to/default-image.jpg"})`}
            bgSize="cover"
            bgPosition="center"
            height="100vh"
            margin="0"
            boxShadow="0 4px 15px rgba(0, 0, 0, 0.2)"
          />

          {/* Text Section */}
          <Box
            flex="1"
            p={8}
            textAlign="left"
            borderRadius="lg"
            position="relative"
          >
            {/* Title in a Colorful Box with Icon */}
            <Box
              position="relative"
              bg="#00BFFF"
              color="white"
              paddingY="24px"
              marginBottom="25px"
              width="fit-content"
              boxShadow="0 4px 10px rgba(0, 0, 0, 0.15)"
              clipPath="polygon(0% 20%, 100% 0%, 100% 80%, 0% 100%)" // Wave shape
            >
              <FaLightbulb
                color="yellow"
                size={28}
                style={{ marginRight: "12px",marginTop:"20px" }}
                
              />
              <Text fontSize="3xl" fontWeight="bold">
                {title?.trim()}
              </Text>
            </Box>

            {/* Content Section in Different Style */}
            <VStack spacing={6} align="start">
              {content.map((point, i) => (
                <Box
                  key={i}
                  bg="#00BFFF"
                  padding="20px"
                 
                  width="100%"
                  maxW="450px"
                  boxShadow="0 4px 20px rgba(0, 0, 0, 0.1)"
                >
                  <Text fontSize="18px" color={"#fff"} lineHeight="1.6">
                    {point.trim()}
                  </Text>
                </Box>
              ))}
            </VStack>
          </Box>

          {/* Bottom Navigation (Colorful) */}
          <HStack
            position="absolute"
            bottom="20px"
            left="0"
            right="0"
            justify="center"
            spacing={3}
            zIndex={2}
          >
            {slides.map((_, index) => (
              <Box
                key={index}
                width="120px"
                height="8px"
                bg={currentSlideIndex === index ? "#FF6347" : "gray.300"} // Use a distinct color like tomato red for active slide
                cursor="pointer"
                onClick={() => setCurrentSlideIndex(index)}
                transition="background-color 0.3s ease"
                borderRadius="8px"
              />
            ))}
          </HStack>
        </Box>
      ) : (
        // Non-Fullscreen Mode
        <VStack spacing={6} p={4} align="center">
          {slides.map((slide, index) => {
            const [slideTitle, ...slideContent] = slide.split("- ");
            return (
              <Box
                key={index}
                w="100%"
                maxW="800px"
                bg={"#FFF8F0"}
                borderRadius="lg"
                boxShadow="lg"
                display="flex"
                flexDirection={index % 2 === 0 ? "row" : "row-reverse"}
                alignItems="center"
                gap={4}
                position="relative"
              >
                {/* Image Section */}
                <Box
                  flex="0 0 30%"
                  bgImage={`url(${imageUrl || "/path/to/default-image.jpg"})`}
                  bgSize="cover"
                  bgPosition="center"
                  height="auto"
                   minHeight="300px"
                />

                {/* Text Section with Square Boxes */}
                <Box
                  flex="1"
                  textAlign="left"
                  borderRadius="lg"
                  padding={6}
                  position="relative"
                >
                  {/* Title in a Box with Icon */}
                  <Box
                    display="flex"
                    alignItems="center"
                    background="#FF5C8D"
                    color="white"
                    padding="12px"
                    borderRadius="8px"
                    marginBottom="20px"
                    width="fit-content"
                    boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)"
                  >
                    <FaLightbulb
                      color="yellow"
                      size={24}
                      style={{ marginRight: "8px" }}
                    />
                    <Text fontSize="2xl" fontWeight="bold">
                      {slideTitle?.trim()}
                    </Text>
                  </Box>

                  {/* Content in Square Boxes */}
                  <VStack spacing={6} align="start">
                    {slideContent.map((point, i) => (
                      <Box
                        key={i}
                        background="#F9F9F9"
                        padding="16px"
                        borderRadius="8px"
                        width="fit-content"
                        boxShadow="0 2px 6px rgba(0, 0, 0, 0.1)"
                        _hover={{
                          transform: "scale(1.05)",
                          transition: "0.3s",
                        }}
                      >
                        <Text fontSize="16px" color="#4A4A4A" lineHeight="1.5">
                          {point.trim()}
                        </Text>
                      </Box>
                    ))}
                  </VStack>
                </Box>
              
              </Box>
            );
          })}
        </VStack>
      )}
        <Button ml={"10px"} onClick={handleGoBack}> Go back</Button>
    </Box>
  );
};

export default GeneratedContentPage;
