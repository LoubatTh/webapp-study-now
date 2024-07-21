import { Bar, BarChart, ReferenceLine, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import CongratulatoryMessage from "@/components/result/CongratulatoryMessage";
import useStore from "@/lib/stores/resultStore";
import GuestResultMessage from "@/components/result/GuestResultMessage";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { fetchApi } from "@/utils/api";
import { formatDateDayMonth } from "@/utils/dateparser";

const chartConfig = {
  result: {
    label: "result",
    color: "#2563eb",
  },
} satisfies ChartConfig;

const getDeck = async (deckId: string, accessToken?: string) => {
  const response = await fetchApi("GET", `decks/${deckId}`, null, accessToken);
  return response;
};

const getResult = async (deckId: string, accessToken: string) => {
  const response = await fetchApi(
    "GET",
    `decks/${deckId}/results`,
    null,
    accessToken
  );
  return response;
};

const ResultDeckPage = () => {
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const { deckId } = useParams<{
    deckId: string;
  }>();
  const { score } = useStore();
  const [cardName, setCardName] = useState<string>("");
  const [lastScore, setSLastcore] = useState<number>(0);
  const [results, setResults] = useState<any[]>([]);

  const fetchDeck = async () => {
    if (!deckId) {
      console.error("Deck ID is required");
      return;
    }
    let response: any;
    if (accessToken) {
      response = await getDeck(deckId, accessToken);
    } else {
      response = await getDeck(deckId);
    }
    if (response.status === 200) {
      const data: any = response.data;
      setCardName(data.name);
    } else {
      console.error("Failed to fetch deck:", response);
    }
  };

  const fetchResult = async () => {
    if (!deckId) {
      console.error("Deck ID and Result ID are required");
      return;
    }
    if (!accessToken) {
      console.error("Access token is required");
      return;
    }
    const response = await getResult(deckId, accessToken);
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
    console.log(results);
  }, [results]);

  useEffect(() => {
    if (!accessToken && score === null) {
      navigate("/explore");
      return;
    }
    if (deckId) fetchDeck();
    if (accessToken) fetchResult();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deckId, accessToken]);

  return (
    <div className="flex flex-col p-6 justify-evenly flex-grow">
      <div className=" text-3xl font-bold text-center">
        {`Result for ${cardName}`}
      </div>
      {accessToken ? (
        <CongratulatoryMessage score={lastScore} maxScore={5} deck={true} />
      ) : (
        <CongratulatoryMessage
          score={score ? score : 0}
          maxScore={5}
          deck={true}
        />
      )}

      {accessToken ? (
        <div className="flex flex-col">
          <div className="text-xl ml-6">All your statistics</div>
          <ChartContainer
            config={chartConfig}
            className="min-h-[80px] max-h-[200px] w-full pr-8"
          >
            <BarChart
              accessibilityLayer
              data={results}
              margin={{
                top: 35,
              }}
              maxBarSize={35}
            >
              <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={5}
                axisLine={true}
                tickFormatter={(value) => value.slice(0, 5)}
              />
              <YAxis domain={[1, 5]} />
              <ReferenceLine y={5} stroke="gray" />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                dataKey="result"
                fill="var(--color-result)"
                radius={[5, 5, 0, 0]}
              ></Bar>
            </BarChart>
          </ChartContainer>
        </div>
      ) : (
        <GuestResultMessage />
      )}
    </div>
  );
};

export default ResultDeckPage;
