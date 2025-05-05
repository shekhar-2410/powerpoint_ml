import { tavily } from "@tavily/core";
import dotenv from "dotenv";
dotenv.config();

const client = tavily({
  apiKey: process.env.TAVILY_API_KEY,
});

async function fetchReferenceLinkFromTavily(query) {
  try {
    const response = await client.search(query, {
      search_depth: "basic",
      include_answer: false,
      include_images: false,
      num_results: 5,
    });

    if (response?.results?.length > 0) {
      return response.results[0].url;
    }
    return null;
  } catch (error) {
    console.error("Tavily error:", error.message);
    return null;
  }
}

export default fetchReferenceLinkFromTavily;
