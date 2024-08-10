const { FunctionDeclarationSchemaType }  = require("@google/generative-ai");
import { genAI, } from '@/scripts/admin';

export async function fetchFlashcards(text: string) {
    console.log("FLASH FUNC RUNNING")
    let model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
              type: FunctionDeclarationSchemaType.ARRAY,
              items: {
                  type: FunctionDeclarationSchemaType.OBJECT,
                  properties: {
                      index: {
                          type: FunctionDeclarationSchemaType.NUMBER,
                      },
                      front: {
                          type: FunctionDeclarationSchemaType.STRING,
                      },
                      back: {
                          type: FunctionDeclarationSchemaType.STRING,
                      },
                  },
              },
          },
      }
  });
  
  let prompt = `Based on the following lecture text, generate five flashcards. Each flashcard should include a question on the front and the corresponding answer on the back.
  Below is the lecture Text:${text}`;
    
    let result = await model.generateContent(prompt);
    console.log("FlashCards: ", result.response.text())
    return JSON.parse(result.response.text());
  };