
import React, { useState, useEffect } from 'react';
import { TriviaQuestion } from '../types';

interface QuestionCardProps {
  question: TriviaQuestion;
  onAnswer: (isCorrect: boolean, answer: string) => void;
  questionNumber: number;
  totalQuestions: number;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onAnswer, questionNumber, totalQuestions }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    setSelectedAnswer(null);
    setIsAnswered(false);
  }, [question]);

  const handleOptionClick = (option: string) => {
    if (isAnswered) return;

    const isCorrect = option === question.correctAnswer;
    setSelectedAnswer(option);
    setIsAnswered(true);
    onAnswer(isCorrect, option);
  };

  const getButtonClass = (option: string) => {
    if (!isAnswered) {
      return "bg-gray-800 border-gray-700 hover:bg-gray-700 hover:border-cyan-500";
    }
    if (option === question.correctAnswer) {
      return "bg-green-600 border-green-500 animate-pulse";
    }
    if (option === selectedAnswer && option !== question.correctAnswer) {
      return "bg-red-600 border-red-500";
    }
    return "bg-gray-800 border-gray-700 opacity-60";
  };


  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 md:p-8 shadow-2xl shadow-cyan-500/10">
      <div className="mb-6">
        <p className="text-cyan-400 font-semibold text-lg">Question {questionNumber} / {totalQuestions}</p>
        <h2 className="text-2xl md:text-3xl font-bold mt-2 leading-tight" dangerouslySetInnerHTML={{ __html: question.question }}></h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(option)}
            disabled={isAnswered}
            className={`w-full p-4 rounded-lg text-left text-lg font-medium border-2 transition-all duration-300 ${getButtonClass(option)} ${!isAnswered ? 'cursor-pointer' : 'cursor-not-allowed'}`}
            dangerouslySetInnerHTML={{ __html: option }}
          >
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
