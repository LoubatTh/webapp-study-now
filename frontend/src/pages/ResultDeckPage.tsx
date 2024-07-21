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

const chartConfig = {
  results: {
    label: "results",
    color: "#2563eb",
  },
  type: {
    label: "type",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

const chartData = [
  { day: "24/02", results: 33, type: "deck" },
  { day: "20/02", results: 40, type: "deck" },
  { day: "25/02", results: 80, type: "deck" },
  { day: "24/02", results: 33, type: "deck" },
  { day: "26/02", results: 100, type: "deck" },
  { day: "18/02", results: 20, type: "deck" },
  { day: "19/02", results: 30, type: "deck" },
  { day: "20/02", results: 40, type: "deck" },
  { day: "21/02", results: 80, type: "deck" },
  { day: "19/02", results: 30, type: "deck" },
  { day: "22/02", results: 12, type: "deck" },
  { day: "21/02", results: 80, type: "deck" },
  { day: "24/02", results: 33, type: "deck" },
  { day: "24/02", results: 33, type: "deck" },
  { day: "20/02", results: 40, type: "deck" },
  { day: "25/02", results: 80, type: "deck" },
  { day: "24/02", results: 33, type: "deck" },
  { day: "26/02", results: 100, type: "deck" },
];

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
  const { score, maxScore } = useStore();
  const [cardName, setCardName] = useState<string>("");
  // const [score, setScore] = useState<number>(40);
  // const [maxScore, setMaxScore] = useState<number>(40);

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
      setCardName(data.name);
    } else {
      console.error("Failed to fetch result:", response);
    }
  };

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
      <CongratulatoryMessage
        score={score ? score : 0}
        maxScore={maxScore ? maxScore : 0}
        deck={true}
      />
      {accessToken ? (
        <div className="flex flex-col">
          <div className="text-xl ml-6">All your statistics</div>
          <ChartContainer
            config={chartConfig}
            className="min-h-[80px] max-h-[200px] w-full pr-8"
          >
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{
                top: 35,
              }}
              maxBarSize={35}
            >
              <XAxis
                dataKey="day"
                tickLine={false}
                tickMargin={5}
                axisLine={true}
                tickFormatter={(value) => value.slice(0, 5)}
              />
              <YAxis domain={[0, 100]} />
              <ReferenceLine y={100} stroke="gray" />
              <ReferenceLine y={50} stroke="gray" />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                dataKey="results"
                fill="var(--color-results)"
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
