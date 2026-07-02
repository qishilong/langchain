import type { FC } from "react";
import { AIMessage, HumanMessage, ToolMessage } from "langchain";

const Messages: FC = () => {
  const sendMessage = async (content: any[]) => {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: content,
      }),
    });
    return response.json();
  };

  const aiMessage = new AIMessage({
    content: [],
    tool_calls: [
      {
        name: "get_weather",
        args: { location: "San Francisco" },
        id: "call_123",
      },
    ],
  });

  const toolMessage = new ToolMessage({
    content: "Sunny, 72°F",
    tool_call_id: "call_123",
  });

  const hms = new HumanMessage({
    content: "Hello, world!",
  });

  const messages = [
    hms,
    aiMessage, // Model's tool call
    toolMessage, // Tool execution result
  ];

  return (
    <div className=" h-screen">
      <button
        onClick={async () => {
          await sendMessage(messages);
        }}
      >
        发送消息
      </button>
    </div>
  );
};

export default Messages;
