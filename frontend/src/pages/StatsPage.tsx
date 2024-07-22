import QuizzDeckCard from "@/components/quizzDeckCard";
import { useAuth } from "@/contexts/AuthContext";
import { fetchApi } from "@/utils/api";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Pagination from "@/components/tools/Pagination";
import FilterBarMobile from "@/components/FilterBarMobile";
import FilterBar from "@/components/FilterBar";
import StatGraph from "@/components/tools/StatGraph";
import { formatDateDayMonth } from "@/utils/dateparser";
import Loading from "@/components/Loading";

const cardVariants = {
  initial: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120 },
  },
};

const getAllStats = async (
  accessToken: string,
  pageSelected = 1,
  queryString = ""
) => {
  const response = await fetchApi(
    "GET",
    `stats?&page=${pageSelected}${queryString ? `&${queryString}` : ""}`,
    null,
    accessToken
  );
  console.log(response);
  return response;
};

const formatData = (data) => {
  return data.map((item) => {
    const isQuiz = !!item.quiz_id;
    const mainData = isQuiz ? item.quiz : item.deck;

    return {
      id: mainData.id,
      Cardname: isQuiz ? mainData.quiz_id : mainData.deck_id,
      owner: mainData.owner,
      ownerAvatar: mainData.owner_avatar,
      tag: mainData.tag,
      type: mainData.type,
      likes: mainData.likes,
      isLiked: item.is_liked,
      size: isQuiz ? mainData.qcms_count : mainData.flashcard_count,
      results: item.results.map((result) => ({
        date: formatDateDayMonth(result.created_at),
        result: result.grade,
      })),
    };
  });
};

const StatsPage = () => {
  const { accessToken, isReady } = useAuth();
  const [allCards, setAllCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchValues, setSearchValues] = useState(null);

  const fetchAllStats = async (page: number = 1, searchValues?: any) => {
    const response = await getAllStats(accessToken, page, searchValues);
    if (response.status === 200) {
      const { data, meta } = response.data;
      setTotalPages(meta.last_page);
      setPage(meta.current_page);
      const formattedData = formatData(data);
      setAllCards(formattedData);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      console.error(response.message);
    }
    setLoading(false);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchAllStats(newPage, searchValues);
  };

  const handleSearch = (searchValues: any) => {
    setSearchValues(searchValues);
    fetchAllStats(1, searchValues);
  };

  const handleDeleteCard = (id: number) => {
    setAllCards((prev) => prev.filter((card) => card.id !== id));
  };

  useEffect(() => {
    if (isReady && accessToken) {
      fetchAllStats();
    }
  }, [isReady, accessToken]);

  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <div className="md:hidden">
        <FilterBarMobile onSearch={handleSearch} board={true} />
      </div>
      <div className="hidden md:block md:mb-2">
        <FilterBar onSearch={handleSearch} board={true} />
      </div>
      <h2 className=" text-3xl text-center mt-6">Statistics</h2>
      <motion.div
        className="flex flex-col gap-8 p-4 md:p-8"
        initial="initial"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        {allCards.map((item, index) => (
          <div
            className="grid grid-rows-2 md:grid-rows-none md:grid-cols-3 gap-1 md:gap-8"
            key={index}
          >
            <motion.div
              variants={cardVariants}
              className="row-span-1 md:col-span-1"
            >
              <QuizzDeckCard
                id={item.id}
                Cardname={item.Cardname}
                owner={item.owner}
                owner_avatar={item.ownerAvatar}
                tag={item.tag}
                likes={item.likes}
                isLiked={item.isLiked}
                type={item.type}
                size={item.size}
                onDeleteCard={handleDeleteCard}
              />
            </motion.div>
            <div className="row-span-1 md:col-span-2 bg-slate-400/15 rounded-md">
              <StatGraph
                results={item.results}
                maxScore={item.type === "Quiz" ? item.size : null}
              />
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
