// components/ResultCard.tsx

import React from 'react';

interface Result {
  title: string;
  url: string;
  content: string;
  score: number;
  raw_content?: string;
}

interface ResultCardProps {
  result: Result;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  return (
    <>
    <a href={result.url}>
    {result.url}
    <div className="primary-gradient primary-shadow border-gray-800 shadow-md rounded-lg p-6 m-4">
      <h2 className="text-2xl font-bold mb-2 text-white">{result.title}</h2>
      <p className="text-gray-300 mb-2 ">{result.content}</p>
      <p className="text-gray-500 text-sm">Similarity: {result.score}</p>
    </div>
    </a>
    </>
  );
};

export default ResultCard;
