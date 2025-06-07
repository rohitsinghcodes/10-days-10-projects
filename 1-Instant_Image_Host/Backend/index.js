import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import uploadRouter from "./uploadRoute.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/upload", uploadRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
