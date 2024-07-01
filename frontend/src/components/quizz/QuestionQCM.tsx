import { useState } from "react";
import type { Answer, Questions } from "@/types/quizz.type";


const QuestionQCM = ({ question, onAnswerSelect }: Questions) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Answer[]>([]);

  const handleAnswerClick = (answer: Answer) => {
    const newSelectedAnswers = selectedAnswers.includes(answer)
      ? selectedAnswers.filter((a) => a !== answer)
      : [...selectedAnswers, answer];

    setSelectedAnswers(newSelectedAnswers);
    onAnswerSelect(newSelectedAnswers);
  };

  return (
    <div>
      <h2>{question.question}</h2>
      {question.answers.map((answer) => (
        <p
          key={answer.response}
          onClick={() => handleAnswerClick(answer)}
          style={{
            cursor: "pointer",
            backgroundColor: selectedAnswers.includes(answer)
              ? "lightblue"
              : "white",
          }}
        >
          {answer.response}
        </p>
      ))}
    </div>
  );
};

export default QuestionQCM;
