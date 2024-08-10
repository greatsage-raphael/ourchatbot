"use client";

import { VoiceProvider, ToolCallHandler, ToolResponse, ToolCall, ToolError} from "@humeai/voice-react";
import Messages from "./Messages";
import Controls from "./Controls";
import StartCall from "./StartCall";
import { ComponentRef, useRef } from "react";
import { useUser } from "@clerk/nextjs";



const handleToolCall: ToolCallHandler = async (
  toolCall: ToolCall
): Promise<ToolResponse | ToolError> => {
  console.log("Tool call received", toolCall);

  if (toolCall.name === 'get_notes_tool') {
    try {
      const args = JSON.parse(toolCall.parameters) as {
        query: string;
      };

      const { user } = useUser();

      const query = args.query

      const searchResponse = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ query, userid: user?.id })
      });
  
  
      if (!searchResponse.ok) {
        throw new Error(searchResponse.statusText);
      }
  
      const results = await searchResponse.json();
  
      const DBsearchResults = results?.map((d: any) => d.content).join("\n\n")

      return {
        type: 'tool_response',
        tool_call_id: toolCall.tool_call_id,
        content: JSON.stringify(DBsearchResults),
      };
  
    } catch (error) {
      return {
        type: 'tool_error',
        tool_call_id: toolCall.tool_call_id,
        error: 'Notes Tool error',
        code: 'notes_tool_error',
        level: 'warn',
        content: 'There was an error with the notes tool',
      };
    }
  } 
  else {
    return {
      type: 'tool_error',
      tool_call_id: toolCall.tool_call_id,
      error: 'Tool not found',
      code: 'tool_not_found',
      level: 'warn',
      content: 'The tool you requested was not found',
    };
  }
};




export default function ClientComponent({
  accessToken,
}: {
  accessToken: string;
}) {
  const timeout = useRef<number | null>(null);
  const ref = useRef<ComponentRef<typeof Messages> | null>(null);
  
  return (
    <div
      className={
        "relative grow flex flex-col mx-auto w-full overflow-hidden h-[0px]"
      }
    >
      <VoiceProvider
        configId={process.env.NEXT_PUBLIC_HUME_CONFIG_ID}
        auth={{ type: "accessToken", value: accessToken }}
        onToolCall={handleToolCall}
        onMessage={() => {
          if (timeout.current) {
            window.clearTimeout(timeout.current);
          }

          timeout.current = window.setTimeout(() => {
            if (ref.current) {
              const scrollHeight = ref.current.scrollHeight;

              ref.current.scrollTo({
                top: scrollHeight,
                behavior: "smooth",
              });
            }
          }, 200);
        }}
      >
        <Messages ref={ref} />
        <Controls />
        <StartCall />
      </VoiceProvider>
    </div>
  );
}
