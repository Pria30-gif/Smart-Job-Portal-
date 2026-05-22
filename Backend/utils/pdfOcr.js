import { fromPath } from "pdf2pic";
import Tesseract from "tesseract.js";
import fs from "fs-extra";
import path from "path";


export async function ocrPdf(pdfPath) {
  try {
    // Check if PDF file exists and has content
    if (!fs.existsSync(pdfPath)) {
      throw new Error("PDF file does not exist");
    }

    const stats = fs.statSync(pdfPath);
    if (stats.size === 0) {
      throw new Error("PDF file is empty");
    }

    const tempDir = path.join(process.cwd(), "temp_images");
    await fs.ensureDir(tempDir);

    const converter = fromPath(pdfPath, {
      density: 300,
      savePath: tempDir,
      format: "png",
      width: 2000,
      height: 2000,
    });

    // Convert all pages
    const pages = await converter.bulk(-1);
    let fullText = "";

    for (const page of pages) {
      try {
        const result = await Tesseract.recognize(page.path, "eng");
        fullText += result.data.text + "\n";
      } catch (tesseractError) {
        console.error("Tesseract error for page:", page.path, tesseractError);
        // Continue with other pages
      }
    }

    await fs.remove(tempDir);
    return fullText.trim();
  } catch (error) {
    console.error("OCR Error:", error);
    // Clean up temp dir if it exists
    try {
      await fs.remove(path.join(process.cwd(), "temp_images"));
    } catch (cleanupError) {
      console.error("Cleanup error:", cleanupError);
    }
    throw new Error("OCR processing failed: " + error.message);
  }
}
