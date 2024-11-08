import { GoogleGenerativeAI } from '@google/generative-ai';
import Markdown from 'react-markdown';
import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { Send, Trash } from 'lucide-react';
import Image from 'next/image';
import { genAI } from '@/scripts/admin';
import { currentUser, useUser } from '@clerk/nextjs';


interface Message {
  role: 'model' | 'user';
  parts: string;
}

interface ChatAreaProps {
  systemPrompt: string | null;
  color: string | null;
  name: string | null;
}

const ChatArea = ({ systemPrompt, color, name}: ChatAreaProps) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [history, setHistory] = useState<Message[]>([]);
  const [chat, setChat] = useState<any>(null);
  const [isChatReady, setIsChatReady] = useState(false); // New loading state
  const { user } = useUser();
  

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history]);

  useEffect(() => {
    if (systemPrompt && color && name && !chat) {
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction: systemPrompt,
      });

      setChat(
        model.startChat({
          generationConfig: {
            maxOutputTokens: 400,
          },
        }),
      );
      setIsChatReady(true); // Chat is ready once model is initialized
    }
  }, [systemPrompt, color, name, chat]);

  async function chatting() {
    if (!isChatReady) return; // Only proceed if chat is ready
    setLoading(true);
    setHistory((oldHistory) => [
      ...oldHistory,
      { role: 'user', parts: input },
      { role: 'model', parts: 'Thinking...' },
    ]);
    setInput('');

    try {
      const result = await chat.sendMessage(input);
      const response = await result.response;
      const text = await response.text();

      setLoading(false);
      setHistory((oldHistory) => {
        const newHistory = oldHistory.slice(0, oldHistory.length - 1);
        newHistory.push({ role: 'model', parts: text });
        return newHistory;
      });
    } catch (error) {
      setHistory((oldHistory) => {
        const newHistory = oldHistory.slice(0, oldHistory.length - 1);
        newHistory.push({
          role: 'model',
          parts: 'Oops! Something went wrong.',
        });
        return newHistory;
      });
      setLoading(false);
      console.error(error);
      alert('Oops! Something went wrong.');
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter') {
      chatting();
    }
  }

  function reset() {
    setHistory([
      {
        role: 'model',
        parts: `Hi, I'm a chat bot for ${name}`,
      },
    ]);
    setInput('');
    setChat(null);
    setIsChatReady(false);
  }

  if (!systemPrompt || !color || !name) {
    return <div>Loading chat...</div>; // Show loading if props aren't ready
  }



  return (
    <div className="min-h-dvh relative flex max-h-screen w-full max-w-3xl justify-center rounded-t-3xl bg-gray-200 px-2 pt-6 shadow shadow-slate-900">
      <div className="flex w-full flex-1 flex-grow flex-col overflow-y-auto rounded-3xl pb-16 pt-10 text-sm shadow-md md:text-base">
        {history.map((item, index) => (
          <div
            key={index}
            className={`chat ${
              item.role === 'model' ? 'chat-start' : 'chat-end'
            }`}
          >
            <div className="chat-image avatar">
              <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full md:h-10 md:w-10">
                <Image
                  alt="o"
                  src={item.role === 'model' ? '/bot.png' : '/user.png'}
                  width={32} // Smaller width
                  height={32} // Smaller height
                  className="object-cover" // Optional: To ensure the image covers the div
                />
              </div>
            </div>
            <div className="chat-header mx-2 font-semibold opacity-80">
              {item.role === 'model' ? 'Gemini' : 'You'}
            </div>
            <div
              className={`chat-bubble font-medium ${
                item.role === 'model' ? 'chat-bubble-primary' : ''
              }`}
            >
              <Markdown>{item.parts}</Markdown>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="absolute bottom-2 flex w-full gap-1 px-2">
        <button
          className="btn btn-outline btn-error rounded-3xl shadow-md backdrop-blur"
          title="Reset"
          onClick={reset}
        >
          <Trash />
        </button>
        <textarea
          value={input}
          required
          rows={1}
          onKeyDown={handleKeyDown}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Start Chatting..."
          className="textarea textarea-primary mx-auto w-full rounded-3xl bg-opacity-60 font-medium shadow backdrop-blur"
        />
        <button
          className={`btn rounded-3xl shadow-md ${
            loading
              ? 'btn-accent pointer-events-none cursor-wait'
              : 'btn-primary'
          }`}
          title="Send"
          onClick={chatting}
        >
          {loading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            <Send />
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatArea;
