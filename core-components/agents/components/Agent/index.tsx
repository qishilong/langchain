import type { FC } from "react";
import {
  createAgent,
  todoListMiddleware,
  tool,
  modelRetryMiddleware,
  toolRetryMiddleware,
} from "langchain";
import {
  createFilesystemMiddleware,
  createSubAgentMiddleware,
  StateBackend,
} from "deepagents";
import { ChatDeepSeek } from "@langchain/deepseek";
import * as z from "zod";
import { env } from "@/utils/env";

const Agent: FC = () => {
  const search = tool(
    ({ query }: { query: string }) => `Search results for: ${query}`,
    {
      name: "search",
      description: "Search for a query and return a short summary.",
      schema: z.object({ query: z.string() }),
    },
  );

  const backend = new StateBackend();

  const deepSeekChat = new ChatDeepSeek({
    apiKey: env.DEEPSEEK_API_KEY,
    model: "deepseek-v4-flash",
  });

  const agent = createAgent({
    model: deepSeekChat,
    tools: [search],
    middleware: [
      createFilesystemMiddleware({ backend }),
      todoListMiddleware(),
      createSubAgentMiddleware({
        defaultModel: deepSeekChat,
        defaultTools: [],
        subagents: [
          {
            name: "researcher",
            description: "Searches and returns a structured summary.",
            systemPrompt:
              "Use the search tool to research the question and summarize key points.",
            tools: [search],
            model: "anthropic:claude-sonnet-4-6",
            middleware: [],
          },
        ],
      }),
      modelRetryMiddleware({ maxRetries: 3 }),
      toolRetryMiddleware({ maxRetries: 3 }),
    ],
    name: "todo_agent",
  });

  return <div>Agent</div>;
};

export default Agent;
