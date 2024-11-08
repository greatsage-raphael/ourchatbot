const { GoogleGenerativeAI, SchemaType }  = require("@google/generative-ai");
const { v4: uuidv4 } = require('uuid');// Import the UUID library
const { createClient } = require('@supabase/supabase-js')
import { genAI, supabase } from '@/scripts/admin';


interface ScrapedData {
  name: string;
  description: string;
  socialLinks: string[];
  phoneNumbers: string[];
  allTextContent: string;
  emails: string[];
  jsonData: any[];
  location: string;
}

interface FAQ {
  faq: string;
  Answer: string;
}

interface SaveChatbotDataParams {
  userId: string;
  scrapedData: ScrapedData;
  language: string;
  about: string;
  faqs: FAQ[],
  chatbotId: string
  selectedColor: string,
}

interface SaveChatbotAboutParams {
  userId: string;
  chatbotId: string;
  about: string;
  aboutId: string;
}

const schema = {
  description: "FAQ list with questions and answers",
  type: SchemaType.ARRAY,
  items: {
    type: SchemaType.OBJECT,
    properties: {
      faq: {
        type: SchemaType.STRING,
        description: "The frequently asked question",
        nullable: false,
      },
      Answer: {
        type: SchemaType.STRING,
        description: "The answer to the FAQ",
        nullable: false,
      },
    },
    required: ["faq", "Answer"],
  },
};

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: schema,
  },
});

export async function generateFAQsFromText(rawText: string, language: string) {
  const result = await model.generateContent(`Extract FAQs from the following content: ${rawText} and generate the output in ${language}.`);
  return JSON.parse(result.response.text());
}

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

export async function embedWebsiteData(transcription: string) {
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


export async function saveChatbotData({
  userId,
  scrapedData,
  language,
  about,
  faqs,
  selectedColor,
  chatbotId
}: SaveChatbotDataParams): Promise<void> {

  try {

    //const aboutEmbeddings = await embedWebsiteData(about)
    const { data, error } = await supabase
      .from('ourchatbot_main')
      .insert([
        {
          userid: userId,
          chat_id: chatbotId,
          name: scrapedData.name,
          description: scrapedData.description,
          language,
          social_links: scrapedData.socialLinks,
          phone_numbers: scrapedData.phoneNumbers,
          emails: scrapedData.emails,
          location: scrapedData.location,
          faqs: faqs,
          color: selectedColor,
          about: about
        },
      ])
      .select();

    if (error) {
      console.error("Supabase Error:", error);
    } else {
      console.log("Saved", data);
    }
  } catch (error) {
    console.error("Unexpected Error:", error);
  }
}


export async function saveAboutData({
  about,
  chatbotId,
  userId,
  aboutId
}: SaveChatbotAboutParams): Promise<void> {

  try {

    const aboutEmbeddings = await embedWebsiteData(about)
    const { data, error } = await supabase
      .from('ourchatbot_about')
      .insert([
        {
          id: aboutId,
          userid: userId,
          chatbotid: chatbotId,
          about: about,
          embedding: aboutEmbeddings
        },
      ])
      .select();

    if (error) {
      console.error("Supabase Error:", error);
    } else {
      console.log("Saved", data);
    }
  } catch (error) {
    console.error("Unexpected Error:", error);
  }
}
