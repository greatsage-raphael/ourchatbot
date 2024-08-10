"use client"
import { supabase } from '@/scripts/admin';
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { useEffect, useState } from 'react';

interface QuizSet {
  id: string;
  title: string;
  url: string;
  created_at: string;
}

interface AnalyticsData {
  clicks: number;
  lastAccessed: string;
}

export default function Index() {
  return (
    <>
      <main className="flex-1 flex flex-col gap-16 mt-20">
        <Divider />
        <RecentQuizSets />
      </main>
    </>
  );
}

const Divider = () => (
  <div className="relative">
    <div className="absolute inset-0 flex items-center" aria-hidden="true">
      <div className="primary-gradient primary-shadow border-gray-800 w-full border-t border-neutral-300" />
    </div>
    <div className="relative flex justify-center">
      <span className="primary-gradient primary-shadow border-gray-800 px-4 text-sm text-neutral-500">Recent Generations</span>
    </div>
  </div>
);

const RecentQuizSets = () => {
  const [quizSets, setQuizSets] = useState<QuizSet[]>([]);
  const [analyticsData, setAnalyticsData] = useState<Record<string, AnalyticsData>>({});

  useEffect(() => {
    const fetchQuizSets = async () => {
      const { data: quizSets, error } = await supabase
        .from('quiz_set')
        .select('id, title, url, created_at')
        .order('created_at', { ascending: false });

      if (error || !quizSets) return;

      setQuizSets(quizSets);
    };

    fetchQuizSets();
  }, []);

  if (!quizSets.length) return null;

  return (
    <ul role="list" className="divide-y divide-neutral-100">
      {quizSets.map(({ id, title, url, created_at }) => {
        let hostname = '';
        try {
          hostname = new URL(url).hostname;
        } catch (e) {
          //console.error('Invalid URL:', url);
        }

        const analytics = analyticsData[id]; // Retrieve analytics data for the current quiz

        return (
          <li key={id} className="relative py-3 hover:bg-neutral-50">
            <div className="primary-gradient primary-shadow border-gray-800 px-4">
              <div className="mx-auto flex max-w-4xl justify-between gap-x-6">
                <div className="flex min-w-0 gap-x-4">
                  <div className="min-w-0 flex-auto">
                    <p className="font-semibold leading-6 text-white">
                      <Link href={`/quiz/${id}`}>
                        <span className="text-white absolute inset-x-0 -top-px bottom-0" />
                        {title}
                      </Link>
                    </p>
                    <div className="text-white mt-1 flex items-center truncate space-x-2 text-xs leading-5 text-neutral-500">
                      <p>{hostname}</p>
                      <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                        <circle cx={1} cy={1} r={1} />
                      </svg>
                      <p>{format(new Date(created_at), 'yyyy-MM-dd')}</p>
                    </div>
                    {analytics && (
                      <div className="mt-1 text-xs leading-5 text-neutral-500">
                        <p>{`Clicks: ${analytics.clicks}`}</p>
                        <p>{`Last Accessed: ${analytics.lastAccessed}`}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-x-4">
                  <ChevronRightIcon
                    className="h-5 w-5 flex-none text-neutral-400"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};
