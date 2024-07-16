import { useEffect, useState } from "react";
import CreateSetBtn from "@/components/createSetBtn";
import QuizzDeckCard from "@/components/quizzDeckCard";
import { useAuth } from "@/contexts/AuthContext";
import { fetchApi } from "@/utils/api";
import { Deck } from "@/types/deck.type";
import { Quizz } from "@/types/quizz.type";
import { motion } from "framer-motion";
import { QuizzType } from "@/types/QuizzContext.type";
import FilterBar from "@/components/FilterBar";
import { ClassNames } from "@emotion/react";
import FilterBarMobile from "@/components/FilterBarMobile";
import { cardVariants } from "@/lib/animations/cardVariants";

const getDecksUser = async (accessToken: string) => {
  const response = await fetchApi("GET", `decks?myDecks`, null, accessToken);
  console.log("Decks response: ", response);
  return response;
};

const getquizzesUser = async (accessToken: string) => {
  const response = await fetchApi(
    "GET",
    `quizzes?myQuizzes`,
    null,
    accessToken
  );
  console.log("Quizzes response: ", response);
  return response;
};

const BoardPage = () => {
  const { accessToken, isReady } = useAuth();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [quizzes, setQuizzes] = useState<QuizzType[]>([]);
  const [allCards, setAllCards] = useState<any[]>([]);
  const [loading, isLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getDataDecks = async () => {
    const response = await getDecksUser(accessToken);
    if (response.status === 200) {
      const decks: Deck[] = response.data.decks as Deck[];
      setDecks(decks);
      setAllCards((prev) => [...prev, ...decks]);
    } else {
      console.log(response.message);
    }
  };

  const getDataQuizzes = async () => {
    const response = await getquizzesUser(accessToken);
    if (response.status === 200) {
      const quizzes: QuizzType[] = response.data?.quizzes as QuizzType;
      setQuizzes(quizzes);
      setAllCards((prev) => [...prev, ...quizzes]);
    } else {
      console.log(response.message);
    }
  };

  const getAllData = async () => {
    if (isReady && accessToken) {
      try {
        await getDataDecks();
        await getDataQuizzes();
        isLoading(false);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleDeleteCard = (id: number) => {
    setAllCards((prev) => prev.filter((card) => card.id !== id));
  };

  const handleSearch = (searchValues: any) => {
    console.log("Search values from FilterBar:", searchValues);
  };

  useEffect(() => {
    getAllData();
  }, [isReady, accessToken]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="md:hidden">
        <FilterBarMobile onSearch={handleSearch} />
      </div>
      <div className="hidden md:block">
        <FilterBar onSearch={handleSearch} />
      </div>
      <div className="hidden md:flex justify-around p-10 items-center">
        <div>
          <CreateSetBtn />
        </div>
        <div>
          <p>My board</p>
        </div>
      </div>
      <div className="md:hidden flex flex-col items-center p-10">
        <div className="mb-4">
          <h3>My board</h3>
        </div>
        <div className="mb-4">
          <CreateSetBtn />
        </div>
      </div>
      <motion.div
        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 p-4"
        initial="initial"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {allCards && (
          <>
            {allCards.map((item, index) => (
              <motion.div variants={cardVariants} key={item.id}>
                <QuizzDeckCard
                  key={index}
                  id={item.id}
                  name={item.name}
                  tag={item.tag}
                  likes={item.likes}
                  type={item.type}
                  onDeleteCard={handleDeleteCard}
                />
              </motion.div>
            ))}
          </>
        )}
      </motion.div>
    </>
  );
};

export default BoardPage;
