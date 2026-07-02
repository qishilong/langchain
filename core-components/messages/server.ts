import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();
import express from "express";
import { ChatDeepSeek } from "@langchain/deepseek";
import { createAgent } from 'langchain';


const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());

const model = new ChatDeepSeek({
  model: "deepseek-chat",
  apiKey: process.env.DEEPSEEK_API_KEY,
});

const agent = createAgent({
  model: model,
  middleware: [
  ],
  name: "agent",
});

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: 'Missing "messages" array in request body' });
      return;
    }

    const result = await agent.invoke({
      messages: messages
    });
    res.json(result);
  } catch (error) {
    console.error("API error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
