// import { Button } from "@chakra-ui/react";
// import pptxgen from "pptxgenjs";
// import PropTypes from "prop-types";
// import placeholderImage from "../assets/generic.png";
// import flower from "../assets/flower.png";
// const PPTExport = ({ slides }) => {
//   const plantIconUrl = flower;

//   const generatePPT = async () => {
//     const pptx = new pptxgen();

//     for (let i = 0; i < slides.length; i++) {
//       const slide = slides[i];
//       const slideData = pptx.addSlide();
//       slideData.background = { fill: "#F4F8FB" };

//       // Styled left panel
//       slideData.addShape(pptx.ShapeType.rect, {
//         x: 0,
//         y: 0,
//         w: "65%",
//         h: "100%",
//         fill: { color: "#E74C3C" },
//       });
//       slideData.addShape(pptx.ShapeType.rect, {
//         x: 0,
//         y: "100%",
//         w: "100%",
//         h: "8%",
//         fill: { color: "#FAC2B6" },
//       });

//       // Slide number in bold
//       slideData.addText(`0${i + 1}`, {
//         x: 0.2,
//         y: 0.5,
//         fontSize: 24,
//         fontFace: "Poppins",
//         bold: true,
//         italic: true,
//         color: "#FFFFFF",
//       });

//       // Title properly aligned
//       slideData.addText(slide.title, {
//         x: 0.2,
//         y: 1.4,
//         fontSize: 27,
//         fontFace: "Poppins",
//         bold: true,
//         color: "#FFFFFF",
//         w: 5,
//         align: "left",
//       });

//       slideData.addText(slide.content, {
//         x: 0.2,
//         y: 2.5,
//         w: 5,
//         h: 2,
//         fontSize: 14,
//         fontFace: "Poppins",
//         color: "#FFFFFF",
//         lineSpacing: 30,
//         align: "left",
//       });

//       // Image inside a circular shape for better aesthetics
//       const imageToUse = slide.imageUrl || placeholderImage;
//       slideData.addImage({
//         path: imageToUse,
//         x: "53%",
//         y: "21%",
//         w: "45%",
//         h: "55%",
//       });

//       slideData.addImage({
//         path: plantIconUrl,
//         x: "83%",
//         y: "80%",
//         w: "18%",
//         h: "25%",
//       });
//     }

//     pptx.writeFile({ fileName: "modern_presentation.pptx" });
//   };

//   return (
//     <Button
//       background={"#002329"}
//       variant="solid"
//       color={"white"}
//       paddingX={"20px"}
//       onClick={generatePPT}
//     >
//       Export to PPT
//     </Button>
//   );
// };

// PPTExport.propTypes = {
//   slides: PropTypes.array.isRequired,
// };

// export default PPTExport;

import { Button } from "@chakra-ui/react";
import pptxgen from "pptxgenjs";
import PropTypes from "prop-types";
import placeholderImage from "../assets/generic.png";
import logo from "../assets/flower.png";

