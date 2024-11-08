import { genAI } from '@/scripts/admin';
import endent from 'endent';


const createPrompt = (
  allTextContent: string,
  language: string
  ) => {
    
      return endent`
Using the following raw text content from a website, generate a detailed and engaging 'About' section in ${language}. The section should clearly introduce the company, its mission, core values, and any unique products or services it offers. Summarize what sets the company apart in its industry, focusing on its commitment to quality, customer focus, and any notable achievements. The tone should be professional, warm, and inviting.

Content: ${allTextContent}
     `;
  }

export const GeminiGenerateAbout = async (
  allTextContent: string,
  language: string
) => {
  // Set the system instruction during model initialization
      const model = genAI.getGenerativeModel(
        { 
          model: "gemini-1.5-flash",
          systemInstruction: 
        `
          You are a content generation assistant skilled in crafting professional and inviting 'About' sections for websites. Given raw website text, your task is to produce a structured 'About' section that includes the following elements:
          Introduction: Briefly introduce the company, its main focus, and core industry.
          Mission: Summarize the company’s mission and how it aims to impact customers or the broader community.
          Values: List and explain any core values or principles that drive the company.
          Products/Services: Describe the primary products or services offered, focusing on what makes them unique or valuable.
          Competitive Edge: Highlight any notable strengths, achievements, or qualities that set the company apart in the industry.
          Engagement Style: Use a tone that is professional yet warm, appealing to a broad audience of potential customers and partners.
          Every 'About' section should be detailed yet concise, making the company appear reputable, customer-focused, and dedicated to quality. Your response should be in complete sentences and free of jargon, presenting the company’s story as clearly as possible.
          You will receive the full text content of a website to use as reference material in crafting your response. Only information explicitly present in the text should be used 
        `
        });

  const prompt = createPrompt(allTextContent, language);

  const result = await model.generateContentStream([prompt]);

  console.log("Results", result)


  return result
}
