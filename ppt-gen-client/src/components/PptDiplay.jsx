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
  const ppt_data = location.state?.slides;
  const slides = location.state?.slides?.slides || [];
  const slideHeader = location.state?.slides?.title || "Title of the slides";
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [editedSlides, setEditedSlides] = useState(slides);

  const fullscreenContainerRef = useRef(null);

  const currentSlide = editedSlides[currentSlideIndex];

  const handleGoBack = () => navigate("/");

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
  const handleSubsectionChange = (e, slideIndex, subIndex, field) => {
    const updatedSlides = [...editedSlides];
    updatedSlides[slideIndex].subsections[subIndex][field] = e.target.value;
    setEditedSlides(updatedSlides);
  };
  const addNewSlide = () => {
    const newSlide = {
      title: "",
      imageUrl: "",
      subsections: [
        { subtitle: "", content: "" },
        { subtitle: "", content: "" },
        { subtitle: "", content: "" },
        { subtitle: "", content: "" },
      ],
    };
    const updatedSlides = [...editedSlides, newSlide];
    setEditedSlides(updatedSlides);
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 100);
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
              right={4}
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
                flexDirection="column"
                height="100vh"
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                bg="rgba(0, 0, 0, 0.38)"
                color="white"
                padding="24px"
              >
                {/* Slide Header */}
                <Text
                  fontSize="4xl"
                  fontWeight="bold"
                  textAlign="center"
                  mb={6}
                >
                  {slideHeader}
                </Text>

                {/* Split Section */}
                <Box
                  minH="100vh"
                  px={12}
                  py={8}
                  bgGradient="linear(to-r, #0f2027, #203a43, #2c5364)"
                  color="white"
                >
                  <Flex flex="1" gap={12} align="center" justify="center">
                    {/* Left Side */}
                    <Flex
                      flex="1"
                      direction="column"
                      align="center"
                      justify="center"
                    >
                      <Image
                        src={currentSlide.imageUrl || genricimg}
                        alt="Slide"
                        maxH="500px"
                        borderRadius="lg"
                        objectFit="contain"
                        mb={4}
                        mt={-4}
                        boxShadow="0 8px 30px rgba(0, 0, 0, 0.3)"
                      />
                    </Flex>

                    {/* Right Side */}
                    <Flex direction="column" flex="1">
                      <Text
                        fontSize="3xl"
                        fontWeight="bold"
                        mb={6}
                        textAlign="center"
                        color="cyan.300"
                      >
                        {currentSlide.title}
                      </Text>

                      <SimpleGrid columns={2} spacing={8} flex="1">
                        {currentSlide.subsections?.map((sub, idx) => (
                          <Box
                            key={idx}
                            bg="rgba(255, 255, 255, 0.05)"
                            borderRadius="lg"
                            p={6}
                            boxShadow="0 4px 30px rgba(0, 0, 0, 0.1)"
                            border="1px solid rgba(255, 255, 255, 0.2)"
                            backdropFilter="blur(8px)"
                            _hover={{
                              transform: "scale(1.02)",
                              transition: "all 0.3s ease",
                              boxShadow: "0 0 20px rgba(255, 255, 255, 0.1)",
                            }}
                          >
                            <Text fontSize="xl" fontWeight="bold" mb={2}>
                              {sub.subtitle}
                            </Text>
                            <Text fontSize="md" opacity={0.85}>
                              {sub.content}
                            </Text>
                          </Box>
                        ))}
                      </SimpleGrid>
                    </Flex>
                  </Flex>
                </Box>
              </Box>
            ) : (
              <SimpleGrid columns={[1]} p={16} gap={4} mt={4}>
                {editedSlides.map((slide, index) => (
                  <Box
                    key={index}
                    p={4}
                    bg="rgba(18, 17, 17, 0.41)"
                    borderRadius="md"
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

                      {/* Text + Subsections section */}
                      <Box flex="1">
                        {/* Title input */}
                        <Input
                          value={slide.title}
                          onChange={(e) => handleTextChange(e, index, "title")}
                          fontSize="xl"
                          fontWeight="bold"
                          color="cyan.300"
                          border="none"
                          placeholder="Slide Title"
                        />

                        {/* Subsections */}
                        {slide.subsections?.map((sub, subIndex) => (
                          <Box key={subIndex} mt={4}>
                            <Input
                              value={sub.subtitle}
                              onChange={(e) =>
                                handleSubsectionChange(
                                  e,
                                  index,
                                  subIndex,
                                  "subtitle"
                                )
                              }
                              fontSize="md"
                              placeholder="Subtitle"
                              color="#fff"
                              border="1px solid #ccc"
                              bg="transparent"
                            />
                            <Textarea
                              value={sub.content}
                              onChange={(e) =>
                                handleSubsectionChange(
                                  e,
                                  index,
                                  subIndex,
                                  "content"
                                )
                              }
                              fontSize="sm"
                              mt={2}
                              placeholder="Content"
                              color="#fff"
                              border="1px solid #ccc"
                              resize="none"
                            />
                          </Box>
                        ))}

                        {/* Image upload */}
                        <Input
                          type="file"
                          accept="image/*"
                          mt={4}
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
          <HStack
            position="absolute"
            top="20px"
            paddingLeft={"20px"}
            zIndex={10}
          >
            <Button
              background={"#002329"}
              variant="solid"
              color={"white"}
              paddingX={"20px"}
              onClick={handleGoBack}
              ml={"45px"}
            >
              Go Back
            </Button>

            <PPTExport slides={ppt_data} />
            <Text
              fontSize="2xl"
              fontWeight="bold"
              color={"gray.700"}
              textAlign={"center"}
            >
              {slideHeader}
            </Text>
          </HStack>
        )}
      </Box>
    </Box>
  );
};

export default GeneratedContentPage;
