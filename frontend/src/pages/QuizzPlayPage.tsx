import { ResourceForbidden } from "@/components/errors/ResourceForbidden";
import ResourceNotFound from "@/components/errors/ResourceNotFound";
import QuestionQCM from "@/components/quizz/QuestionQCM";
import HelpBox from "@/components/tools/HelpBox";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { answerSchema } from "@/lib/form/answer.form";
import useStore from "@/lib/stores/resultStore";
import { fetchApi } from "@/utils/api";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const getQuizz = async (quizzId: string, accessToken?: string) => {
  const response = await fetchApi(
    "GET",
    `quizzes/${quizzId}`,
    null,
    accessToken
  );
  return response;
};

const postResult = async (body: any, accessToken: string) => {
  const response = await fetchApi("POST", `quizzes/results`, body, accessToken);
  return response;
};

const QuizzPlayPage = () => {
  const navigate = useNavigate();
  const { setScore, setMaxScore } = useStore();
  // Permet de s'assurer que aucune action nécessitant l'authentification ne soit effectuée avant que le système soit initialisé
  const { isReady, accessToken } = useAuth();
  // Permet de récupérer l'identifiant du quizz passé en paramètre dans l'URL
  const { quizzId } = useParams();
  //  Permet de stocker le quizz récupéré depuis l'API
  const [quizz, setQuizz] = useState<any>(null);
  // Permet de stocker les réponses sélectionnées par l'utilisateur
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: any[];
  }>({});
  // Permet de stocker les erreurs pour chaque question
  const [errors, setErrors] = useState<{ [key: number]: string }>({});
  // Permet de stocker les réponses correctes pour chaque question
  const [answeredCorrectly, setAnsweredCorrectly] = useState<{
    [key: number]: boolean;
  }>({});
  // Permet de savoir si ce quizz est privé
  const [isForbidden, setIsForbidden] = useState<boolean>(false);
  // Permet de savoir si ce quizz existe ou pas
  const [isNotFound, setIsNotFound] = useState<boolean>(false);
  // Permet de stocker l'état de la soumission du formulaire
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [finalScore, setFinalScore] = useState<number>(0);
  const [isQuizzOver, setIsQuizzOver] = useState<boolean>(false);

  /*
  Cette méthode permet de stocker les réponses sélectionnés par l'utilisateur dans le state selectedAnswers
  et de réinitialiser les erreurs pour la question correspondante
  */
  const handleAnswerSelect = (qcmId, answers) => {
    setSelectedAnswers((prevSelectedAnswers) => ({
      ...prevSelectedAnswers,
      [qcmId]: answers,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [qcmId]: "",
    }));
  };

  /*
  Cette méthode permet de calculer le pourcentage de bonnes réponses de l'utilisateur
  */
  const calcFinalResult = (correctAnswers) => {
    const totalCorrestResponses = correctAnswers.filter(
      (answer) => answer.isCorrect
    ).length;
    setFinalScore(totalCorrestResponses);
  };

  /*
  Cette méthode permet de valider les réponses de l'utilisateur
  */
  const handleSubmit = () => {
    // Si le quizz n'est pas encore chargé, on arrête le processus
    if (!quizz) return;

    // On initialise 2 tableaux pour stocker les erreurs et les réponses correctes.
    const newErrors = {};
    const newAnsweredCorrectly = {};
    let allAnswered = true;

    // On parcourt ensuite toutes les questions de chaque QCM pour d'abord parser les réponses dans le formulaire Zod
    // et vérifier si elles sont valides (minimum une réponse sélectionnée)
    quizz.qcms.forEach((qcm) => {
      const result = answerSchema.safeParse({
        answers: selectedAnswers[qcm.id] || [],
      });

      // Si une réponse n'est pas valide, on ajoute une erreur pour la question correspondante et on passe à la suivante.
      if (!result.success) {
        newErrors[qcm.id] = result.error.errors[0].message;
        allAnswered = false;
      }
    });

    // Si 1 >= réponse n'est pas valide, on arrête le processus et on affiche les erreurs.
    if (!allAnswered) {
      setErrors(newErrors);
      return;
    }

    // à partir de la, on sait pertinemment que chaque réponse est valide.
    const correctAnswers = quizz.qcms.map((qcm) => {
      //On récupère toutes les réponses sélectionnées par l'utilisateur pour chaque question
      const userAnswers = selectedAnswers[qcm.id] || [];

      // Puis on parcours la liste et on stock dans une variables toutes les réponses VALIDES de la question (il peut y en avoir qu'une seule !)
      const correctAnswers = qcm.answers
        .filter((answer) => answer.isValid)
        .map((answer) => answer.answer);

      // puis on parcours ensuite les réponses de l'utilisateur qu'on va comparer avec les réponses correctes
      const isCorrect =
        userAnswers.every((answer) => correctAnswers.includes(answer.answer)) &&
        userAnswers.length === correctAnswers.length;

      newAnsweredCorrectly[qcm.id] = isCorrect;
      return {
        question: qcm.question,
        isCorrect,
      };
    });

    calcFinalResult(correctAnswers);
    setAnsweredCorrectly(newAnsweredCorrectly);
    setIsSubmitting(true);
    setIsQuizzOver(true);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleResult = () => {
    if (accessToken) {
      postResultToApi();
    } else {
      setScore(finalScore);
      setMaxScore(quizz.qcms.length);
      navigate(`/quizz/${quizzId}/result`);
    }
  };

  const postResultToApi = async () => {
    if (!quizzId) {
      console.error("Deck ID is required");
      navigate("/");
      return;
    }
    if (!accessToken) {
      console.error("Access token is required");
      return;
    }

    const body = {
      quiz_id: parseInt(quizzId),
      grade: finalScore,
      max_grade: quizz.qcms.length,
    };

    const response = await postResult(body, accessToken);
    if (response.status === 201) {
      navigate(`/quizz/${quizzId}/result`);
    } else {
      console.error("Failed to post result:", response);
    }
  };

  const fetchQuiz = async () => {
    if (!quizzId) {
      console.error("Quizz ID is required");
      return;
    }

    let response: any;
    if (accessToken) {
      response = await getQuizz(quizzId, accessToken);
    } else {
      response = await getQuizz(quizzId);
    }
    const status = await response.status;

    // Si la requête est bien effectué, on stocke le quizz dans le state quizz
    if (status == 200) {
      const data = await response.data;
      setQuizz(data);
    }

    // Si le quizz est privé, on stocke la variable isForbidden à true
    if (status == 403) {
      setIsForbidden(true);
    }

    // Si le quizz n'existe pas, on stocke la variable isNotFound à true
    if (status == 404 || status == 500) {
      setIsNotFound(true);
    }
  };

  /*
  Ce UseEffect permet de premièrement vérifier si l'utilisateur est prêt à 
  utiliser l'application (en attendant que le AuthContext soit initialisé)
  Puis ensuite de récupérer le quizz correspondant à l'identifiant passé en paramètre et le stocker dans le state quizz
  */
  useEffect(() => {
    if (!isReady || !quizzId) return;

    setQuizz(null);
    setIsForbidden(false);
    setIsNotFound(false);
    fetchQuiz();
  }, [isReady, quizzId]);

  if (isNotFound) {
    return <ResourceNotFound type="quizz" />;
  }
  if (isForbidden) {
    return <ResourceForbidden type="quizz " />;
  }

  return (
    <>
      <div className="flex flex-col items-center max-w-full p-2">
        {quizz ? (
          <>
            <h1 className="my-8 text-center text-3xl uppercase break-words overflow-wrap w-full">
              {quizz.name}
            </h1>
            <div className="flex flex-col gap-10 w-full max-w-96">
              {quizz.qcms.map((qcm, i) => (
                <div
                  key={qcm.id}
                  className="flex flex-col items-center gap-6 w-full"
                >
                  <Separator />
                  <div className=" text-xl">
                    {i + 1} of {quizz.qcms.length}
                  </div>
                  <QuestionQCM
                    question={qcm}
                    onAnswerSelect={(answers) =>
                      handleAnswerSelect(qcm.id, answers)
                    }
                    answeredCorrectly={answeredCorrectly[qcm.id]}
                    isSubmitting={isSubmitting}
                  />
                  {errors[qcm.id] && (
                    <p className="text-red-500">{errors[qcm.id]}</p>
                  )}
                </div>
              ))}
              <div className="flex flex-col items-center gap-2 m-3">
                {isQuizzOver ? (
                  <Button
                    className="w-full md:w-48"
                    onClick={handleResult}
                    variant="default"
                  >
                    Check result
                  </Button>
                ) : (
                  <Button
                    className="w-full md:w-48"
                    onClick={handleSubmit}
                    variant="default"
                  >
                    Validate
                  </Button>
                )}
              </div>
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <HelpBox type={"quizz"} />
    </>
  );
};

export default QuizzPlayPage;
