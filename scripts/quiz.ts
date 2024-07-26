const { GoogleGenerativeAI, FunctionDeclarationSchemaType }  = require("@google/generative-ai");
const { v4: uuidv4 } = require('uuid');// Import the UUID library
const { createClient } = require('@supabase/supabase-js')
import { genAI, supabase } from '@/scripts/admin';

// Initialize the Gemini model
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: {
      type: FunctionDeclarationSchemaType.ARRAY,
      items: {
        type: FunctionDeclarationSchemaType.OBJECT,
        properties: {
          question: {
            type: FunctionDeclarationSchemaType.STRING,
          },
          options: {
            type: FunctionDeclarationSchemaType.ARRAY,
            items: {
              type: FunctionDeclarationSchemaType.OBJECT,
              properties: {
                index: {
                  type: FunctionDeclarationSchemaType.NUMBER,
                },
                text: {
                  type: FunctionDeclarationSchemaType.STRING,
                },
              },
            },
          },
          answerIndex: {
            type: FunctionDeclarationSchemaType.NUMBER,
          },
          explanation: {
            type: FunctionDeclarationSchemaType.STRING,
          },
        },
      },
    },
  },
});

// Function to generate and save the quiz
export async function generateAndSaveQuiz(lectureText: string, query: string) {
  try {

    const lecture = `
  Based on the following lecture text, generate a quiz with questions, multiple-choice options, the correct answer index, and an explanation for each question:
  ${lectureText}
`;
    const result = await model.generateContent(lecture);
    const quizData = JSON.parse(result.response.text());

    // Debug logging to check the structure of the response
    console.log('Generated Quiz Data:', JSON.stringify(quizData, null, 2));

    const quizSetId = uuidv4(); // Generate a new UUID for the quiz set
    const pageTitle = query;
    const documentUrl = lectureText;
    const userId = uuidv4(); // Use a valid UUID for the user ID

    // Insert quiz set
    const { data: quizSetData, error: quizSetError } = await supabase
      .from('quiz_set')
      .insert([
        {
          id: quizSetId,
          user_id: userId,
          title: pageTitle,
          url: documentUrl,
        },
      ])
      .select();

    if (quizSetError) {
      console.error("Error inserting quiz set:", quizSetError);
      return;
    }

    console.log("Inserted quiz set:", quizSetData);

    // Prepare bulk inserts for quizzes and quiz options
    const quizInserts = [];
    const quizOptionInserts = [];
    for (const quiz of quizData) {
      const quizId = uuidv4(); // Generate a new UUID for each quiz

      quizInserts.push({
        id: quizId,
        quizset_id: quizSetId,
        question: quiz.question,
        answer_index: quiz.answerIndex,
        explanation: quiz.explanation,
      });

      if (Array.isArray(quiz.options)) {
        for (const option of quiz.options) {
          quizOptionInserts.push({
            id: uuidv4(), // Generate a new UUID for each quiz option
            quiz_id: quizId,
            index: option.index,
            text: option.text,
          });
        }
      } else {
        console.warn('Invalid options format for quiz:', quiz);
      }
    }

    // Insert quizzes
    const { data: quizDataInsert, error: quizInsertError } = await supabase
      .from('quiz')
      .insert(quizInserts)
      .select();

    if (quizInsertError) {
      console.error("Error inserting quizzes:", quizInsertError);
      return;
    }

    console.log("Inserted quizzes:", quizDataInsert);

    // Insert quiz options
    const { data: quizOptionDataInsert, error: quizOptionInsertError } = await supabase
      .from('quiz_option')
      .insert(quizOptionInserts)
      .select();

    if (quizOptionInsertError) {
      console.error("Error inserting quiz options:", quizOptionInsertError);
      return;
    }

    console.log("Inserted quiz options:", quizOptionDataInsert);

    console.log("Finished inserting data to DB", quizSetId);

    return quizSetId
  } catch (error) {
    console.error("Error generating and saving quiz:", error);
  }
}

