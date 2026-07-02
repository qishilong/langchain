import type { FC } from "react";
import {
  createAgent,
  todoListMiddleware,
  tool,
  modelRetryMiddleware,
  toolRetryMiddleware,
  initChatModel,
  createMiddleware,
} from "langchain";
import {
  createFilesystemMiddleware,
  createSubAgentMiddleware,
  StateBackend,
} from "deepagents";
import { ChatDeepSeek } from "@langchain/deepseek";
import * as z from "zod";
import { env } from "@/utils/env";

const deepSeekFlashChat = new ChatDeepSeek({
  model: "deepseek-v4-flash",
  apiKey: env.DEEPSEEK_API_KEY,
});

const deepSeekProChat = new ChatDeepSeek({
  model: "deepseek-v4-pro",
  apiKey: env.DEEPSEEK_API_KEY,
});

const Models: FC = async () => {
  // const search = tool(
  //   ({ query }: { query: string }) => `Search results for: ${query}`,
  //   {
  //     name: "search",
  //     description: "Search for a query and return a short summary.",
  //     schema: z.object({ query: z.string() }),
  //   },
  // );

  // const schema = z.object({
  //   count: z.number(),
  //   logs: z.array(z.string()),
  //   status: z.string().optional(),
  // });

  // console.dir(schema, { depth: null });

  // const backend = new StateBackend();

  // const deepSeekChat = new ChatDeepSeek({
  //   apiKey: env.DEEPSEEK_API_KEY,
  //   model: "deepseek-v4-flash",
  // });

  // const deepSeekChat = initChatModel("deepseek-v4-flash", {
  //   modelProvider: "deepseek",
  //   baseUrl: "https://api.deepseek.com",
  //   apiKey: env.DEEPSEEK_API_KEY,
  // });

  // const agent = createAgent({
  //   model: deepSeekChat,
  //   tools: [search],
  //   middleware: [
  //     createFilesystemMiddleware({ backend }),
  //     todoListMiddleware(),
  //     createSubAgentMiddleware({
  //       defaultModel: deepSeekChat,
  //       defaultTools: [],
  //       subagents: [
  //         {
  //           name: "researcher",
  //           description: "Searches and returns a structured summary.",
  //           systemPrompt:
  //             "Use the search tool to research the question and summarize key points.",
  //           tools: [search],
  //           model: "anthropic:claude-sonnet-4-6",
  //           middleware: [],
  //         },
  //       ],
  //     }),
  //     modelRetryMiddleware({ maxRetries: 3 }),
  //     toolRetryMiddleware({ maxRetries: 3 }),
  //   ],
  //   name: "todo_agent",
  // });

  const dynamicModelSelection = createMiddleware({
    name: "DynamicModelSelection",
    wrapModelCall: async (request, handler) => {
      // Choose model based on conversation complexity
      const messageCount = request.messages.length;

      return handler({
        ...request,
        model: messageCount > 10 ? deepSeekProChat : deepSeekFlashChat,
      });
    },
  });

  const agent = createAgent({
    model: deepSeekFlashChat,
    middleware: [
      dynamicModelSelection,
      todoListMiddleware(),
      modelRetryMiddleware({ maxRetries: 3 }),
      toolRetryMiddleware({ maxRetries: 3 }),
    ],
  });

  // const result = await agent.invoke({
  //   messages: [
  //     {
  //       role: "user",
  //       content: "What is the capital of France?",
  //     },
  //   ],
  // });

  return <div></div>;
};

export default Models;
