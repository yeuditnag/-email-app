import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createEml } from "./createEml.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());
app.use(express.static("out")); // מאפשר גישה לקבצי .eml דרך הדפדפן

app.post("/api/create-eml", upload.single("resume"), async (req, res) => {
  try {
    const { subject, recipients, body } = req.body;
    const toList = recipients.split(",").map((r) => r.trim());

    if (!req.file) {
      return res.status(400).json({ message: "קובץ לא התקבל" });
    }

    const createdFiles = [];

    for (const to of toList) {
      const emlFilename = await createEml({
        to,
        subject,
        body,
        attachment: {
          path: req.file.path,
          originalname: req.file.originalname,
        },
      });

      createdFiles.push(`http://localhost:3001/${emlFilename}`);
    }

    // מחיקת הקובץ המקורי לאחר עיבוד
    fs.unlink(req.file.path, () => {});

    res.json({ links: createdFiles });
  } catch (err) {
    console.error("שגיאה בשרת:", err);
    res.status(500).json({ message: "שגיאה ביצירת הקובץ" });
  }
});

app.listen(3001, () => {
  console.log("✅ Server is running on http://localhost:3001");
});
