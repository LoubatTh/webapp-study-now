import React, { useState } from "react";
import CreateSetBtn from "@/components/createSetBtn";
import FilterBtnsBar from "@/components/filterBtnsBar";
import QuizzDeckCard from "@/components/quizzDeckCard";
import { mockDeckData, mockQuizzData } from "@/lib/mockData";
import Pagin from "@/components/pagination";

const BoardPage: React.FC = () => {
  const [activeButton, setActiveButton] = useState("All");
  const [isFavActive, setIsFavActive] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // handle click for filter btn
  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
    setCurrentPage(1);
  };

  // handle click for fav button
  const toggleHeartButton = () => {
    setIsFavActive((prevState) => !prevState);
    setCurrentPage(1);
  };

  // combine quizz and deck data
  const combinedData = [...mockQuizzData, ...mockDeckData];

  // Function to filter combined data
  const filteredData = combinedData.filter((item) => {
    if (isFavActive && item.likes === 0) {
      return false;
    }

    return activeButton === "All" || activeButton.toLowerCase() === item.type;
  });

  // method to set the number of page for pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const displayedItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // handle click for pagination button
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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
        {displayedItems.map((item, index) => (
          <QuizzDeckCard
            key={index}
            data={item}
            type={item.type === "quizz" ? "quizz" : "deck"}
          />
        ))}
      </div>
      <div className="flex justify-center my-4">
        <Pagin
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
};

export default BoardPage;
