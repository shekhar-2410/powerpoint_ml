// import axios from "axios";

// const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms)); // Delay helper function

// // Function to generate image with retry logic
// const generateImageWithRetry = async (slide, retries = 3) => {
//   for (let i = 0; i < retries; i++) {
//     try {
//       const response = await axios.post(
//         process.env.DALL_E_ENDPOINT,
//         {
//           prompt: `Generate an image illustrating the concept of "${slide.title}"`,
//           n: 1,
//           size: "1024x1024",
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             "api-key": process.env.DALL_E_KEY,
//           },
//         }
//       );
//       return response.data.data[0].url;
//     } catch (error) {
//       console.error(
//         `Attempt ${i + 1} failed for "${slide.title}":`,
//         error.message
//       );
//       await delay(3000); // Wait before retrying
//     }
//   }
//   return null; // Return null if all retries fail
// };

// export const generatePreview = async (req, res) => {
//   const { prompt } = req.body;
//   const modelName = "o1"; // Make sure this matches your Azure deployment name

//   try {
//     // Step 1: Get Text from Azure OpenAI in JSON format
//     const textResponse = await axios.post(
//       `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_DEPLOYMENT_NAME}/chat/completions?api-version=${process.env.AZURE_API_VERSION}`,
//       {
//         messages: [
//           {
//             role: "user",
//             content: `Generate a presentation on the topic "${prompt}" in JSON format. The JSON structure should be:
//             {
//               "slides": [
//                 {
//                   "title": "Slide Title",
//                   "content": "Slide Content"
//                 },
//                 ...
//               ]
//             }`,
//           },
//         ],
//         max_completion_tokens: 40000, // Ensure correct token limit
//         model: modelName, // Use the correct deployment name
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           "api-key": process.env.AZURE_OPENAI_KEY,
//         },
//       }
//     );

//     // Parse the GPT response content as JSON
//     let slideText;
//     try {
//       slideText = JSON.parse(textResponse.data.choices[0].message.content);
//     } catch (error) {
//       console.error(
//         "Failed to parse GPT response as JSON. Raw response:",
//         textResponse.data.choices[0].message.content
//       );
//       return res.status(500).json({
//         success: false,
//         error: "GPT response is not in valid JSON format",
//         rawText: textResponse.data.choices[0].message.content,
//       });
//     }

//     // Step 2: Generate Images for each Slide using DALL-E with retries
//     const imagePromises = slideText.slides.map((slide) =>
//       generateImageWithRetry(slide)
//     );
//     const imageUrls = await Promise.all(imagePromises); // Run image generation in parallel

//     // Step 3: Attach Images to Slides
//     const slidesWithImages = slideText.slides.map((slide, index) => ({
//       ...slide,
//       imageUrl: imageUrls[index], // Attach corresponding image URL (or null if failed)
//     }));

//     // Step 4: Send Response
//     res.status(200).json({
//       success: true,
//       slides: slidesWithImages,
//     });
//   } catch (error) {
//     console.error("Error generating preview:", error.message);
//     res.status(500).json({
//       success: false,
//       error: "Failed to generate preview",
//       details: error.message,
//     });
//   }
// };

import axios from "axios";

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
        
            - Create a professional and concise title instead of just copying the prompt.
            - Ensure the slides cover key aspects of the topic.
            - Format the JSON output as follows:
        
            {
              "title": "A well-structured title summarizing the topic",
              "slides": [
                {
                  "title": "A well-structured title summarizing the subsections",
                  "subsections": [
                    {"subtitle": "Subtitle 1", "content": "Detailed explanation for subtitle 1"},
                    {"subtitle": "Subtitle 2", "content": "Detailed explanation for subtitle 2"},
                    {"subtitle": "Subtitle 3", "content": "Detailed explanation for subtitle 3"},
                    {"subtitle": "Subtitle 4", "content": "Detailed explanation for subtitle 4"}
                  ]
                },
                ...
              ]
            }`,
          },
        ],
        max_completion_tokens: 40000,
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
    try {
      const rawResponse = textResponse.data.choices[0].message.content;
      const jsonMatch = rawResponse.match(/```json([\s\S]*?)```/);
      const jsonString = jsonMatch ? jsonMatch[1].trim() : rawResponse;
      slideText = JSON.parse(jsonString);
    } catch (error) {
      console.error(
        "Failed to parse GPT response:",
        textResponse.data.choices[0].message.content
      );
      return res
        .status(500)
        .json({ success: false, error: "Invalid JSON format" });
    }

    // Generate images for each slide
    const imagePromises = slideText.slides.map((slide) =>
      generateImageWithRetry(slide)
    );
    const imageUrls = await Promise.all(imagePromises);

    // Attach images to slides
    const slidesWithImages = slideText.slides.map((slide, index) => ({
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
