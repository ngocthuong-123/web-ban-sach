import type { NextApiRequest, NextApiResponse } from "next";
import sharp from "sharp";
import fetch from "node-fetch"; // install node-fetch@2 for CommonJS

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { url, w } = req.query;

    if (!url || typeof url !== "string") {
      return res.status(400).send("Missing image URL");
    }

    const width = parseInt(w as string) || 300;

    // Fetch ảnh gốc
    const response = await fetch(url);
    if (!response.ok) throw new Error("Cannot fetch source image");

    const buffer = await response.buffer();

    // Resize ảnh với Sharp
    const resizedImage = await sharp(buffer)
      .resize({ width })
      .jpeg({ quality: 75 }) // bạn có thể đổi sang .webp()
      .toBuffer();

    // Set header ảnh
    res.setHeader("Content-Type", "image/jpeg");
    res.setHeader("Cache-Control", "public, max-age=86400");
    return res.send(resizedImage);
  } catch (error) {
    console.error("Image proxy error:", error);
    return res.status(500).send("Image proxy failed.");
  }
}
