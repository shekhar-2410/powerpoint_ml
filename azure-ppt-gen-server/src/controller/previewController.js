import axios from "axios";
import fetchReferenceLinkFromTavily from "../../util/fetchReferenceLinkFromTavily.js";
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const generateImageWithRetry = async (slide, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.post(
        process.env.DALL_E_ENDPOINT,
        {
          prompt: `Generate an image illustrating the key concepts of "${
            slide.title
          }" including "${slide.subsections
            .map((sub) => sub.subtitle)
            .join(", ")}".`,
          n: 1,
          size: "1024x1024",
        },
        {
          headers: {
            "Content-Type": "application/json",
            "api-key": process.env.DALL_E_KEY,
          },
        }
      );
      return response.data.data[0].url;
    } catch (error) {
      console.error(
        `Attempt ${i + 1} failed for "${slide.title}":`,
        error.message
      );
      await delay(3000);
    }
  }
  return null;
};

export const generatePreview = async (req, res) => {
  const { prompt } = req.body;
  const modelName = "o1";

  try {
    const textResponse = await axios.post(
      `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_DEPLOYMENT_NAME}/chat/completions?api-version=${process.env.AZURE_API_VERSION}`,
      {
        messages: [
          {
            role: "user",
            content: `Generate a structured JSON presentation based on the topic: "${prompt}".

            Follow these rules strictly:
            
            - **Presentation Title**: Summarize the topic in 8 words or fewer, max 60 characters. Avoid trailing punctuation.
            - **Slides**: Generate 5 to 7 slides that thoroughly cover the topic.
            - **Each Slide Must Contain**:
            - A clear, informative **slide title**.
            - **Four subsections**:
            - Each must have:
            - **subtitle**
            - **content** (at least 25 words or 100 characters)
            - Include **realistic visuals** and **relevant numerical data**.
            - **One table** per slide:
            - Table should have **2 to 5 columns** and **2 to 4 rows**.
            - Column headers must be relevant to the topic.
            - Return only a **well-formatted JSON** as per the following structure:
            
            {
              "title": "A concise and professional presentation title",
              "slides": [
                {
                  "title": "Slide title here",
                  "subsections": [
                    {"subtitle": "Subtitle 1", 
                    "content": "Detailed explanation for subtitle 1 (min 25 words)", 
                    "numericalData": "Statistical data or percentage"},

                    {"subtitle": "Subtitle 2", 
                    "content": "Detailed explanation for subtitle 2 (min 25 words)", 
                    "numericalData": "Statistical data or percentage"},

                    {"subtitle": "Subtitle 3", 
                    "content": "Detailed explanation for subtitle 3 (min 25 words)", 
                    "numericalData": "Statistical data or percentage"},
                   
                    {"subtitle": "Subtitle 4", 
                    "content": "Detailed explanation for subtitle 4 (min 25 words)", 
                    "numericalData": "Statistical data or percentage"}
                  
                  ],
      "table": {
        "headers": ["Header 1", "Header 2", "Header 3","Header 4"],
        "rows": [
          ["Row1-Col1", "Row1-Col2", "Row1-Col3", "Row1-Col4"],
          ["Row2-Col1", "Row2-Col2", "Row2-Col3", "Row2-Col4"],
          ["Row3-Col1", "Row3-Col2", "Row3-Col3", "Row3-Col4"],
          ["Row4-Col1", "Row4-Col2", "Row4-Col3", "Row4-Col4"]
        
        ]
      }
    },
    ...
  ]
}`,
          },
        ],
        max_completion_tokens: 6000,
        model: modelName,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.AZURE_OPENAI_KEY,
        },
      }
    );

    let slideText;
    // After parsing slideText from GPT:

    try {
      const rawResponse = textResponse.data.choices[0].message.content;
      const jsonMatch = rawResponse.match(/```json([\s\S]*?)```/);
      const jsonString = jsonMatch ? jsonMatch[1].trim() : rawResponse;

      slideText = JSON.parse(jsonString);
    } catch (error) {
      console.error("❌ Failed to parse GPT response:", error.message);
      return res.status(500).json({
        success: false,
        error: "Invalid JSON format from OpenAI response",
        details: error.message,
      });
    }

    // Flatten all slide/subsection combinations
    const referenceLinkPromises = slideText.slides.flatMap((slide) =>
      slide.subsections.map((subsection) =>
        fetchReferenceLinkFromTavily(`${slide.title}  ${subsection.subtitle}`)
      )
    );

    const referenceLinks = await Promise.all(referenceLinkPromises);

    let refIndex = 0;
    const slidesWithReferences = slideText.slides.map((slide) => {
      const updatedSubsections = slide.subsections.map((subsection) => ({
        ...subsection,
        referenceLink:
          referenceLinks[refIndex++] || "https://example.com/placeholder",
      }));

      return {
        ...slide,
        subsections: updatedSubsections,
      };
    });

    // Generate images for each slide
    const imagePromises = slidesWithReferences.map((slide) =>
      generateImageWithRetry(slide)
    );
    const imageUrls = await Promise.all(imagePromises);

    const slidesWithImages = slidesWithReferences.map((slide, index) => ({
      ...slide,
      imageUrl:
        imageUrls[index] ||
        "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
    }));

    // Send a single response with everything
    return res.status(200).json({
      success: true,
      title: slideText.title,
      slides: slidesWithImages,
    });
  } catch (error) {
    console.error("Error generating preview:", error.message);
    return res.status(500).json({
      success: false,
      error: "Failed to generate preview",
      details: error.message,
    });
  }
};
