import { Button } from "@chakra-ui/react";
import pptxgen from "pptxgenjs";
import PropTypes from "prop-types";
import placeholderImage from "../assets/generic.png";
import logo from "../assets/flower.png";

const PPTExport = ({ slides }) => {
  console.log("Slides data:", slides);
  const generatePPT = async () => {
    const pptx = new pptxgen();
    const slidesArray = slides?.slides || [];
    const slideTitle = slides?.title || "CESAR-1 | AURORA Project";
    const sanitizeText = (text) =>
      typeof text === "string" && text.trim().length > 0
        ? text.replace(/[^\p{ASCII}]/gu, "")
        : "";

    const getBase64FromUrl = async (url) => {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } catch (error) {
        console.error("Failed to convert image to base64:", url, error);
        return "";
      }
    };

    if (!Array.isArray(slidesArray) || slidesArray.length === 0) {
      console.warn("No slides data available!");
      return;
    }

    for (let i = 0; i < slidesArray.length; i++) {
      const slide = slidesArray[i];
      const slideData = pptx.addSlide();
      slideData.background = { fill: "#F4F8FB" };

      slideData.addText(sanitizeText(slideTitle.toUpperCase()), {
        x: 0.1,
        y: 0.4,
        fontSize: 18,
        fontFace: "Calibri",
        color: "#0471E1",
        textTransform: "uppercase",
        w: "50%",
      });

      // const circleSize = 0.5;

      // slideData.addShape(pptx.ShapeType.ellipse, {
      //   x: "47%",
      //   y: "2%",
      //   w: circleSize,
      //   h: circleSize,
      //   fill: { color: "#003F80" },
      // });
      // slideData.addText(sanitizeText("TRL"), {
      //   x: "47.4%",
      //   y: "6.9%",
      //   fontSize: 10,
      //   fontFace: "Calibri",
      //   bold: true,
      //   color: "#FFFFFF",
      //   textAlign: "center",
      // });

      // slideData.addShape(pptx.ShapeType.ellipse, {
      //   x: "53%",
      //   y: "2%",
      //   w: circleSize,
      //   h: circleSize,
      //   fill: { color: "#003F80" },
      // });
      // slideData.addText(sanitizeText("CRI"), {
      //   x: "53.4%",
      //   y: "6.9%",
      //   fontSize: 10,
      //   fontFace: "Calibri",
      //   bold: true,
      //   color: "#FFFFFF",
      //   textAlign: "center",
      // });

      // slideData.addShape(pptx.ShapeType.rect, {
      //   x: "60%",
      //   y: "3%",
      //   w: "17%",
      //   h: "8%",
      //   fill: { color: "#0471E1" },
      // });

      // slideData.addText(
      //   sanitizeText(
      //     slide.sectionTitle || "Solvent-Based Systems\n- Liquid absorption"
      //   ),
      //   {
      //     x: "60.5%",
      //     y: "6.5%",
      //     fontSize: 10,
      //     bold: true,
      //     color: "#FFFFFF",
      //     shadow: {
      //       type: "outer",
      //       color: "#888888",
      //       blur: 5,
      //       offset: [0, 6],
      //     },
      //   }
      // );

      slideData.addShape(pptx.ShapeType.rect, {
        x: "79%",
        y: "2%",
        w: "16%",
        h: "10%",
        fill: { color: "#B0DAF1" },
      });

      let logoBase64 = logo;
      if (typeof logo === "string" && !logo.startsWith("data:")) {
        logoBase64 = await getBase64FromUrl(logo);
      }

      if (logoBase64) {
        slideData.addImage({
          data: logoBase64,
          x: "83.3%",
          y: "2%",
          w: "8%",
          h: "10%",
        });
      }

      slideData.addShape(pptx.ShapeType.rect, {
        x: 0.2,
        y: 0.9,
        w: "37%",
        h: "83%",
        fill: { color: "#B0DAF1" },
      });

      const imageUrl = slide.imageUrl || placeholderImage;
      let imageBase64 = imageUrl;
      if (typeof imageUrl === "string" && !imageUrl.startsWith("data:")) {
        imageBase64 = await getBase64FromUrl(imageUrl);
      }

      if (imageBase64) {
        slideData.addImage({
          data: imageBase64,
          x: 0.3,
          y: 1,
          w: "35%",
          h: "30%",
          shadow: {
            type: "outer",
            color: "#888888",
            blur: 5,
            offset: [10, 10],
          },
        });
      }

      slideData.addText(sanitizeText(slide.title || "Technology Parameters"), {
        x: 0.2,
        y: 3,
        fontSize: 16,
        bold: true,
        color: "#002329",
        w: "35%",
      });

      // table
      if (slide.table && slide.table.headers && slide.table.rows) {
        const tableRows = [
          slide.table.headers.map((header) => sanitizeText(header)),
          ...slide.table.rows.map((row) =>
            row.map((cell) => sanitizeText(cell))
          ),
        ];

        slideData.addTable(tableRows, {
          x: 0.3,
          y: 3.3,
          w: 3.4,
          h: 1,
          colW: [0.2, 0.2, 0.5, 0.6, 0.6],
          rowH: 0.2,
          fontSize: 9,
          border: { type: "solid", color: "#0471E1", pt: 1 },
          fill: "F4F8FB",
          color: "002329",
          bold: true,
          align: "center",
          valign: "middle",
          autoPage: false,
        });
      }

      const sectionPositions = [
        { x: "40%", y: 1 },
        { x: "68%", y: 1 },
        { x: "40%", y: 3.3 },
        { x: "68%", y: 3.3 },
      ];

      const sectionWidth = "29%";
      const sectionHeight = "5%";

      (slide.subsections || []).slice(0, 4).forEach((sub, index) => {
        const pos = sectionPositions[index];

        const subtitle = sanitizeText(sub.subtitle || `Section ${index + 1}`);
        const content = sanitizeText(sub.content || "No content available");
        const numericalData = sanitizeText(sub.numericalData || "");
        const referenceLink = sanitizeText(sub.referenceLink || "");

        // Add Subtitle
        slideData.addText(subtitle, {
          x: pos.x,
          y: pos.y,
          w: sectionWidth,
          h: sectionHeight,
          fontSize: 13,
          bold: true,
          color: "#0471E1",
        });

        // Add Content
        slideData.addText(content, {
          x: pos.x,
          y: pos.y + 0.5,
          w: sectionWidth,
          h: "15%",
          fontSize: 10,
          color: "#002329",
        });

        slideData.addText(numericalData, {
          x: pos.x,
          y: pos.y + 1.6,
          w: "30%",
          h: "5%",
          fontSize: 9,
          italic: true,
          color: "#444",
        });

        slideData.addText(
          [
            {
              text: "Reference Link",
              options: {
                hyperlink: {
                  url: referenceLink,
                },
              },
            },
          ],
          {
            x: pos.x,
            y: pos.y + 1.8,
            w: "10%",
            h: "4%",
            fontSize: 9,
            color: "#0471E1",
          }
        );
      });

      slideData.addShape(pptx.ShapeType.rect, {
        x: 0,
        y: "95%",
        w: "100%",
        h: "5%",
        fill: { color: "#003F80" },
      });
    }

    pptx.writeFile({ fileName: slideTitle });
  };

  return (
    <Button
      background={"gray.200"}
      variant="solid"
      color={"gray.900"}
      paddingX={"20px"}
      onClick={generatePPT}
    >
      Export to PPT
    </Button>
  );
};

PPTExport.propTypes = {
  slides: PropTypes.object.isRequired,
};

export default PPTExport;
