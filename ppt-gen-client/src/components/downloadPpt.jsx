import { Button } from "@chakra-ui/react";
import pptxgen from "pptxgenjs";
import PropTypes from "prop-types";
import placeholderImage from "../assets/generic.png";
import flower from "../assets/flower.png";
const PPTExport = ({ slides }) => {
  const plantIconUrl = flower;

  const generatePPT = async () => {
    const pptx = new pptxgen();

    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      const slideData = pptx.addSlide();
      slideData.background = { fill: "#F4F8FB" };

      // Styled left panel
      slideData.addShape(pptx.ShapeType.rect, {
        x: 0,
        y: 0,
        w: "65%",
        h: "100%",
        fill: { color: "#E74C3C" },
      });
      slideData.addShape(pptx.ShapeType.rect, {
        x: 0,
        y: "100%",
        w: "100%",
        h: "8%",
        fill: { color: "#FAC2B6" },
      });

      // Slide number in bold
      slideData.addText(`0${i + 1}`, {
        x: 0.2,
        y: 0.5,
        fontSize: 24,
        fontFace: "Poppins",
        bold: true,
        italic: true,
        color: "#FFFFFF",
      });

      // Title properly aligned
      slideData.addText(slide.title, {
        x: 0.2,
        y: 1.4,
        fontSize: 30,
        fontFace: "Poppins",
        bold: true,
        color: "#FFFFFF",
        w: 5,
        align: "left",
      });

      slideData.addText(slide.content, {
        x: 0.2,
        y: 2.5,
        w: 5,
        h: 2,
        fontSize: 16,
        fontFace: "Poppins",
        color: "#FFFFFF",
        lineSpacing: 30,
        align: "left",
      });

      // Image inside a circular shape for better aesthetics
      const imageToUse = slide.imageUrl || placeholderImage;
      slideData.addImage({
        path: imageToUse,
        x: "53%",
        y: "21%",
        w: "45%",
        h: "55%",
      });

      slideData.addImage({
        path: plantIconUrl,
        x: "83%",
        y: "80%",
        w: "18%",
        h: "25%",
      });
    }

    pptx.writeFile({ fileName: "modern_presentation.pptx" });
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
