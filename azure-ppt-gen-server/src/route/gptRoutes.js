import express from "express";
import { generateText } from "../controller/gptController.js";

const router = express.Router();

router.post("/generateText", generateText);

export default router;
