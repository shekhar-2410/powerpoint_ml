import express from "express";
import { generatePreview} from "../controller/previewController.js";

const router = express.Router();

router.post("/generate-preview", generatePreview);

export default router;
