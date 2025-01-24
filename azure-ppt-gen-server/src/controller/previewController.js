import axios from "axios";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms)); // Delay helper function

export const generatePreview = async (req, res) => {
  const { prompt } = req.body;

  try {
    // Step 1: Get Text from GPT in JSON format
    const textResponse = await axios.post(
      process.env.GPT_ENDPOINT,
      {
        messages: [
          {
            role: "user",
            content: `Generate a presentation on the topic "${prompt}" in JSON format. The JSON structure should be:
            {
              "slides": [
                {
                  "title": "Slide Title",
                  "content": "Slide Content"
                },
                ...
              ]
            }`,
          },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.GPT_KEY,
        },
      }
    );

    // Parse the GPT response content as JSON
    let slideText;
    try {
      slideText = JSON.parse(textResponse.data.choices[0].message.content);
    } catch (error) {
      console.error(
        "Failed to parse GPT response as JSON. Raw response:",
        textResponse.data.choices[0].message.content
      );
      return res.status(500).json({
        success: false,
        error: "GPT response is not in valid JSON format",
        rawText: textResponse.data.choices[0].message.content,
      });
    }

    // Step 2: Generate Images for each Slide using DALL-E
    const imageUrls = [];
    for (const slide of slideText.slides) {
      try {
        const imageResponse = await axios.post(
          process.env.DALL_E_ENDPOINT,
          {
            prompt: `Generate an image related to the slide title: "${slide.title}" and content: "${slide.content}"`,
            n: 1, // Generate one image at a time
            size: "1024x1024",
          },
          {
            headers: {
              "Content-Type": "application/json",
              "api-key": process.env.DALL_E_KEY,
            },
          }
        );
        imageUrls.push(imageResponse.data.data[0].url);
        // Add a small delay to avoid hitting rate limits
        await delay(1000);
      } catch (imageError) {
        console.error(
          `Error generating image for slide "${slide.title}":`,
          imageError.message
        );
        imageUrls.push(null); // Push `null` for slides where image generation fails
      }
    }

    // Step 3: Attach Images to Slides
    const slidesWithImages = slideText.slides.map((slide, index) => ({
      ...slide,
      imageUrl: imageUrls[index], // Attach corresponding image URL (or null if failed)
    }));

    // Step 4: Send Response
    res.status(200).json({
      success: true,
      slides: slidesWithImages,
    });
  } catch (error) {
    console.error("Error generating preview:", error.message);
    res.status(500).json({
      success: false,
      error: "Failed to generate preview",
      details: error.message,
    });
  }
};
