import { useState } from "react";
import { motion } from "framer-motion";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import useFlashcardStore from "@/lib/stores/flashcardStore";

type FlashcardComponentProps = {
  question: string;
  answer: string;
  index: number;
};

const FlashcardComponent = ({
  question,
  answer,
  index,
}: FlashcardComponentProps) => {
  const { addRating } = useFlashcardStore();
  const [isFlipped, setIsFlipped] = useState(false);
  const [star, setStar] = useState<number | null>(null);

  const handleStar = (value: number | null) => {
    setStar(value);
    addRating(index, value || 0);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="flex flex-col justify-center items-center gap-8">
      <div
        className="relative w-80 md:w-96 h-48 perspective"
        onClick={handleFlip}
      >
        <motion.div
          className={`bg-background rounded-xl absolute inset-0 flex border shadow-xl ${
            isFlipped ? "rotate-y-180" : ""
          }`}
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="absolute inset-0 flex justify-center items-center backface-hidden">
            <h2 className="text-xl font-bold">{question}</h2>
          </div>
          <div className="absolute inset-0 flex flex-col gap-2 p-2 backface-hidden rotate-y-180 ring-1 ring-electricalBlue rounded-xl">
            <h2 className="text-xl font-bold text-center">Answer</h2>
            <p className="text-lg">{answer}</p>
          </div>
        </motion.div>
      </div>
      <div className="flex flex-col gap-2 text-center mb-8">
        <Typography>My rating</Typography>
        <Rating
          value={star}
          onChange={(event, newValue) => {
            handleStar(newValue);
          }}
        />
      </div>
    </div>
  );
};

export default FlashcardComponent;
