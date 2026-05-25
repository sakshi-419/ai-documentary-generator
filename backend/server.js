const express = require("express");
const cors = require("cors");
const axios = require("axios");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.post("/generate", async (req, res) => {
  try {
    const { topic } = req.body;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        // PERMANENT FIX: Dynamically routes to whatever free tier model is active right now
        model: "openrouter/free",
        messages: [
          {
            role: "user",
            content: `
Generate a cinematic documentary script about ${topic}.

Requirements:
- 5 scenes
- emotional narration
- cinematic storytelling
- educational style
- visual directions

Format:

Scene 1:
Narration:
Visual:

Scene 2:
Narration:
Visual:
            `,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const script = response.data.choices[0].message.content;

    res.json({
      success: true,
      script,
    });

  } catch (error) {
    // Better debugging outputs
    console.error("API Error Response:", error.response?.data || error.message);

    res.status(500).json({
      success: false,
      error: "Failed to generate documentary",
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});