import { useEffect, useState } from "react";
import QuizzDeckCard from "@/components/quizzDeckCard";
import { useAuth } from "@/contexts/AuthContext";
import { fetchApi } from "@/utils/api";
import { motion } from "framer-motion";
import Pagination from "@/components/tools/Pagination";
import FilterBarMobile from "@/components/FilterBarMobile";
import FilterBar from "@/components/FilterBar";

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
    `all?page=${pageSelected}${queryString ? `&${queryString}` : ""}`,
    null,
    accessToken
  );
  return response;
};

const ExplorerPage = () => {
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
    if (isReady) {
      getAll();
    }
  }, [isReady, accessToken]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="md:hidden">
        <FilterBarMobile onSearch={handleSearch} />
      </div>
      <div className="hidden md:block px-8">
        <FilterBar onSearch={handleSearch} />
      </div>
      <motion.div
        className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3 p-4 md:gap-8 md:p-8 max-w-full"
        initial="initial"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        {allCards.map((item, index) => (
          <motion.div variants={cardVariants} key={index}>
            <QuizzDeckCard
              id={item.id}
              Cardname={item.name}
              owner={item.owner}
              owner_avatar={item.owner_avatar}
              tag={item.tag}
              likes={item.likes}
              isLiked={item.is_liked}
              type={item.type}
              flashcards={item.flashcards}
              qcms={item.qcms}
              onDeleteCard={handleDeleteCard}
            />
          </motion.div>
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

export default ExplorerPage;
