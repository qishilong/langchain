import type { FC } from "react";
import { createAgent } from "langchain";
import { ChatDeepSeek } from "@langchain/deepseek";
import { env } from "@/utils/env";
import { MemorySaver } from "@langchain/langgraph";
import { fetchTextFromUrl } from "@/utils";
import { SYSTEM_PROMPT, CONTENT_PROMPT } from "@/constants/prompts";
import { createDeepAgent } from "deepagents";

const checkpointer = new MemorySaver();

const ChatAgent: FC = async () => {
  const model = new ChatDeepSeek({
    model: "deepseek-v4-flash",
    apiKey: env.DEEPSEEK_API_KEY,
    temperature: 0.5,
    timeout: 60000,
    maxTokens: 25000,
    streaming: true,
  });

  let agentMessagesContent = null;
  let deepAgentMessagesContent = null;

  async function main() {
    const agent = createAgent({
      model,
      tools: [fetchTextFromUrl],
      systemPrompt: SYSTEM_PROMPT,
      checkpointer,
    });

    const deepAgent = createDeepAgent({
      model,
      tools: [fetchTextFromUrl],
      systemPrompt: SYSTEM_PROMPT,
      checkpointer,
    });

    const agentResult = await agent.invoke(
      { messages: [{ role: "user", content: CONTENT_PROMPT }] },
      { configurable: { thread_id: "great-gatsby-lc" } },
    );
    const deepAgentResult = await deepAgent.invoke(
      { messages: [{ role: "user", content: CONTENT_PROMPT }] },
      { configurable: { thread_id: "great-gatsby-da" } },
    );

    console.log(agentResult, "agentMessages");

    const agentMessages = agentResult.messages;
    const deepMessages = deepAgentResult.messages;

    agentMessagesContent = agentMessages[agentMessages.length - 1];
    console.log(agentMessages[agentMessages.length - 1]);
    console.log("\n");

    deepAgentMessagesContent = deepMessages[deepMessages.length - 1];
    console.log(deepMessages[deepMessages.length - 1]);
  }

  await main();

  return (
    <div>
      <div>{JSON.stringify(agentMessagesContent)}</div>
      <div>{JSON.stringify(deepAgentMessagesContent)}</div>
    </div>
  );
};

export default ChatAgent;
