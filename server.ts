import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Gemini AI setup
  const ai = new GoogleGenAI({ 
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  app.use(express.json());

  // API routes go here FIRST
  app.post("/api/dreams/analyze", async (req, res) => {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: "Empty content" });

    try {
      const prompt = `Analyze the following dream description. 
      1. Identify primary emotions.
      2. Provide a deep psychological meaning.
      3. Categorize the dream (e.g., Lucid, Nightmare, Prophetic, Abstract).
      4. Rewrite the dream as a cinematic, evocative story (max 200 words).
      5. Create a highly detailed visual prompt for an AI image generator to capture the dream's core aesthetic (surreal, cinematic).

      Dream: "${content}"`;

      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              emotions: { type: Type.ARRAY, items: { type: Type.STRING } },
              meaning: { type: Type.STRING },
              category: { type: Type.STRING },
              story: { type: Type.STRING },
              visualPrompt: { type: Type.STRING }
            },
            required: ["emotions", "meaning", "category", "story", "visualPrompt"]
          }
        }
      });

      res.json(JSON.parse(result.text || "{}"));
    } catch (error) {
      console.error("Analysis Error:", error);
      res.status(500).json({ error: "Failed to analyze dream" });
    }
  });

  app.post("/api/dreams/visualize", async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "No visual prompt provided" });

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image-preview',
        contents: {
          parts: [{ text: `${prompt}. Surreal art style, ethereal, cinematic lighting, 4k, dreamscape aesthetic.` }],
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9",
            imageSize: "1K"
          }
        }
      });

      let imageUrl = "";
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }

      if (!imageUrl) throw new Error("No image generated");
      res.json({ imageUrl });
    } catch (error) {
      console.error("Visualization Error:", error);
      res.status(500).json({ error: "Failed to generate visual" });
    }
  });

  // Vite Middleware for Dev/Prod
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`DreamScape AI server running on port ${PORT}`);
  });
}

startServer();

