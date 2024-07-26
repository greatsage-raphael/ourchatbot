import { getCurrentFormattedDate } from '@/lib/utils';
import { supabase } from '@/scripts/admin';
import { ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';

export const RecentQuizSets = async () => {
    const { data: quizSets, error } = await supabase
      .from("quiz_set")
      .select("id, title, url, created_at")
      .order("created_at", { ascending: false });
  
    if (error) return null;

    const formattedDate = getCurrentFormattedDate();
  
    return (
      <ul role="list" className="divide-y divide-neutral-100">
        {quizSets.map(({ id, title, url, created_at }) => (
          <li key={id} className="relative py-3 hover:bg-neutral-50">
            <div className="px-4">
              <div className="mx-auto flex max-w-4xl justify-between gap-x-6">
                <div className="flex min-w-0 gap-x-4">
                  <div className="min-w-0 flex-auto">
                    <p className="font-semibold leading-6 text-neutral-900">
                      <Link href={`/qs/${id}`}>
                        <span className="absolute inset-x-0 -top-px bottom-0" />
                        {title}
                      </Link>
                    </p>
                    <div className="mt-1 flex items-center truncate space-x-2 text-xs leading-5 text-neutral-500">
                      <p>{new URL(url).hostname}</p>
                      <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                        <circle cx={1} cy={1} r={1} />
                      </svg>
                      <p>{formattedDate}</p>
                    </div>
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
        ))}
      </ul>
    );
  };
  