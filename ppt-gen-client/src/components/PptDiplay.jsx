import {
  Box,
  Text,
  HStack,
  IconButton,
  Button,
  Input,
  Image,
  SimpleGrid,
  Flex,
  Textarea,
} from "@chakra-ui/react";

import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { BsFullscreen, BsFullscreenExit } from "react-icons/bs";
import pptbacg from "../assets/geometric-back.jpg";
import genricimg from "../assets/generic.png";
import PPTExport from "./downloadPpt";

const GeneratedContentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const slides = location.state?.slides?.slides || [];


  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [editedSlides, setEditedSlides] = useState(slides);

  const fullscreenContainerRef = useRef(null);

  const currentSlide = editedSlides[currentSlideIndex];

  const handleGoBack = () => navigate("/ai-prompt");

  const handleImageChange = (event, index) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newSlides = [...editedSlides];
        newSlides[index].imageUrl = reader.result;
        setEditedSlides(newSlides);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTextChange = (event, index, field) => {
    const newSlides = [...editedSlides];
    newSlides[index][field] = event.target.value;
    setEditedSlides(newSlides);
  };

  const addNewSlide = () => {
    const newSlide = {
      title: "",
      content: "",
      imageUrl: "",
    };
    setEditedSlides([...editedSlides, newSlide]);
  };

  // Request fullscreen
  const handleFullscreen = () => {
    if (fullscreenContainerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen(); // Exit fullscreen if already in fullscreen
        setIsFullscreen(false);
      } else {
        fullscreenContainerRef.current.requestFullscreen(); // Request fullscreen
        setIsFullscreen(true);
      }
    }
  };

  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg={isFullscreen ? "rgba(0, 0, 0, 0.42)" : "transparent"}
      zIndex={isFullscreen ? 5 : "auto"}
    >
      <Box
        p={0}
        position="relative"
        minHeight="100vh"
        backgroundImage={`url(${pptbacg})`}
        backgroundSize="cover"
        backgroundPosition="center"
        backgroundColor={isFullscreen ? "rgba(0, 0, 0, 0.42)" : "transparent"}
        overflowY={"hidden"}
        ref={fullscreenContainerRef}
      >
        {editedSlides.length > 0 ? (
          <>
            <IconButton
              position="absolute"
              top={4}
              right={8}
              onClick={handleFullscreen}
              aria-label="Toggle Fullscreen"
              size="lg"
              zIndex={10}
              variant={"outline"}
              _hover={{ bg: "transparent" }}
              fontWeight={"bold"}
              color={isFullscreen ? "#fff" : "black"}
              borderColor={isFullscreen ? "#fff" : "black"}
            >
              {isFullscreen ? <BsFullscreenExit /> : <BsFullscreen />}
            </IconButton>

            {isFullscreen ? (
              <Box
                display="flex"
                flexDirection={
                  currentSlideIndex % 2 === 0 ? "row" : "row-reverse"
                }
                alignItems="center"
                height="100vh"
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                bg="rgba(0, 0, 0, 0.42)"
              >
                <Box flex="1" position="relative">
                  <Image
                    src={currentSlide.imageUrl || genricimg}
                    alt="Slide Image"
                    width="100%"
                    height="100vh"
                    objectFit="cover"
                  />
                </Box>

                <Box flex="1" p={8} color="white">
                  <Text fontSize="3xl" fontWeight="bold" color="white">
                    {currentSlide.title}
                  </Text>
                  <Text fontSize="xl">{currentSlide.content}</Text>
                </Box>
              </Box>
            ) : (
              <SimpleGrid columns={[1]} p={16} gap={4} mt={4}>
                {editedSlides.map((slide, index) => (
                  <Box
                    key={index}
                    p={4}
                    bg="rgba(72, 72, 72, 0.26)"
                    blur={"4px"}
                  >
                    <Flex
                      align="center"
                      gap={4}
                      flexDirection={index % 2 === 0 ? "row" : "row-reverse"}
                    >
                      {/* Image section */}
                      <Image
                        src={slide.imageUrl || genricimg}
                        alt="Slide Image"
                        width="30%"
                        maxHeight="300px"
                        objectFit="cover"
                        borderRadius="lg"
                      />

                      {/* Text inputs */}
                      <Box flex="1">
                        <Input
                          value={slide.title}
                          onChange={(e) => handleTextChange(e, index, "title")}
                          fontSize="3xl"
                          fontWeight="bold"
                          color="#fff"
                          border="none"
                        />
                        <Textarea
                          value={slide.content}
                          onChange={(e) =>
                            handleTextChange(e, index, "content")
                          }
                          fontSize="lg"
                          mt={2}
                          color="#fff"
                          border="none"
                          resize="none"
                          minH="80px"
                        />
                        <Input
                          type="file"
                          accept="image/*"
                          mt={2}
                          onChange={(e) => handleImageChange(e, index)}
                          border="none"
                        />
                      </Box>
                    </Flex>
                  </Box>
                ))}

                <Box colSpan={3} display="flex" justifyContent="center" mt={4}>
                  <Button
                    onClick={addNewSlide}
                    bg="#C18800"
                    color="white"
                    _hover={{ bg: "#A56A00" }}
                  >
                    Add New Slide
                  </Button>
                </Box>
              </SimpleGrid>
            )}

            {isFullscreen && (
              <HStack
                position="absolute"
                bottom="10px"
                left="0"
                right="0"
                justify="center"
                spacing={3}
              >
                {editedSlides.map((_, index) => (
                  <Box
                    key={index}
                    width="100px"
                    height="8px"
                    bg={currentSlideIndex === index ? "#C18800" : "gray.300"}
                    cursor="pointer"
                    onClick={() => setCurrentSlideIndex(index)}
                    transition="background-color 0.3s ease"
                    borderRadius="8px"
                  />
                ))}
              </HStack>
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
          <HStack position="absolute" top="20px" left="20px" zIndex={10}>
            <Button
              background={"#002329"}
              variant="solid"
              color={"white"}
              paddingX={"20px"}
              onClick={handleGoBack}
            >
              Go Back
            </Button>

            <PPTExport slides={slides} />
          </HStack>
        )}
      </Box>
    </Box>
  );
};

export default GeneratedContentPage;
