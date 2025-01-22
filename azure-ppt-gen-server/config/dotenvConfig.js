import dotenv from "dotenv";

dotenv.config();

export const config = {
  DALL_E_ENDPOINT: process.env.DALL_E_ENDPOINT,
  DALL_E_KEY: process.env.DALL_E_KEY,
  GPT_ENDPOINT: process.env.GPT_ENDPOINT,
  GPT_KEY: process.env.GPT_KEY,
};
