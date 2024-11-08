'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/scripts/admin';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Bot } from 'lucide-react';
import Link from 'next/link';

interface Chatbot {
  id: string;
  chat_id: string;
  userid: string;
  name: string;
  description: string;
}

export default function MyChatbots() {
  const { user } = useUser();
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChatbots = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('ourchatbot_main')
            .select('*')
            .eq('userid', user.id);

          if (error) throw error;

          setChatbots(data || []);
        } catch (err) {
          setError((err as Error).message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchChatbots();
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Chatbots</h1>
        <Link href="/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Create New Chatbot
          </Button>
        </Link>
      </div>
      {chatbots.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {chatbots.map((chatbot) => (
            <Card
              key={chatbot.id}
              className="transition-shadow duration-300 hover:shadow-lg"
            >
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bot className="mr-2 h-5 w-5 text-primary" />
                  {chatbot.name}
                </CardTitle>
                <CardDescription>{chatbot.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={`/chatbot/${chatbot.chat_id}`}>
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Chatbots Found</CardTitle>
            <CardDescription>
              You haven't created any chatbots yet. Click the "Create New
              Chatbot" button to get started.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}
