import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

const FilterBtnsBar = () => {
  const [activeButton, setActiveButton] = useState('All');
  const [isFavActive, setIsFavActive] = useState(false);

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  const toggleHeartButton = () => {
    setIsFavActive(prevState => !prevState);
  };

  return (
    <div className="flex border border-black rounded-sm bg-black text-white">
      <div className="p-1">
        <Button
          variant={isFavActive ? 'secondary' : 'ghost'}
          onClick={toggleHeartButton}
        >
          <Heart />
        </Button>
      </div>
      <div className="flex">
        <div className="p-1">
          <Button
            variant={activeButton === 'All' ? 'secondary' : 'ghost'}
            onClick={() => handleButtonClick('All')}
          >
            All
          </Button>
        </div>
        <div className="p-1">
          <Button
            variant={activeButton === 'QCM' ? 'secondary' : 'ghost'}
            onClick={() => handleButtonClick('QCM')}
          >
            QCM
          </Button>
        </div>
        <div className="p-1">
          <Button
            variant={activeButton === 'Deck' ? 'secondary' : 'ghost'}
            onClick={() => handleButtonClick('Deck')}
          >
            Deck
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterBtnsBar;
