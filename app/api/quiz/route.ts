import { z } from "zod";


const schema = z.object({
    quizzes: z.array(
      z.object({
        question: z.string(),
        options: z.array(
          z.object({
            index: z.number(),
            text: z.string(),
          })
        ),
        answerIndex: z.number(),
        explanation: z.string(),
      })
    ),
  });
  
  type Data = z.infer<typeof schema>;
  export type Quiz = Data["quizzes"][number];