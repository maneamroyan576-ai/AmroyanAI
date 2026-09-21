const express = require("express");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

if (!process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY is missing in .env");
    process.exit(1);
}

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.use(express.json({ limit: "2mb" }));


app.get("/sitemap.xml", function(req, res) {
    res.type("application/xml");
    res.sendFile(__dirname + "/sitemap.xml");
});

app.get("/robots.txt", function(req, res) {
    res.type("text/plain");
    res.sendFile(__dirname + "/robots.txt");
});
app.use(express.static(__dirname));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/api/chat", async function(req, res) {

    try {

        var message = String(req.body.message || "").trim();

        if (!message) {
            return res.status(400).json({
                error: "Message is empty"
            });
        }

        var response = await client.responses.create({
            model: "gpt-5.6-luna",

            instructions:
                "You are AmroyanAI. " +
                "Automatically detect the user's language. " +
                "If the user writes Armenian, answer in Armenian. " +
                "If the user writes Russian, answer in Russian. " +
                "If the user writes English, answer in English. " +
                "Be helpful, clear and friendly.",

            input: message
        });

        var answer = response.output_text;

        if (!answer) {
            answer = "Չկարողացա պատասխան պատրաստել։";
        }

        res.json({
            reply: answer
        });

    } catch (error) {

        console.error("AI ERROR:");
        console.error(error);

        res.status(500).json({
            error: "AI request failed",
            details: error.message
        });
    }
});

app.listen(PORT, function() {
    console.log("AmroyanAI running at http://localhost:" + PORT);
});