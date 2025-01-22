import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import gptRoute from "./src/route/gptRoutes.js";
import dallERoute from "./src/route/dallERoutes.js";
import pptRoute from "./src/route/previewRoutes.js";
dotenv.config();
const PORT = process.env.PORT || 5000;
console.log(process.env.PORT);
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use("/api", gptRoute);
app.use("/api", dallERoute);
app.use("/api", pptRoute);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
