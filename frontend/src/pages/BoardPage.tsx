import React, { useState } from 'react'
import CreateSetBtn from '@/components/createSetBtn'
import FilterBtnsBar from '@/components/filterBtnsBar'
import QuizzCard from '@/components/quizzCard'
import DeckCard from '@/components/deckCard'
import { mockDeckData, mockQuizzData } from '@/lib/mockData'

const BoardPage: React.FC = () => {
  const [activeButton, setActiveButton] = useState("All");
  const [isFavActive, setIsFavActive] = useState(false);

  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
  };

  const toggleHeartButton = () => {
    setIsFavActive((prevState) => !prevState);
  };

  const combinedData = [...mockQuizzData, ...mockDeckData];

  // Function to filter combined data
  const filteredData = combinedData.filter((item) => {
    if (isFavActive && item.likes === 0) {
      return false;
    }

    if (activeButton === "All") {
      return true;
    } else if (activeButton === "Quizz") {
      return item.type === "quizz";
    } else if (activeButton === "Deck") {
      return item.type === "deck";
    }

    return true;
  });

  return (
    <>
      <div className="hidden md:flex justify-around p-10 items-center">
        <div>
          <CreateSetBtn />
        </div>
        <div>
          <h3>My board</h3>
        </div>
        <div>
          <FilterBtnsBar
            activeButton={activeButton}
            isFavActive={isFavActive}
            onButtonClick={handleButtonClick}
            onToggleHeart={toggleHeartButton}
          />
        </div>
      </div>
      <div className="md:hidden flex flex-col items-center p-10">
        <div className="mb-4">
          <h3>My board</h3>
        </div>
        <div className="mb-4">
          <CreateSetBtn />
        </div>
        <div className="">
          <FilterBtnsBar
            activeButton={activeButton}
            isFavActive={isFavActive}
            onButtonClick={handleButtonClick}
            onToggleHeart={toggleHeartButton}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 p-4">
        {filteredData.map((item, index) =>
          item.type === "quizz" ? (
            <QuizzCard key={index} quizz={item} />
          ) : (
            <DeckCard key={index} deck={item} />
          )
        )}
      </div>
    </>
  );
};

 export default BoardPage
