import { useEffect, useState } from "react";
import QuizzDeckCard from "@/components/quizzDeckCard";
import { useAuth } from "@/contexts/AuthContext";
import { fetchApi } from "@/utils/api";
import { motion } from "framer-motion";
import FilterBar from "@/components/FilterBar";
import FilterBarMobile from "@/components/FilterBarMobile";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

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
  console.log("Cards response: ", response);
  return response;
};

const ExplorerPage = () => {
  const { accessToken, isReady } = useAuth();
  const [allCards, setAllCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const buildQueryString = (params) => {
    return Object.keys(params)
      .filter((key) => params[key])
      .map(
        (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
      )
      .join("&");
  };

  const getAll = async (page = 1, searchValues = null) => {
    const queryString = searchValues ? buildQueryString(searchValues) : "";
    const response = await getAllCards(accessToken, page, queryString);
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
    getAll(newPage);
  };

  const handleSearch = (searchValues) => {
    const queryString = buildQueryString(searchValues);
    console.log("Search values: ", searchValues);
    console.log("Query values: ", queryString);
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
        <FilterBarMobile onSearch={handleSearch} />
      </div>
      <div className="hidden md:block md:mb-2">
        <FilterBar onSearch={handleSearch} />
      </div>
      <motion.div
        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 p-4"
        initial="initial"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        {allCards.map((item) => (
          <motion.div key={item.id} variants={cardVariants}>
            <QuizzDeckCard
              id={item.id}
              name={item.name}
              tag={item.tag}
              likes={item.likes}
              type={item.type}
              onDeleteCard={handleDeleteCard}
            />
          </motion.div>
        ))}
      </motion.div>
      <div className="flex gap-2 md:mx-auto md:w-auto items-center mt-6 w-full">
        <div className="flex items-center">
          <Button
            disabled={page <= 1}
            variant="ghost"
            onClick={() => handlePageChange(1)}
          >
            <ChevronFirst />
          </Button>
          <Button
            disabled={page <= 1}
            variant="ghost"
            onClick={() => handlePageChange(page - 1)}
          >
            <ChevronLeft />
          </Button>
        </div>
        <div className="md:min-w-20 flex-auto text-center">
          {page} / {totalPages}
        </div>
        <div className="flex items-center">
          <Button
            disabled={page >= totalPages}
            variant="ghost"
            onClick={() => handlePageChange(page + 1)}
          >
            <ChevronRight />
          </Button>
          <Button
            disabled={page >= totalPages}
            variant="ghost"
            onClick={() => handlePageChange(totalPages)}
          >
            <ChevronLast />
          </Button>
        </div>
      </div>
    </>
  );
};

export default ExplorerPage;
