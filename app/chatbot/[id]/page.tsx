'use client';

import { SetStateAction, useEffect, useState } from 'react';
import { supabase } from '@/scripts/admin';
import Markdown from "react-markdown";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import ChatArea from '@/components/ui/chatArea';
import { CodeBlock } from '@/components/ui/codeDisplay';


interface FAQ {
  faq: string;
  Answer: string;
}

const ChatbotPage = () => {
  const router = useRouter();
  const [about, setAbout] = useState('');
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [userQuestion, setUserQuestion] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [name, setName] = useState('');
  const [language, setLanguage] = useState('');
  const [color, setColor] = useState('');
  const [description, setDescription] = useState('');
  const pathname = usePathname();
  const searchParams = useSearchParams();


  const id = pathname.match(/\/chatbot\/([a-f0-9-]+)/)?.[1];

  const chatbotlink = `<script data-ai-id="${id}" src="https://ourchatbot.vercel.app/widget.js"></script>`

  // useEffect(() => {
  //   const script = document.createElement("script");
  //   script.src = `${window.location.origin}/widget.js`;
  //   script.setAttribute("data-ai-id", `${id}`);
  //   script.async = true;
  //   document.body.appendChild(script);

  //   return () => {
  //     // Clean up the script if necessary
  //     document.body.removeChild(script);
  //   };
  // }, []);

  // Fetch data from Supabase
  useEffect(() => {
    setAbout('');
    setFaqs([]);

    const fetchChatbotData = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from('ourchatbot_main')
        .select('description, faqs, name, language, color, about')
        .eq('chat_id', id)
        .single();

      if (error) {
        console.error('Error fetching chatbot data:', error);
      } else if (data) {
        setDescription(data.description);
        setAbout(data.about);
        setFaqs(data.faqs || []);
        setName(data.name);
        setLanguage(data.language);
        setColor(data.color);
      }
    };

    fetchChatbotData();
  }, [id]);

  const handleFaqClick = (faq: any) => {
    setUserQuestion(faq);
  };

  const systemPrompt = `You are ${name} Chatbot, a friendly and knowledgeable assistant for ${name}. Remember to communicate strictly in ${language}. Your role is to represent the organization in a helpful, courteous, and professional manner, ensuring that users find value in each interaction.

About the Organization
${about}

Your Purpose
As the company’s virtual assistant, you should:

Answer questions accurately and politely, using the FAQ and "About" information as your primary sources.
Provide information with a friendly, helpful tone, always focusing on making the user experience pleasant and informative.
If the user’s question aligns with an FAQ, draw directly from the FAQ responses.
For general or unfamiliar questions, use the "About" information as context to answer in a way that reflects the company’s mission and values.
FAQs
Here are some common questions and answers that should guide your responses:

${faqs}
Tone and Style
Be warm, professional, and approachable. Your goal is to create a positive impression of [Company Name] with each interaction. If you don’t have a precise answer, kindly let users know and guide them on where to find more help if possible.`;

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-100 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold">Description</h2>
            <p>{description}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">About</h2>
            <Markdown>{about}</Markdown>
          </div>
          <div className='h-15 mx-2'>
            <h2 className="text-xl font-semibold">Embedable Link</h2>
            <CodeBlock code={chatbotlink} editable={false} />
          </div>
        </CardContent>
      </Card>

      


      <Card className="mt-6 w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Chat with {name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ChatArea systemPrompt={systemPrompt} color={color} name={name} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatbotPage;
