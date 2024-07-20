import FilterBar from "@/components/FilterBar";
import FilterBarMobile from "@/components/FilterBarMobile";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { fetchApi } from "@/utils/api";
import {
  ChevronFirst,
  ChevronLeft,
  ChevronRight,
  ChevronLast,
} from "lucide-react";
import { useState, useEffect } from "react";

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
    getAll(1, searchValues); // Reset to first page when performing a new search
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
      <div className="hidden md:block md:mb-2">
        <FilterBar onSearch={handleSearch} board={true} />
      </div>
      <div className="flex flex-col p-8">
        <h2 className="text-3xl font-bold text-center">Statistics</h2>
        <div className="mt-4">
          <p className="text-lg">Coming soon...</p>
        </div>
      </div>
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

export default StatsPage;
