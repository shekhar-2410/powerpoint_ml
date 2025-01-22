import express from "express";
import { generateImage } from "../controller/dallEController.js";

const router = express.Router();

router.post("/generateImge", generateImage);

export default router;
