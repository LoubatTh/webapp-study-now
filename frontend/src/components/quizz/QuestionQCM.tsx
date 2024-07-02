import { useState, useEffect } from "react";
import type { Answer, Questions } from "@/types/quizz.type";
import { getLetterById } from "@/utils/bytetoletter";

const QuestionQCM = ({
  question,
  onAnswerSelect,
  answeredCorrectly,
  isSubmitting
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


  /*
  Cette fonction permet de déterminer la couleur de la bordure de la réponse en fonction de la réponse sélectionnée
  Lorsque qu'on ne sait pas encore si la réponse est bonne ou pas, on affiche une bordure noire si la réponse est sélectionnée
  et une bordure transparente si elle ne l'est pas.
  Lorsqu'on sait si la réponse est bonne ou pas, on affiche une bordure verte si la réponse est bonne et une bordure rouge sinon.
  Dans tous les cas si aucun de ces scénarios n'arrive, alors la bordure est transparente
  */
  const getBorderColor = (answer: Answer) => {
    if (answeredCorrectly === undefined) {
      return selectedAnswers.includes(answer)
        ? "border-black"
        : "border-transparent";
    }
    const isAnswerCorrect = answer.isValid;
    if (selectedAnswers.includes(answer)) {
      return isAnswerCorrect ? "border-green-500" : "border-red-500";
    }
    return "border-transparent";
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
    <div>
      <h2 className="font-medium mb-3">{question.question}</h2>
      {question.answers.map((answer, index) => (
        <p
          className={`border-2 rounded-lg p-1 m-0.5 ${getBorderColor(answer)}`}
          key={answer.response}
          onClick={!isSubmitting ? () => handleAnswerClick(answer) : undefined}
          style={{
            cursor: isSubmitting ? "not-allowed" : "pointer",
          }}
        >
          {getLetterById(index)}. {answer.response}
        </p>
      ))}
    </div>
  );
};

export default QuestionQCM;
