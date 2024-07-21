import { useEffect, useState } from "react";
import CongratulatoryMessage from "@/components/result/CongratulatoryMessage";
import { fetchApi } from "@/utils/api";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import useStore from "@/lib/stores/resultStore";
import GuestResultMessage from "@/components/result/GuestResultMessage";
import { formatDateDayMonth } from "@/utils/dateparser";
import StatGraph from "@/components/tools/StatGraph";

const getQuizz = async (quizzId: string, accessToken?: string) => {
  const response = await fetchApi(
    "GET",
    `quizzes/${quizzId}`,
    null,
    accessToken
  );
  return response;
};

const getResult = async (quizzId: string, accessToken: string) => {
  const response = await fetchApi(
    "GET",
    `quizzes/${quizzId}/results`,
    null,
    accessToken
  );
  return response;
};

const ResultQuizzPage = () => {
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const { quizzId } = useParams<{
    quizzId: string;
  }>();
  const { score, maxScore } = useStore();
  const [cardName, setCardName] = useState<string>("");
  const [lastScore, setSLastcore] = useState<number>(0);
  const [results, setResults] = useState<any[]>([]);
  const [maxResults, setMaxResults] = useState<number>(0);

  const fetchQuizz = async () => {
    if (!quizzId) {
      console.error("Deck ID is required");
      return;
    }
    let response: any;
    if (accessToken) {
      response = await getQuizz(quizzId, accessToken);
    } else {
      response = await getQuizz(quizzId);
    }
    if (response.status === 200) {
      const data: any = response.data;
      setCardName(data.name);
      setMaxResults(data.qcms.length);
    } else {
      console.error("Failed to fetch deck:", response);
    }
  };

  const fetchResult = async () => {
    if (!quizzId) {
      console.error("Deck ID and Result ID are required");
      return;
    }
    if (!accessToken) {
      console.error("Access token is required");
      return;
    }
    const response = await getResult(quizzId, accessToken);
    if (response.status === 200) {
      const data: any = response.data;
      const grade = data.results[data.results.length - 1].grade;
      data.results.map((result: any) => {
        setResults((results) => [
          ...results,
          {
            date: formatDateDayMonth(result.created_at),
            result: parseFloat(result.grade.toFixed(2)),
          },
        ]);
      });
      setSLastcore(grade);
    } else {
      console.error("Failed to fetch result:", response);
    }
  };

  useEffect(() => {
    if (!accessToken && score === null) {
      navigate("/explore");
      return;
    }
    if (quizzId) fetchQuizz();
    if (accessToken) fetchResult();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizzId, accessToken]);

  return (
    <div className="flex flex-col p-6 justify-evenly flex-grow">
      <div className=" text-3xl font-bold text-center">
        {`Result for ${cardName}`}
      </div>

      {accessToken ? (
        <CongratulatoryMessage score={lastScore} maxScore={maxResults} />
      ) : (
        <CongratulatoryMessage
          score={score ? score : 0}
          maxScore={maxScore ? maxScore : 0}
        />
      )}

      {accessToken ? (
        <div className="flex flex-col">
          <div className="text-xl ml-6">All your statistics</div>
          <StatGraph results={results} maxScore={maxResults} />
        </div>
      ) : (
        <GuestResultMessage />
      )}
    </div>
  );
};

export default ResultQuizzPage;
