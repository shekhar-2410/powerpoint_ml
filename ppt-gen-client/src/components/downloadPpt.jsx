import { Button } from "@chakra-ui/react";
import genricimg from "../assets/generic.png"; // Your default image URL or base64 string
import pptxgen from "pptxgenjs";
import PropTypes from "prop-types";

// Helper function to convert image to base64
const getBase64Image = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous"; // To avoid cross-origin issues
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const dataUrl = canvas.toDataURL(); // This will give you the base64 string
      resolve(dataUrl);
    };
    img.onerror = (error) => reject(error);
    img.src = url;
  });
};

const PPTExport = ({ slides }) => {
  const defaultImage = genricimg; // Default image URL or base64 string

  const generatePPT = async () => {
    const pptx = new pptxgen(); // Create an instance of pptxgen

    for (let slide of slides) {
      const slideData = pptx.addSlide();

      // Create a rectangle to simulate the gradient background
      slideData.addShape("rect", {
        x: 0,
        y: 0,
        w: "100%",
        h: "100%",
        fill: { color: "#003366" }, // Solid color to act as base (dark blue)
      });

      // Add a second rectangle on top to simulate the gradient effect
      slideData.addShape("rect", {
        x: 0,
        y: 0,
        w: "100%",
        h: "100%",
        fill: {
          type: "gradient",
          angle: 45,
          stops: [
            { color: "003366", position: 0 }, // Dark blue color
            { color: "006699", position: 1 }, // Lighter blue color
          ],
        },
        opacity: 0.5, // Adjust opacity for blending effect (optional)
      });

      // Add title text with good contrast (white on dark blue)
      slideData.addText(slide.title, {
        x: 1,
        y: 0.5,
        fontSize: 32,
        fontFace: "Arial",
        color: "FFFFFF", // White text for title (now readable against the gradient)
        bold: true,
        shadow: { blur: 6, angle: 45, distance: 3 }, // Adding shadow for better contrast
      });

      // Add content text with a bit of spacing for readability
      slideData.addText(slide.content, {
        x: 1,
        y: 1.5,
        fontSize: 16,
        fontFace: "Arial",
        color: "FFFFFF", // White text for content (now visible with the dark background)
        width: "80%",
        height: 3,
        lineSpacing: 20, // Line spacing to make text less cramped
      });

      // Check if imageUrl exists and is valid, if not use the default image
      let imageUrl = slide.imageUrl || defaultImage;

      if (imageUrl && !imageUrl.startsWith("data:image")) {
        try {
          // Convert URL to base64 if it's a URL and not already base64
          imageUrl = await getBase64Image(imageUrl);
        } catch (error) {
          console.log("Error converting image to base64:", error);
          // If there's an error, you can fallback to the default image
          imageUrl = defaultImage;
        }
      }

      // Determine if image should go on the left or right
      const imagePosition = slide.imagePosition || "left"; // "left" or "right"

      const imageX = imagePosition === "left" ? 0.5 : 5; // Adjust X position based on "left" or "right"
      const imageWidth = imagePosition === "left" ? 4 : 4; // Adjust width to fit well
      const imageHeight = 3; // Fixed height for the image

      // Add image with border and shadow
      slideData.addImage({
        x: imageX,
        y: 2.5,
        w: imageWidth,
        h: imageHeight,
        data: imageUrl, // Image data (base64 or URL)
        border: { color: "FFFFFF", pt: 2 }, // Adding white border around the image for contrast
        shadow: { blur: 6, angle: 45, distance: 3 }, // Shadow effect for better visibility
      });
    }

    pptx.writeFile({ fileName: "presentation.pptx" });
  };

  return (
    <Button
      background={"#002329"} // Dark button background
      variant="solid"
      color={"white"} // White text on button
      paddingX={"20px"}
      onClick={generatePPT}
    >
      Export to PPT
    </Button>
  );
};

PPTExport.propTypes = {
  slides: PropTypes.array.isRequired,
};

export default PPTExport;
