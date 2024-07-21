import QuizzDeckCard from "@/components/quizzDeckCard";
import { useAuth } from "@/contexts/AuthContext";
import { fetchApi } from "@/utils/api";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Bar, BarChart, ReferenceLine, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import Pagination from "@/components/tools/Pagination";
import FilterBarMobile from "@/components/FilterBarMobile";
import FilterBar from "@/components/FilterBar";

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

const cardVariants = {
  initial: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120 },
  },
};

const getAllCards = async (
  accessToken: string,
  pageSelected = 1,
  queryString = ""
) => {
  const response = await fetchApi(
    "GET",
    `all?me&page=${pageSelected}${queryString ? `&${queryString}` : ""}`,
    null,
    accessToken
  );
  return response;
};

const StatsPage = () => {
  const { accessToken, isReady } = useAuth();
  const [allCards, setAllCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchValues, setSearchValues] = useState(null);

  const getAll = async (page = 1, searchValues?) => {
    const response = await getAllCards(accessToken, page, searchValues);
    if (response.status === 200) {
      const { data: cards, meta } = response.data;
      setTotalPages(meta.last_page);
      setPage(meta.current_page);
      setAllCards(cards);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      console.error(response.message);
    }
    setLoading(false);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    getAll(newPage, searchValues);
  };

  const handleSearch = (searchValues) => {
    setSearchValues(searchValues);
    getAll(1, searchValues); // Reset to first page when performing a new search
  };

  const handleDeleteCard = (id) => {
    setAllCards((prev) => prev.filter((card) => card.id !== id));
  };

  useEffect(() => {
    if (isReady && accessToken) {
      getAll();
    }
  }, [isReady, accessToken]);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <div className="md:hidden">
        <FilterBarMobile onSearch={handleSearch} board={true} />
      </div>
      <div className="hidden md:block px-8">
        <FilterBar onSearch={handleSearch} board={true} />
      </div>
      <h2 className=" text-3xl text-center my-4">Statistics</h2>
      <motion.div
        className="flex flex-col gap-4 p-4 md:gap-8 md:p-8"
        initial="initial"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        {allCards.map((item, index) => (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            <motion.div
              variants={cardVariants}
              key={index}
              className=" col-span-1"
            >
              <QuizzDeckCard
                id={item.id}
                Cardname={item.name}
                owner={item.owner}
                tag={item.tag}
                likes={item.likes}
                isLiked={item.is_liked}
                type={item.type}
                flashcards={item.flashcards}
                qcms={item.qcms}
                onDeleteCard={handleDeleteCard}
              />
            </motion.div>
            <div className="col-span-2 bg-slate-400/15 rounded-md">
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
          </div>
        ))}
      </motion.div>
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
};

export default StatsPage;
