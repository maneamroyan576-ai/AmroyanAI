const express = require("express");
const dotenv = require("dotenv");
const OpenAI = require("openai");
const path = require("path");

dotenv.config();

const app = express();
const PORT = 3000;

if (!process.env.OPENAI_API_KEY) {
  console.error("OPENAI_API_KEY is missing in .env");
  process.exit(1);
}

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(express.json({ limit: "2mb" }));
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/api/chat", async (req, res) => {
  try {
    const message = String(req.body?.message || "").trim();

    if (!message) {
      return res.status(400).json({
        ok: false,
        error: "Դատարկ հարցում"
      });
    }

    console.log("USER:", message);

    const response = await client.responses.create({
      model: "gpt-5.6-luna",
      instructions: `
You are AmroyanAI, a friendly educational AI assistant.

IMPORTANT:
- Always answer in the same language as the user.
- Armenian -> Armenian.
- Russian -> Russian.
- English -> English.
- Explain school subjects clearly.
- For homework, explain step by step.
- For history and geography, give accurate structured explanations.
- For projects, help create plans, sections, questions and conclusions.
- Do not unnecessarily make answers extremely long.
- Use headings and bullet points when useful.
`,
      input: message
    });

    const answer =
      response.output_text?.trim() ||
      "Չկարողացա պատասխան պատրաստել։";

    console.log("AI:", answer);

    res.json({
      ok: true,
      reply: answer
    });

  } catch (error) {
    console.error("================================");
    console.error("AMROYAN AI ERROR");
    console.error("MESSAGE:", error?.message);
    console.error("STATUS:", error?.status);
    console.error("CODE:", error?.code);
    console.error("================================");

    res.status(500).json({
      ok: false,
      error: "AI request failed",
      details: error?.message || "Unknown error"
    });
  }
});

app.use("/api", (req, res) => {
  res.status(404).json({
    ok: false,
    error: "API endpoint not found"
  });
});

app.listen(PORT, () => {
  console.log("================================");
  console.log("        AMROYAN AI");
  console.log("================================");
  console.log("Server running:");
  console.log("http://localhost:" + PORT);
  console.log("================================");
});