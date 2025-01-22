import axios from "axios";

export const generateImage = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const response = await axios.post(
      process.env.DALL_E_ENDPOINT,
      {
        prompt: prompt,
        n: 2, // Number of images
        size: "1024x1024", // Image size
      },
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.DALL_E_KEY,
        },
      }
    );

    const imageUrl = response.data.data[0].url;
    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error(
      "Error generating image:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to generate image" });
  }
};
