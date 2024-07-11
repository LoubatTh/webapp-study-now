import { useEffect, useState } from "react";
import CreateSetBtn from "@/components/createSetBtn";
// import FilterBtnsBar from "@/components/filterBtnsBar";
import QuizzDeckCard from "@/components/quizzDeckCard";
// import { mockDeckData, mockQuizzData } from "@/lib/mockData";
// import Pagin from "@/components/pagination";
import { useAuth } from "@/contexts/AuthContext";
import { fetchApi } from "@/utils/api";
import { Deck } from "@/types/deck.type";

const getDecksUser = async (accessToken: string) => {
  const response = await fetchApi("GET", `decks`, null, accessToken);
  return response;
};

const getquizzesUser = async (accessToken: string) => {
  const response = await fetchApi("GET", `quizzes`, null, accessToken);
  return response;
};
const BoardPage = () => {
  const { accessToken, isReady } = useAuth();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, isLoading] = useState(true);
  // const [activeButton, setActiveButton] = useState("All");
  // const [isFavActive, setIsFavActive] = useState(false);
  // const [currentPage, setCurrentPage] = useState(1);
  // const itemsPerPage = 9;

  // // handle click for filter btn
  // const handleButtonClick = (buttonName: string) => {
  //   setActiveButton(buttonName);
  //   setCurrentPage(1);
  // };

  // // handle click for fav button
  // const toggleHeartButton = () => {
  //   setIsFavActive((prevState) => !prevState);
  //   setCurrentPage(1);
  // };

  // // combine quizz and deck data
  // const combinedData = [...mockQuizzData, ...mockDeckData];

  // // Function to filter combined data
  // const filteredData = combinedData.filter((item) => {
  //   if (isFavActive && item.likes === 0) {
  //     return false;
  //   }

  //   return activeButton === "All" || activeButton.toLowerCase() === item.type;
  // });

  // // method to set the number of page for pagination
  // const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  // const displayedItems = filteredData.slice(
  //   (currentPage - 1) * itemsPerPage,
  //   currentPage * itemsPerPage
  // );

  // // handle click for pagination button
  // const handlePageChange = (page) => {
  //   setCurrentPage(page);
  // };

  const getDataDecks = async () => {
    const response = await getDecksUser(accessToken);
    if (response.status === 200) {
      const decks: Deck[] = response.data?.decks as Deck[];
      setDecks(decks);
    } else {
      console.log(response.message);
    }
  };

  const getDataQuizzes = async () => {
    const response = await getquizzesUser(accessToken);
    if (response.status === 200) {
      const quizzes = response.data;
      setQuizzes(quizzes);
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

  useEffect(() => {
    getAllData();
    console.log("Decks: ", decks);
    console.log("Quizzes: ", quizzes);
  }, [isReady, accessToken]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="hidden md:flex justify-around p-10 items-center">
        <div>
          <CreateSetBtn />
        </div>
        <div>
          <h3>My board</h3>
        </div>
        {/* <div>
          <FilterBtnsBar
            activeButton={activeButton}
            isFavActive={isFavActive}
            onButtonClick={handleButtonClick}
            onToggleHeart={toggleHeartButton}
          />
        </div> */}
      </div>
      <div className="md:hidden flex flex-col items-center p-10">
        <div className="mb-4">
          <h3>My board</h3>
        </div>
        <div className="mb-4">
          <CreateSetBtn />
        </div>
        {/* <div className="">
          <FilterBtnsBar
            activeButton={activeButton}
            isFavActive={isFavActive}
            onButtonClick={handleButtonClick}
            onToggleHeart={toggleHeartButton}
          />
        </div> */}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 p-4">
        {decks && (
          <>
            {decks.map((deck, index) => (
              <QuizzDeckCard
                key={index}
                id={deck.id}
                name={deck.name}
                tag={deck.tag}
                likes={deck.likes}
                type={deck.type}
                is_public={deck.is_public}
                is_organization={deck.is_organization}
              />
            ))}
          </>
        )}
      </div>
      {/* <div className="flex justify-center my-4">
        <Pagin
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        /> 
      </div> */}
    </>
  );
};

export default BoardPage;
