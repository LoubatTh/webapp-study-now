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
        : "border-slate-300";
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
    <div className="flex flex-col bg-slate-300/20 rounded-xl p-4 gap-4 w-full max-w-[40rem] md:min-w-[40rem]">
      <h2
        data-testid="qcm-question"
        className="bg-background rounded-xl font-semibold text-lg text-center min-h-40 p-4 break-words overflow-wrap"
      >
        {question.question}
      </h2>
      <div className="grid grid-cols-2 grid-rows-2 gap-4">
        {question.answers.map((answer, index) => (
          <p
            data-testid={`qcm-answer-${index}`}
            className={`flex bg-background rounded-xl p-2 truncate ${getBorderColor(
              answer
            )}`}
            key={index}
            onClick={
              !isSubmitting ? () => handleAnswerClick(answer) : undefined
            }
            style={{
              cursor: isSubmitting ? "not-allowed" : "pointer",
            }}
          >
            <span className="font-bold mr-2">{getLetterById(index)}.</span>{" "}
            {answer.answer}
          </p>
        ))}
      </div>
    </div>
  );
};

export default QuestionQCM;
