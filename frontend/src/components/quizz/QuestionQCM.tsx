import { useState } from "react";
import type { Answer, Questions } from "@/types/quizz.type";
import { getLetterById } from "@/utils/bytetoletter";

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
      <h2 className="font-medium mb-3">{question.question}</h2>
      {question.answers.map((answer, index) => (
        <p
          className=""
          key={answer.response}
          onClick={() => handleAnswerClick(answer)}
          style={{
            cursor: "pointer",
            backgroundColor: selectedAnswers.includes(answer)
              ? "lightblue"
              : "transparent",
          }}
        >
          {getLetterById(index)}. {answer.response}
        </p>
      ))}
    </div>
  );
};

export default QuestionQCM;
