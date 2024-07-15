import { useState, useEffect } from "react";
import type { Answer, Questions } from "@/types/quizz.type";
import { getLetterById } from "@/utils/bytetoletter";

const QuestionQCM = ({
  question,
  onAnswerSelect,
  answeredCorrectly,
  isSubmitting,
}: Questions) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Answer[]>([]);

  /*
  Lorsque l'utilisateur clique sur une réponse, on vérifie si la réponse est déjà sélectionné ou pas
  pour la sortir du tableau selectedAnswers ou l'ajouter.
  */
  const handleAnswerClick = (answer: Answer) => {
    const newSelectedAnswers = selectedAnswers.includes(answer)
      ? selectedAnswers.filter((a) => a !== answer)
      : [...selectedAnswers, answer];

    setSelectedAnswers(newSelectedAnswers);
    onAnswerSelect(newSelectedAnswers);
  };

  /* Cette fonction permet de déterminer la couleur du background de la réponse en fonction de la réponse sélectionnée
  Lorsque qu'on ne sait pas encore si la réponse est bonne ou pas, on affiche une fond bleu si la réponse est sélectionnée
  ou le fond par défaut si elle ne l'est pas.
  Lorsqu'on sait si la réponse est bonne ou pas, on affiche un fond vert si la réponse est bonne et un fond rouge sinon.
  Dans tous les cas si aucun de ces scénarios n'arrive, alors le fond est gris par défaut.
  */
  const getBorderColor = (answer: Answer) => {
    if (answeredCorrectly === undefined) {
      return selectedAnswers.includes(answer)
        ? "bg-blue-400 text-white"
        : "bg-gray-100";
    }
    const isAnswerCorrect = answer.isValid;
    if (selectedAnswers.includes(answer)) {
      return isAnswerCorrect
        ? "bg-green-400 text-white"
        : "bg-red-400 text-white";
    }
  };

  /*
  Ce UseEffect permet de réinitialiser les réponses sélectionnées lorsque l'utilisateur a déjà répondu à la question
  */
  useEffect(() => {
    if (answeredCorrectly === undefined) {
      setSelectedAnswers([]);
    }
  }, [answeredCorrectly]);

  return (
    <div className="drop-shadow-md">
      <div className="bg-gray-100 rounded-lg p-2 m-0.5 mb-2">
        <h2 className="font-medium text-center">{question.question}</h2>
      </div>
      <div className="grid grid-cols-2 grid-rows-2 gap-1">
        {question.answers.map((answer, index) => (
          <p
            className={`rounded-lg p-1 m-0.5 ${getBorderColor(answer)}`}
            key={index}
            onClick={
              !isSubmitting ? () => handleAnswerClick(answer) : undefined
            }
            style={{
              cursor: isSubmitting ? "not-allowed" : "pointer",
            }}
          >
            {getLetterById(index)}. {answer.answer}
          </p>
        ))}
      </div>
    </div>
  );
};

export default QuestionQCM;
