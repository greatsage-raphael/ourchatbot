import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from '@supabase/supabase-js'
import { Dub } from "dub";

export const genAI = new GoogleGenerativeAI("AIzaSyCCnrDaiXhJY6PwrH_RVM9N7hT6uhRzpAw");

export const supabase = createClient("https://eifeyuvbxmsjjtbtbyuk.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpZmV5dXZieG1zamp0YnRieXVrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY3ODc4NjY0NywiZXhwIjoxOTk0MzYyNjQ3fQ.LnuFgfty7CPOwWWor9c5E4oiNNIF_fTAh7KROU3_wHA");

function splitContentIntoChunks(content: string, maxSize: number) {
  const chunks = [];
  let startIndex = 0;

  while (startIndex < content.length) {
      let endIndex = startIndex + maxSize;

      if (endIndex > content.length) {
          endIndex = content.length;
      }

      chunks.push(content.slice(startIndex, endIndex));
      startIndex = endIndex;
  }

  return chunks;
}

export async function embedTranscription(transcription: string) {
  //Measuring the relatedness of text strings
  const MAX_PAYLOAD_SIZE = 10000;
  //Measuring the relatedness of text strings
  const contentChunks = splitContentIntoChunks(transcription, MAX_PAYLOAD_SIZE);
    let allEmbeddings = [];

    for (const chunk of contentChunks) {
        const model = genAI.getGenerativeModel({ model: "embedding-001" });
        const result = await model.embedContent(chunk);
        const embedding = result.embedding;
        allEmbeddings.push(...embedding.values);
    }
    return allEmbeddings;
}