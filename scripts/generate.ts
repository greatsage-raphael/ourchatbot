import { genAI } from '@/scripts/admin';
import endent from 'endent';


//Based on the average speed of speech, there are 150 words in a 1 minute speech.
const wordsPerMinute = 150;


const createPrompt = (
    DbSearchResults: string,
    InternetSearchResults: string,
    query: string,
    language: string,
    time: number
  ) => {
    const wordCount = Math.round(time * wordsPerMinute);

    // Sentences are usually between 15–20 words
    const numberOfSentences = Math.round(wordCount / 15);

    const maxSentencesPerParagraph = 5;

    const numberOfParagraphs = Math.round(numberOfSentences / maxSentencesPerParagraph);


      return endent`
-Avoid using special characters like #, $ , ^. Only use aplhabetic chjaracters because this text will be made into speech
        You are an expert in generating lectures based on a given topic, audio transcriptions of lectures, and internet search results. Your task is to create a lecture that adheres to the following guidelines:

1. **Topic**: ${query}
2. **Language**: ${language}
3. **Length**: Approximately ${wordCount} words (based on a speaking rate of 150 words per minute, for ${time} minutes).
4. **Structure**: The lecture should consist of ${numberOfParagraphs} paragraphs, with each paragraph containing no more than ${maxSentencesPerParagraph} sentences. Each paragraph should cover a specific aspect of the topic as outlined below.

### Instructions:

1. **Introduction**:
   - Paragraph 1: Introduce the topic, providing an overview and its relevance.
   
2. **Main Content**:
   - Paragraph 2: Discuss the key points derived from the audio transcriptions.
   - Paragraph 3: Elaborate on additional insights from the internet search results.
   - Paragraph 4: Integrate both sources to provide a comprehensive understanding of the topic.
   
3. **Conclusion**:
   - Paragraph 5: Summarize the main points and highlight the key takeaways.

### Guidelines:

- Combine the information from the audio transcriptions and internet search results to create a coherent and informative lecture.
- If audio transcriptions are insufficient or unavailable, rely more heavily on the internet search results.
-Avoid using special characters like #, $ , ^. Only use aplhabetic chjaracters because this text will be made into speech
- Avoid using jargon and ensure the language is easy to understand.
- Maintain a logical flow and structure, starting with an introduction, followed by the main content, and concluding with a summary or key takeaways.
- Ensure the lecture is engaging and educational, suitable for an audience that is interested in the topic but may not have specialized knowledge.

### Reference Materials:

## Audio Transcriptions:
${DbSearchResults}

## Internet Search Results:
${InternetSearchResults}

     `;
  }

export const GeminiGenerate = async (
    DbSearchResults: string,
    InternetSearchResults: string,
    query: string,
    language: string,
    time: number
) => {
  // Set the system instruction during model initialization
      const model = genAI.getGenerativeModel(
        { 
          model: "gemini-1.5-flash",
          systemInstruction: "When answering do not under any circumstance use any special character like @, #, $, *. This answer is going to be made into an audio. under no circumstances are you to generate any such sign. you must not forget. you must not forget. You are an expert in generating lectures when given the language, the topic to discuss, audio transcriptions of lectures and internet search results. In the event that no audio transcripts are available use the internet search to generate the lecture. Avoid use of jargon when explaining concepts. stick to easy to understand language. Avoid using special signs like #, $, & as generated answers will be made into speech.",
        });

  const prompt = createPrompt( DbSearchResults, InternetSearchResults, query, language, time);

  const result = await model.generateContentStream([prompt]);

  //console.log("Stream", result)

  return result
}
