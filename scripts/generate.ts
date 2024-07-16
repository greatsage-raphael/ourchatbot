import { genAI } from '@/scripts/admin';
import endent from 'endent';


const createPrompt = (
    DbSearchResults: string,
    InternetSearchResults: string,
    query: string
  ) => {
      return endent`
        Generate a lecture on ${query} using these audio transcriptions and internet search results below:
        
        ##Audio Transcripts##:
        ${DbSearchResults}

        ##Internet Search Results##:
        ${InternetSearchResults}
     `;
  }

export const GeminiGenerate = async (
    DbSearchResults: string,
    InternetSearchResults: string,
    query: string
) => {
  // Set the system instruction during model initialization
      const model = genAI.getGenerativeModel(
        { 
          model: "gemini-1.5-flash",
          systemInstruction: "You are an expert in generating lectures when given the topic to discuss, audio transcriptions of lectures and internet search results. In the event that no audio transcripts are available use the internet search to generate the lecture. Avoid use of jargon when explaining concepts. stick to easy to understand language",
        });

  const prompt = createPrompt( DbSearchResults, InternetSearchResults, query);

  const result = await model.generateContentStream([prompt]);

  //console.log("Stream", result)

  return result
}
