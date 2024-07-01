import { useState } from "react";
import type { Answer } from "@/types/quizz.type";

const QuestionQCM = ({ question }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Answer[]>([]);

  const handleAnswerClick = (answer) => {

    if (selectedAnswers.includes(answer)) {
      setSelectedAnswers(selectedAnswers.filter((a) => a !== answer));
      return;
    }

    setSelectedAnswers([...selectedAnswers, answer]);
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
            backgroundColor: selectedAnswers.includes(answer) ? "lightblue" : "white",
          }}
        >
          {answer.response}
        </p>
      ))}
    </div>
  );
};

export default QuestionQCM;
