import { GoogleGenerativeAI, FunctionDeclarationSchemaType } from "@google/generative-ai";
import { createClient } from '@supabase/supabase-js'

export const genAI = new GoogleGenerativeAI("AIzaSyCCnrDaiXhJY6PwrH_RVM9N7hT6uhRzpAw");

export const supabase = createClient("https://eifeyuvbxmsjjtbtbyuk.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpZmV5dXZieG1zamp0YnRieXVrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY3ODc4NjY0NywiZXhwIjoxOTk0MzYyNjQ3fQ.LnuFgfty7CPOwWWor9c5E4oiNNIF_fTAh7KROU3_wHA");

export async function embedTranscription(transcription: string) {
  //Measuring the relatedness of text strings
    const model = genAI.getGenerativeModel({ model: "embedding-001"});
    const result = await model.embedContent(transcription);
    const embedding = result.embedding;
    //console.log("VECTORS:", embedding.values);
    return embedding.values
}

export async function transcribeAudio(url: string): Promise<{ TranscriptionReport: string; topic: string | null } | undefined> {
  try {
    const response = await fetch("https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true&topics=true", {
      method: 'POST',
      headers: {
        'Authorization': `Token 5d84f768d0c2c84ec82db8233d9b205b63839356`,  // Replace with your actual API key
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url })
    });

    const data = await response.json();
    const TranscriptionReport = data.results.channels[0].alternatives[0].transcript;

    let topic: string | null = null;
    if (data.results.topics && data.results.topics.segments.length > 0) {
      const firstSegment = data.results.topics.segments[0];
      if (firstSegment.topics && firstSegment.topics.length > 0) {
        topic = firstSegment.topics[0].topic;
      }
    }

    //console.log('Data:', data);
    //console.log('Transcription:', TranscriptionReport);
    //console.log('Topic:', topic);
    return { TranscriptionReport, topic };
  } catch (error) {
    console.error('Error transcribing audio:', error);
    return undefined;
  }
}

type audioUrl = string

export async function textToSpeech(text: string): Promise< audioUrl | undefined> {
  const url = 'https://api.deepgram.com/v1/speak?model=aura-asteria-en';
  const DEEPGRAM_API_KEY = '5d84f768d0c2c84ec82db8233d9b205b63839356'; // Replace with your actual Deepgram API key

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${DEEPGRAM_API_KEY}`,
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    //console.log("AUDIOURL: ", audioUrl)
    return audioUrl
  } catch (error) {
    console.error('Error converting text to speech:', error);
  }
}


export async function fetchFlashcards(text: string) {
  let model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: FunctionDeclarationSchemaType.ARRAY,
        items: {
          type: FunctionDeclarationSchemaType.OBJECT,
          properties: {
            id: { type: FunctionDeclarationSchemaType.NUMBER },
            frontHTML: { type: FunctionDeclarationSchemaType.STRING },
            backHTML: { type: FunctionDeclarationSchemaType.STRING }
          },
        },
      },
    }
  });

  const prompt = `
  Based on the following lecture text, generate flashcards with questions and answers.
  Each flashcard should have the following JSON structure:
  {
    "id": number, 
    "frontHTML": question, 
    "backHTML": answer
  }
  Lecture Text: ${text}
  `;

  
  let result = await model.generateContent(prompt);
  console.log("FlahCards: ", result)
  return JSON.parse(result.response.text());
};
