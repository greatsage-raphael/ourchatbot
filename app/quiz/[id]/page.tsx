
import { supabase } from '@/scripts/admin';
import { QuizSet } from "../../../components/ui/quiz";
import { Header } from "./components/header";

export default async function QuizsetPage({
  params,
}: {
  params: { id: string };
}) {
  

  const { data } = await supabase
    .from("quiz_set")
    .select(
      `
    url,
    title,
    quizzes:quiz (
      id,
      question,
      answerIndex:answer_index,
      explanation,
      options:quiz_option (
        index,
        text
      )
    )
    `
    )
    .eq("id", params.id)
    .single();

  return (
    <>
      {data ? (
        <div className="space-y-20 text-white">
          <Header title={data.title} url={data.url} />
          <QuizSet quizzes={data.quizzes} />
        </div>
      ) : (
        <div>error</div>
      )}
    </>
  );
}
