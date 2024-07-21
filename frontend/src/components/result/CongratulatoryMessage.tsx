import { Rating } from "@mui/material";

type CongratulatoryMessageProps = {
  score: number;
  maxScore: number;
  deck?: boolean;
};

const CongratulatoryMessage = ({
  score,
  maxScore,
  deck,
}: CongratulatoryMessageProps) => {
  let message: string, color: string, fontWeight: string;

  if (score === maxScore) {
    message = "Amazing! A perfect score!";
    color = "text-green-600";
    fontWeight = "font-bold";
  } else if ((score / maxScore) * 100 >= 80) {
    message = "Very nice job!";
    color = "text-green-600";
    fontWeight = "font-semibold";
  } else if ((score / maxScore) * 100 >= 50) {
    message = "Good job!";
    color = "text-blue-600";
    fontWeight = "font-medium";
  } else {
    message = "Keep practicing! You can do it!";
    color = "text-black-600";
    fontWeight = "font-normal";
  }

  return (
    <div className="flex flex-col gap-4 text-center">
      {deck ? (
        <div className="flex flex-col items-center text-2xl gap-2">
          <div className="text-2xl">My final score</div>
          <Rating value={score} size="large" readOnly />
        </div>
      ) : (
        <div className={`${color} ${fontWeight}`}>
          {score}/{maxScore}
        </div>
      )}
      <div className={`${color} ${fontWeight}`}>{message}</div>
    </div>
  );
};

export default CongratulatoryMessage;
