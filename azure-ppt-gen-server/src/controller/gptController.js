import axios from "axios";

// export const generateText = async (req, res) => {

//   const { prompt } = req.body;
//   try {
//     const response = await axios.post(
//       process.env.GPT_ENDPOINT,
//       {
//         messages: [{ role: "user", content: prompt }],
//         max_tokens: 500,
//         temperature: 0.7,
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           "api-key": process.env.GPT_KEY,
//         },
//       }
//     );

//     const generatedText = response.data.choices[0].message.content;
//     res.status(200).json({ text: generatedText });
//   } catch (error) {
//     console.error("Error generating text:", error.response?.data || error.message);
//     res.status(500).json({ error: "Failed to generate text" });
//   }
// };

export const generateText = async (req, res) => {
  const { prompt } = req.body; // Get prompt from request body
  const modelName = "o1";
  try {
    // Call Azure OpenAI API
    const response = await axios.post(
      `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_DEPLOYMENT_NAME}/chat/completions?api-version=${process.env.AZURE_API_VERSION}`,
      {
        messages: [{ role: "user", content: prompt }],
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

    // Extract response text
    const generatedText = response.data.choices[0].message.content;

    // Send response back to client
    res.status(200).json({ text: generatedText });
  } catch (error) {
    console.error(
      "Error generating text:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to generate text" });
  }
};
