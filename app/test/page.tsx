"use client"
import React from 'react';
import { FlashcardArray } from 'react-quizlet-flashcard';

const cards = [
  {
    id: 1,
    front: "What is the capital of <u>Alaska</u>?",
    back: "Juneau",
    frontChild: <div>Hello there</div>,
    backChild: <p>This is a back child</p>,
  },
  {
    id: 2,
    front: "What is the capital of California?",
    back: "Sacramento",
  },
  {
    id: 3,
    front: "What is the capital of New York?",
    back: "Albany",
  },
  {
    id: 4,
    front: "What is the capital of Florida?",
    back: "Tallahassee",
  },
  {
    id: 5,
    front: "What is the capital of Texas?",
    back: "Austin",
  },
  {
    id: 6,
    front: "What is the capital of New Mexico?",
    back: "Santa Fe",
  },
  {
    id: 7,
    front: "What is the capital of Arizona?",
    back: "Phoenix",
  },
];

const newCards = [
  {
      "front": "What is a defining characteristic of relational databases?",
      "id": 1.2345678901234567
  },
  {
      "front": "How are relationships established between tables in a relational database?",
      "id": 2.234567890123457
  },
  {
      "front": "What are some advantages of using a relational database for data management?",
      "id": 3.234567890123457
  },
  {
      "front": "What is SQL and why is it important in the context of relational databases?",
      "id": 4.234567890123457
  },
  {
      "front": "How do relational databases facilitate data analysis?",
      "id": 5.234567890123457
  },
  {
      "front": "What is a foreign key in the context of relational databases?",
      "id": 6.234567890123457
  },
  {
      "front": "Why is the ability to update data without disrupting applications important?",
      "id": 7.234567890123457
  },
  {
      "front": "How do relational databases contribute to data-driven decision-making?",
      "id": 8.234567890123456
  },
  {
      "front": "What makes relational databases a robust platform for data management?",
      "id": 9.234567890123456
  },
  {
      "front": "Can you name some practical applications of relational databases?",
      "id": 10.234567890123456
  }
]
const primaryGradient = {
  background: 'linear-gradient(267deg, #4402d2 -9.43%, #040218 -9.42%, rgba(63, 17, 100, 0.94) 4.63%, rgba(14, 14, 18, 0.82) 127.55%)',
};

const primaryShadow = {
  boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
};

const cardStyle = {
  ...primaryGradient,
  ...primaryShadow,
  color: 'white',
  borderColor: '#1F2937', // border-gray-800 equivalent
};

const transformedCards = newCards.map(card => ({
  id: card.id,
  frontHTML: card.frontChild ? card.frontChild : card.front,
  backHTML: card.backChild ? card.backChild : card.back,
  frontCardStyle: cardStyle,
  backCardStyle: cardStyle,
}));

function App() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <FlashcardArray 
        cards={transformedCards} 
        FlashcardArrayStyle={cardStyle}
        controls={true}
        frontCardStyle={cardStyle}
        frontContentStyle={cardStyle}
        backCardStyle={cardStyle}
        backContentStyle={cardStyle}
      />
      <style>
        {`
          .flashcard-control-button {
            color: white !important;
          }
        `}
      </style>
    </div>
  );
}

export default App;
