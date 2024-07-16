"use client";

import { VoiceProvider, ToolCallHandler, ToolResponse, ToolCall, ToolError} from "@humeai/voice-react";
import Messages from "./Messages";
import Controls from "./Controls";
import StartCall from "./StartCall";
import { ComponentRef, useRef } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firestore, storage } from '../../utils/firebaseConfig';
import { v4 as uuidv4 } from 'uuid';
import { FieldValue, addDoc, arrayUnion, collection, doc, setDoc } from 'firebase/firestore';
import { genAI } from '@/scripts/admin';



const handleToolCall: ToolCallHandler = async (
  toolCall: ToolCall
): Promise<ToolResponse | ToolError> => {
  console.log("Tool call received", toolCall);

  if (toolCall.name === 'weather_tool') {
    try {
      const args = JSON.parse(toolCall.parameters) as {
        location: string;
        format: 'fahrenheit' | 'celsius';
      };

      const location = await fetch(
        `https://geocode.maps.co/search?q=${args.location}&api_key=${process.env.NEXT_PUBLIC_GEOCODING_API_KEY}`,
      );

      const locationResults = (await location.json()) as {
        lat: string;
        lon: string;
      }[];

      const { lat, lon } = locationResults[0];

      const pointMetadataEndpoint: string = `https://api.weather.gov/points/${parseFloat(lat).toFixed(3)},${parseFloat(lon).toFixed(3)}`;

      const result = await fetch(pointMetadataEndpoint, {
        method: 'GET',
      });

      const json = (await result.json()) as {
        properties: {
          forecast: string;
        };
      };
      const { properties } = json;
      const { forecast: forecastUrl } = properties;

      const forecastResult = await fetch(forecastUrl);

      const forecastJson = (await forecastResult.json()) as {
        properties: {
          periods: unknown[];
        };
      };
      const forecast = forecastJson.properties.periods;

      return {
        type: 'tool_response',
        tool_call_id: toolCall.tool_call_id,
        content: JSON.stringify(forecast),
      };
    } catch (error) {
      return {
        type: 'tool_error',
        tool_call_id: toolCall.tool_call_id,
        error: 'Weather tool error',
        code: 'weather_tool_error',
        level: 'warn',
        content: 'There was an error with the weather tool',
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
