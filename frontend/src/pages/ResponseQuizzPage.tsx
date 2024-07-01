import QuestionQCM from "@/components/quizz/QuestionQCM";
import { useAuth } from "@/contexts/AuthContext";
import { fetchApi } from "@/utils/api";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ResponseQuizzPage = () => {
  const { isReady } = useAuth();
  const { quizzId } = useParams();
  const [ quizz, setQuizz ] = useState<any>(null); 

  useEffect(() => {
    if (!isReady || !quizzId) return;

    const fetchQuiz = async () => {

      const response = await fetchApi("GET", `/quizzes/${quizzId}`);
      const data = await response.data;
      console.log(data);
      setQuizz(data);

    };

    fetchQuiz();
  }, [isReady, quizzId]);


  return (
    <>
      <div>Salut la team</div>
      {quizz ? (
        <div>
          <h1>{quizz.name}</h1>
          {quizz.qcms.map((qcm) => (
            <>
              <br></br>
              <QuestionQCM key={qcm.id} question={qcm} />
            </>
          ))}
        </div>
      ) : (
        <p>No quiz data available</p>
      )}
    </>
  );
};

export default ResponseQuizzPage;
