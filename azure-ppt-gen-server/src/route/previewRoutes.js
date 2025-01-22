import express from "express";
import { generatePreview} from "../controller/previewController.js";

const router = express.Router();

router.post("/generate-ppt", generatePreview);

export default router;
