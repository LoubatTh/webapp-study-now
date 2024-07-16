import { useState } from "react";
import FilterBar from "./FilterBar";
import { Button } from "./ui/button";
import { Search } from "lucide-react";

type FilterMobileProps = {
  onSearch: (searchValues: any) => void;
  board?: boolean;
};

const FilterBarMobile = ({ onSearch, board }: FilterMobileProps) => {
  const [display, setDisplay] = useState(false);

  const handleDisplay = () => {
    setDisplay(!display);
  };

  return (
    <div>
      <Button
        onClick={handleDisplay}
        variant="secondary"
        className="flex items-center gap-1 w-full"
      >
        <Search size={16} /> Show filters
      </Button>
      {display && <FilterBar onSearch={onSearch} board={board} />}
    </div>
  );
};

export default FilterBarMobile;
