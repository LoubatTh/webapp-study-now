import { useState } from "react";
import FilterBar from "./FilterBar";
import { Button } from "./ui/button";
import { Search } from "lucide-react";

const FilterBarMobile = ({ onSearch }) => {
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
      {display && <FilterBar onSearch={onSearch} />}
    </div>
  );
};

export default FilterBarMobile;
