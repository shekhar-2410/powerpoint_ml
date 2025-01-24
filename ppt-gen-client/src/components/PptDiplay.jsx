import {
  Box,
  Text,
  VStack,
  HStack,
  IconButton,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { BsFullscreen, BsFullscreenExit } from "react-icons/bs";
import { FaLightbulb } from "react-icons/fa";
import pptbacg from "../assets/ppt_back.jpg";
import genricimg from "../assets/generic.png";

const GeneratedContentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Check for location.state and fallback to an empty array if undefined
  const slides = location.state?.slides?.slides || [];
  console.log("Slides: ", slides);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const currentSlide = slides[currentSlideIndex];
  console.log("Current Slide: ", currentSlide);

  const handleGoBack = () => {
    navigate("/ai-prompt");
  };

  return (
    <Box
      p={0}
      position="relative"
      bgImage={`url(${pptbacg})`}
      bgSize="cover"
      bgPosition="center"
    >
      {slides && slides.length > 0 ? (
        <>
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
            color={"#C18800"}
            borderColor={"#C18800"}
          >
            {isFullscreen ? (
              <BsFullscreenExit color="#C18800" fontWeight={"bold"} />
            ) : (
              <BsFullscreen color="#C18800" fontWeight={"bold"} />
            )}
          </IconButton>

          {/* Fullscreen Mode */}
          {isFullscreen ? (
            <Box
              position="relative"
              w="100%"
              h="100vh"
              display="flex"
              flexDirection={
                currentSlideIndex % 2 === 0 ? "row" : "row-reverse"
              }
              justifyContent="center"
              alignItems="center"
              bgImage={`url(${pptbacg})`}
              bgSize="cover"
              bgPosition="center"
              zIndex={2}
            >
              {/* Image Section */}
              <Box
                bgImage={`url(${
                  currentSlide.imageUrl && currentSlide.imageUrl.trim() !== ""
                    ? currentSlide.imageUrl
                    : genricimg
                })`}
                flex="0 0 40%"
                bgSize="contain" // Ensures image fits within the box without cropping
                bgPosition="center" // Keeps the image centered
                height="auto" // Ensures the height adjusts automatically based on the image size
                minHeight="300px" // Set a minimum height to avoid shrinking too much
                maxHeight="500px" // Optional: Limit the max height to prevent excessive stretching
              />

              {/* Text Section */}
              <Box
                flex="1"
                p={8}
                textAlign="left"
                borderRadius="lg"
                zIndex={3}
                maxWidth="500px"
              >
                <Box
                  position="relative"
                  bg="#C18800"
                  color="white"
                  paddingY="24px"
                  paddingX={"32px"}
                  marginBottom="25px"
                  width="fit-content"
                  boxShadow="0 4px 10px rgba(0, 0, 0, 0.15)"
                  clipPath="polygon(0% 20%, 100% 0%, 100% 80%, 0% 100%)"
                >
                  <FaLightbulb
                    color="#fff"
                    size={28}
                    style={{ marginRight: "12px", marginTop: "20px" }}
                  />
                  <Text fontSize="3xl" fontWeight="bold">
                    {currentSlide.title?.trim()}
                  </Text>
                </Box>

                <VStack spacing={6} align="start">
                  {Array.isArray(currentSlide.content)
                    ? currentSlide.content.map((point, i) => (
                        <Box
                          key={i}
                          bg="#C18800"
                          padding="20px"
                          width="100%"
                          maxW="450px"
                          boxShadow="0 4px 20px rgba(0, 0, 0, 0.1)"
                        >
                          <Text fontSize="18px" color={"#fff"} lineHeight="1.6">
                            {point.trim()}
                          </Text>
                        </Box>
                      ))
                    : currentSlide.content && (
                        <Box
                          key="single-content"
                          bg="#C18800"
                          padding="20px"
                          width="100%"
                          maxW="450px"
                          boxShadow="0 4px 20px rgba(0, 0, 0, 0.1)"
                        >
                          <Text fontSize="18px" color={"#fff"} lineHeight="1.6">
                            {currentSlide.content.trim()}
                          </Text>
                        </Box>
                      )}
                </VStack>
              </Box>

              {/* Bottom Navigation */}
              <HStack
                position="absolute"
                bottom="20px"
                left="0"
                right="0"
                justify="center"
                spacing={3}
                zIndex={3}
              >
                {slides.map((_, index) => (
                  <Box
                    key={index}
                    width="120px"
                    height="8px"
                    bg={currentSlideIndex === index ? "#C18800" : "gray.300"}
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
              {slides.map((slide, index) => (
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
                >
                  <Box
                    flex="0 0 40%"
                    bgImage={`url(${
                      slide.imageUrl && slide.imageUrl.trim() !== ""
                        ? slide.imageUrl
                        : genricimg
                    })`}
                    bgSize="cover"
                    height="auto"
                    minHeight="300px"
                  />
                  <Box flex="1" textAlign="left" p={6}>
                    <Box
                      display="flex"
                      alignItems="center"
                      background="#004B59"
                      color="white"
                      padding="8px"
                      borderRadius="4px"
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
                        {slide.title?.trim()}
                      </Text>
                    </Box>
                    <VStack spacing={6} align="start">
                      {typeof slide.content === "string" ? (
                        <Box
                          key={index}
                          background="#C18800"
                          padding="16px"
                          borderRadius="8px"
                          width="fit-content"
                          boxShadow="0 2px 6px rgba(0, 0, 0, 0.1)"
                        >
                          <Text fontSize="16px" color="#fff" lineHeight="1.5">
                            {slide.content.trim()}
                          </Text>
                        </Box>
                      ) : (
                        slide.content.map((point, i) => (
                          <Box
                            key={i}
                            background="#F9F9F9"
                            padding="16px"
                            borderRadius="8px"
                            width="fit-content"
                            boxShadow="0 2px 6px rgba(0, 0, 0, 0.1)"
                          >
                            <Text
                              fontSize="16px"
                              color="#4A4A4A"
                              lineHeight="1.5"
                            >
                              {point.trim()}
                            </Text>
                          </Box>
                        ))
                      )}
                    </VStack>
                  </Box>
                </Box>
              ))}
            </VStack>
          )}
        </>
      ) : (
        <Box
          w="100%"
          h="100vh"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Text fontSize="3xl" fontWeight="bold">
            No generated content available
          </Text>
        </Box>
      )}

      {!isFullscreen && (
        <Button
          position="absolute"
          background={"#002329"}
          top="20px"
          left="20px"
          zIndex={10}
          variant="solid"
          color={"white"}
          paddingX={"20px"}
          onClick={handleGoBack}
        >
          Go Back
        </Button>
      )}
    </Box>
  );
};

export default GeneratedContentPage;
