import QuestionQCM from "@/components/quizz/QuestionQCM";
import { useAuth } from "@/contexts/AuthContext";
import { fetchApi } from "@/utils/api";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ResponseQuizzPage = () => {
  const { isReady } = useAuth();
  const { quizzId } = useParams();
  const [ quizz, setQuizz ] = useState<any>(null); 
  const [ correctPercentage, setCorrectPercentage ] = useState<number>(0); 
  const [ selectedAnswers, setSelectedAnswers ] = useState<{
      [key: number]: any[];
    }>({});

  useEffect(() => {
    if (!isReady || !quizzId) return;

    const fetchQuiz = async () => {

      const response = await fetchApi("GET", `/quizzes/${quizzId}`);
      const data = await response.data;
      setQuizz(data);

    };

    fetchQuiz();
  }, [isReady, quizzId]);

  const handleAnswerSelect = (qcmId, answers) => {
    setSelectedAnswers((prevSelectedAnswers) => ({
      ...prevSelectedAnswers,
      [qcmId]: answers,
    }));
  };

  const handleSubmit = () => {
    if (!quizz) return;

    const correctAnswers = quizz.qcms.map((qcm) => {

      const userAnswers = selectedAnswers[qcm.id] || [];
      const correctAnswers = qcm.answers.filter((answer) => answer.isValid).map((answer) => answer.response);
      const isCorrect = userAnswers.every((answer) => correctAnswers.includes(answer.response)) && userAnswers.length === correctAnswers.length;

      return {
        question: qcm.question,
        isCorrect,
      };
    });


    const totalQuestions = correctAnswers.length;
    const correctCount = correctAnswers.filter((answer) => answer.isCorrect).length;
    setCorrectPercentage((correctCount / totalQuestions) * 100);

    console.log(correctAnswers);
    console.log(`You got ${correctPercentage}% correct answers.`);
  };

  return (
    <>
      <div className="flex flex-col items-center gap-4">
        {quizz ? (
          <div>
            <h1 className="mx-auto my-4">{quizz.name}</h1>

            {quizz.qcms.map((qcm) => (
              <div key={qcm.id} className=" bg-white drop-shadow-2xl m-3 mb-10 p-3 rounded-lg">
                <QuestionQCM
                  question={qcm}
                  onAnswerSelect={(answers) =>
                    handleAnswerSelect(qcm.id, answers)
                  }
                />
              </div>
            ))}

            <button onClick={handleSubmit}>Valider</button>
            <p>Vous avez eu {correctPercentage}% de bonnes réponses</p>
          </div>
        ) : (
          <p>Chargement...</p>
        )}
      </div>
    </>
  );
};

export default ResponseQuizzPage;