const PPTExport = ({ slides }) => {
  const generatePPT = async () => {
    const pptx = new pptxgen();
    const slidesArray = slides.slides;
    const slideTitle = slides.title;

    if (!Array.isArray(slidesArray) || slidesArray.length === 0) {
      console.warn("No slides data available!");
      return;
    }
    for (let i = 0; i < slidesArray.length; i++) {
      const slide = slidesArray[i];

      const slideData = pptx.addSlide();
      slideData.background = { fill: "#F4F8FB" };

      // Header
      slideData.addText(
        (slideTitle || "CESAR-1 | AURORA Project").toUpperCase(),
        {
          x: 0.1,
          y: 0.4,
          fontSize: 18,
          fontFace: "Roboto",
          color: "#0471E1",
          textTransform: "uppercase",
          w: "40%",
        }
      );

      // Circular TRL & CRI Indicators
      const circleSize = 0.5; // Define size for uniformity

      // TRL Circle
      slideData.addShape(pptx.ShapeType.ellipse, {
        x: "47%",
        y: "2%",
        w: circleSize,
        h: circleSize,
        fill: { color: "#003F80" }, // Dark Blue
      });
      slideData.addText("TRL", {
        x: "47.2%",
        y: "6.9%",
        fontSize: 10,
        fontFace: "Roboto",
        bold: true,
        color: "#FFFFFF",
        textAlign: "center",
      });

      // CRI Circle
      slideData.addShape(pptx.ShapeType.ellipse, {
        x: "53%",
        y: "2%",
        w: circleSize,
        h: circleSize,
        fill: { color: "#003F80" }, // Dark Blue
      });
      slideData.addText("CRI", {
        x: "53.2%",
        y: "6.9%",
        fontSize: 10,
        fontFace: "Roboto",
        bold: true,
        color: "#FFFFFF",
        textAlign: "center",
      });

      // // Blue Ribbon for Section Title
      slideData.addShape(pptx.ShapeType.rect, {
        x: "60%",
        y: "3%",
        w: "17%",
        h: "8%",
        fill: { color: "#0471E1" },
        shadow: {
          type: "outer",
          color: "rgba(0, 0, 0, 0.3)",
          blur: 15,
          offset: 0,
          opacity: 0.5,
        },
      });
      slideData.addText(
        slide.sectionTitle || "Solvent-Based Systems\n- Liquid absorption",
        {
          x: "60.5%",
          y: "6.5%",
          fontSize: 10,
          bold: true,
          color: "#FFFFFF",
        }
      );

      slideData.addShape(pptx.ShapeType.rect, {
        x: "79%",
        y: "2%",
        w: "16%",
        h: "10%",
        fill: { color: "#B0DAF1" },
      });
      slideData.addImage({
        path: logo,
        x: "83.3%",
        y: "2%",
        w: "8%",
        h: "10%",
      });

      // Left panel (Aligned Image & Text Box)
      slideData.addShape(pptx.ShapeType.rect, {
        x: 0.2,
        y: 0.9,
        w: "37%",
        h: "83%",
        fill: { color: "#B0DAF1" },
      });

      slideData.addImage({
        path: slide.imageUrl || placeholderImage,
        x: 0.3,
        y: 1,
        w: "35%",
        h: "30%",
        shadow: { type: "outer", color: "#888888", blur: 5, offset: 3 },
      });

      slideData.addText(slide.title || "Technology Parameters", {
        x: 0.3,
        y: 3,
        fontSize: 16,
        bold: true,
        color: "#002329",
        w: "35%",
      });

      const sectionPositions = [
        { x: "40%", y: 1.1 }, // Top Left (Section 1)
        { x: "68%", y: 1.1 }, // Top Right (Section 2)
        { x: "40%", y: 3.3 }, // Bottom Left (Section 3)
        { x: "68%", y: 3.3 }, // Bottom Right (Section 4)
      ];

      const sectionWidth = "28%";
      const sectionHeight = "10%";

      // Loop through the first 4 subsections and place them in the 2x2 grid layout
      slide.subsections.slice(0, 4).forEach((sub, index) => {
        const pos = sectionPositions[index]; // Get the respective position from the grid

        slideData.addText(sub.subtitle || `Section ${index + 1}`, {
          x: pos.x,
          y: pos.y,
          w: sectionWidth,
          h: sectionHeight,
          fontSize: 13,
          bold: true,
          color: "#0471E1",
        });

        slideData.addText(sub.content || "No content available", {
          x: pos.x,
          y: pos.y + 0.5, // Slightly below the subtitle
          w: sectionWidth,
          h: sectionHeight,
          fontSize: 10,
          color: "#002329",
        });
      });

      // Footer Bar
      slideData.addShape(pptx.ShapeType.rect, {
        x: 0,
        y: "95%",
        w: "100%",
        h: "5%",
        fill: { color: "#003F80" },
      });
    }

    pptx.writeFile({ fileName: "styled_presentation.pptx" });
  };

  return (
    <Button
      background={"#002329"}
      variant="solid"
      color={"white"}
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
