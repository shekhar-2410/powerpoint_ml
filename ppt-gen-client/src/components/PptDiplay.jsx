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

import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { BsFullscreen, BsFullscreenExit } from "react-icons/bs";
import pptbacg from "../assets/geometric-back.jpg";
import genricimg from "../assets/generic.png";
import PPTExport from "./downloadPpt";
import SlideTable from "./SlidesTable";
const GeneratedContentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const ppt_data = location.state?.slides;
  const slides = location.state?.slides?.slides || [];
  console.log(slides);
  const slideHeader = location.state?.slides?.title || "Title of the slides";
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [editedSlides, setEditedSlides] = useState(slides);

  const fullscreenContainerRef = useRef(null);

  const currentSlide = editedSlides[currentSlideIndex] || {};

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

  useEffect(() => {
    const handleKeyDown = (e) => {
      // ArrowRight: Next slide
      if (e.key === "ArrowRight") {
        setCurrentSlideIndex((prev) =>
          Math.min(prev + 1, editedSlides.length - 1)
        );
      }

      // ArrowLeft: Previous slide
      if (e.key === "ArrowLeft") {
        setCurrentSlideIndex((prev) => Math.max(prev - 1, 0));
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [editedSlides.length, currentSlideIndex]);

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
        p={6}
        position="relative"
        minHeight="100vh"
        backgroundImage={`url(${pptbacg})`}
        backgroundSize="cover"
        backgroundPosition="center"
        bg="gray.900"
        color="white"
        overflowY={"hidden"}
        ref={fullscreenContainerRef}
        overflowX={"hidden"}
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
              zIndex={100}
              variant={"outline"}
              _hover={{ bg: "transparent" }}
              fontWeight={"bold"}
              color={"gray.200"}
              borderColor={"gray.500"}
            >
              {isFullscreen ? <BsFullscreenExit /> : <BsFullscreen />}
            </IconButton>

            {!isFullscreen && (
              <Box as="header" width="90%" px={{ base: 4, md: 8 }} mt={-2}>
                <Flex
                  align="center"
                  justify="space-between"
                  direction={{ base: "column", md: "row" }}
                  gap={{ base: 3, md: 6 }}
                >
                  {/* Buttons */}
                  <Flex gap={3} direction={{ base: "column", md: "row" }}>
                    <Button
                      background="gray.200"
                      variant="solid"
                      color="gray.900"
                      px="20px"
                      onClick={handleGoBack}
                      width={{ base: "100%", md: "auto" }}
                    >
                      Go Back
                    </Button>
                    <Box width={{ base: "100%", md: "auto" }}>
                      <PPTExport slides={ppt_data} />
                    </Box>
                  </Flex>

                  {/* Center: Title */}
                  <Box flex="1" textAlign="center">
                    <Text
                      fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
                      fontWeight="bold"
                      color="white"
                      noOfLines={1}
                    >
                      {slideHeader}
                    </Text>
                  </Box>

                  {/* Right: Export */}
                </Flex>
              </Box>
            )}

            {isFullscreen ? (
              <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                bg="gray.900"
                color="white"
                p={6}
                overflow="hidden"
              >
                {/* Centering Wrapper */}
                <Flex
                  direction="column"
                  justify="center"
                  align="center"
                  height="100%"
                  overflow="auto"
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

                  {/* Main Content Area */}
                  <Flex
                    direction={{ base: "column", md: "row" }}
                    gap={6}
                    width="100%"
                    // maxW="1200px"
                  >
                    {/* Left Section */}
                    <Flex
                      direction="column"
                      flex="0"
                      bg="gray.800"
                      p={4}
                      borderRadius="sm"
                      // align="center"
                    >
                      <Image
                        src={currentSlide.imageUrl || genricimg}
                        maxHeight="260px"
                        objectFit="cover"
                        borderRadius="sm"
                        boxShadow="lg"
                      />

                      {currentSlide.table && (
                        <Box mt={-4} overflowY="auto">
                          <SlideTable
                            headers={currentSlide.table.headers}
                            rows={currentSlide.table.rows}
                          />
                        </Box>
                      )}
                    </Flex>

                    {/* Right Section */}
                    <Flex
                      direction="column"
                      flex="1.8"
                      bg="gray.800"
                      p={6}
                      borderRadius="md"
                    >
                      <Text
                        fontSize="2xl"
                        fontWeight="bold"
                        color="cyan.300"
                        mb={4}
                      >
                        {currentSlide.title}
                      </Text>

                      <SimpleGrid columns={{ base: 1, md: 2 }} gap={2}>
                        {currentSlide.subsections?.map((sub, idx) => (
                          <Box
                            key={idx}
                            bg="gray.700"
                            borderRadius="md"
                            p={4}
                            border="1px solid rgba(255, 255, 255, 0.15)"
                            transition="all 0.3s ease"
                            _hover={{
                              transform: "translateY(-4px)",
                              boxShadow: "xl",
                            }}
                          >
                            <Text fontSize="lg" fontWeight="bold" mb={2}>
                              {sub.subtitle}
                            </Text>
                            <Text fontSize="sm" opacity={0.9}>
                              {sub.content}
                            </Text>
                            <Text mt={2} fontSize="xs" color={"cyan.400"}>
                              {sub.numericalData}
                            </Text>
                            {/* link */}
                            {sub?.referenceLink && (
                              <Text
                                fontSize="xs"
                                color="cyan.300"
                                mt={2}
                                as="a"
                                href={sub?.referenceLink}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Reference Link
                              </Text>
                            )}
                          </Box>
                        ))}
                      </SimpleGrid>
                    </Flex>
                  </Flex>
                </Flex>
              </Box>
            ) : (
              <SimpleGrid columns={[1]} p={8} gap={4} mt={-4}>
                {editedSlides.map((slide, index) => (
                  <Box key={index} p={4} bg="gray.700" borderRadius="md">
                    <Flex
                      align="flex-start"
                      gap={6}
                      flexDirection={index % 2 === 0 ? "row" : "row-reverse"}
                      justify="center"
                    >
                      {/* Image + Optional Table (on left) */}
                      <Box width="40%">
                        <Image
                          src={slide.imageUrl || genricimg}
                          alt="Slide Image"
                          width="100%"
                          maxHeight="260px"
                          objectFit="cover"
                          borderRadius="sm"
                          boxShadow="lg"
                        />
                        {slide.table && (
                          <Box overflowX="auto">
                            <SlideTable
                              headers={slide.table.headers}
                              rows={slide.table.rows}
                            />
                          </Box>
                        )}
                      </Box>

                      {/* Text + Subsections (always on right) */}
                      <Box flex="1" maxW="55%">
                        <Input
                          value={slide.title}
                          onChange={(e) => handleTextChange(e, index, "title")}
                          fontSize="xl"
                          fontWeight="bold"
                          color="cyan.300"
                          border="none"
                          placeholder="Slide Title"
                          padding={2}
                        />

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
                              color="cyan.300"
                              bg="gray.900"
                              border="1px solid rgba(255, 255, 255, 0.15)"
                              _placeholder={{ color: "gray.500" }}
                              padding={2}
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
                              color="white"
                              bg="gray.900"
                              border="1px solid rgba(255, 255, 255, 0.15)"
                              _placeholder={{ color: "gray.500" }}
                              resize="none"
                              paddingX={2}
                              paddingY={4}
                            />
                            <Box
                              color="white"
                              bg="gray.900"
                              border="1px solid rgba(255, 255, 255, 0.15)"
                              _placeholder={{ color: "gray.500" }}
                              resize="none"
                              padding={2}
                              borderRadius="sm"
                              mt={"-5.5px"}
                            >
                              <Text fontSize="xs" color={"cyan.400"}>
                                {sub.numericalData}
                              </Text>
                              {/* link */}
                              {sub?.referenceLink && (
                                <Text
                                  fontSize="xs"
                                  color="cyan.300"
                                  as="a"
                                  href={sub?.referenceLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Reference Link
                                </Text>
                              )}
                            </Box>
                          </Box>
                        ))}

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
      </Box>
    </Box>
  );
};

export default GeneratedContentPage;
