import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

const FilterBtnsBar = ({
  activeButton,
  isFavActive,
  onButtonClick,
  onToggleHeart,
}) => {
  return (
    <div className="flex border border-black rounded-sm bg-black text-white">
      <div className="p-1">
        <Button
          variant={isFavActive ? "secondary" : "ghost"}
          onClick={onToggleHeart}
        >
          <Heart />
        </Button>
      </div>
      <div className="flex">
        <div className="p-1">
          <Button
            variant={activeButton === "All" ? "secondary" : "ghost"}
            onClick={() => onButtonClick("All")}
          >
            All
          </Button>
        </div>
        <div className="p-1">
          <Button
            variant={activeButton === "Quizz" ? "secondary" : "ghost"}
            onClick={() => onButtonClick("Quizz")}
          >
            Quizz
          </Button>
        </div>
        <div className="p-1">
          <Button
            variant={activeButton === "Deck" ? "secondary" : "ghost"}
            onClick={() => onButtonClick("Deck")}
          >
            Deck
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterBtnsBar;
