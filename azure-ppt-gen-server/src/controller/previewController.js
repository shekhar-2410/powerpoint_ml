import axios from "axios";

export const generatePreview = async (req, res) => {
  const { prompt } = req.body;

  try {
    // Get Text from GPT
    const textResponse = await axios.post(
      process.env.GPT_ENDPOINT,
      {
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.GPT_KEY,
        },
      }
    );
    const slideText = textResponse.data.choices[0].message.content;

    // Get Image from DALL-E
    const imageResponse = await axios.post(
      process.env.DALL_E_ENDPOINT,
      {
        prompt: prompt,
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
    const imageUrl = imageResponse.data.data[0].url;

    // Send preview data to client
    res.status(200).json({
      success: true,
      text: slideText,
      imageUrl: imageUrl,
    });
  } catch (error) {
    console.error("Error generating preview:", error.message);
    res.status(500).json({ error: "Failed to generate preview" });
  }
};
