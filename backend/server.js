import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/calculate", async (req, res) => {
  try {
    const foods = req.body.foods;

    const prompt = `
      You are a calorie calculation assistant.
      For each food, calculate calories and total calories.
      Return JSON like:
      {
        "items": [
          { "food": "", "grams": 0, "calories": 0 }
        ],
        "totalCalories": 0
      }
      Foods: ${JSON.stringify(foods)}
    `;

    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    res.json(JSON.parse(response.choices[0].message.content));

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
