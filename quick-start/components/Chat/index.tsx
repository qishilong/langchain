import type { FC } from "react";
import { createAgent, tool } from "langchain";
import { ChatDeepSeek } from "@langchain/deepseek";
import * as z from "zod";
import { env } from "@/utils/env";

const getWeather = tool((input) => `It's always sunny in ${input.city}!`, {
  name: "get_weather",
  description: "Get the weather for a given city",
  schema: z.object({
    city: z.string().describe("The city to get the weather for"),
  }),
});

const model = new ChatDeepSeek({
  apiKey: env.DEEPSEEK_API_KEY,
  model: "deepseek-v4-flash",
});

const agent = createAgent({
  model,
  tools: [getWeather],
});

const Chat: FC = async () => {
  // const result = await agent.invoke({
  //   messages: [
  //     { role: "user", content: "What's the weather in San Francisco?" },
  //   ],
  // });

  const result = 1;

  return (
    <div className=" h-screen flex items-center justify-center">
      {JSON.stringify(result)}
    </div>
  );
};

export default Chat;
