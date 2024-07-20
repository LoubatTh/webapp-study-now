type CongratulatoryMessageProps = {
  score: number;
  maxScore: number;
};

const CongratulatoryMessage = ({
  score,
  maxScore,
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
    <div className={`${color} ${fontWeight} flex flex-col gap-4 text-center`}>
      <div className="text-xl">
        {score}/{maxScore}
      </div>
      <div className="text-lg">{message}</div>
    </div>
  );
};

export default CongratulatoryMessage;
