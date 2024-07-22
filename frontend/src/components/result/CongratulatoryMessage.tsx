import { Rating } from "@mui/material";
import { CardContainer, CardBody, CardItem } from "../ui/3d-card";

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
  let message: string,
    color: string,
    fontWeight: string,
    gradientFrom: string,
    gradientTo: string;
  let ring;

  if (score === maxScore) {
    message = "Amazing! A perfect score!";
    color = "text-green-600";
    fontWeight = "font-bold";
    ring = "ring-1 ring-green-600 bg-green-400/10";
  } else if ((score / maxScore) * 100 >= 80) {
    message = "Very nice job!";
    color = "text-green-600";
    fontWeight = "font-semibold";
    ring = "ring-1 ring-green-600 bg-green-400/10";
  } else if ((score / maxScore) * 100 >= 50) {
    message = "Good job!";
    color = "text-blue-600";
    fontWeight = "font-medium";
    ring = "ring-1 ring-blue-600 bg-blue-400/10";
  } else {
    message = "Keep practicing! You can do it!";
    color = "text-black-600";
    fontWeight = "font-normal";
    ring = "ring-1 ring-black-600 bg-black-400/10";
  }

  return (
    <CardContainer className="inter-var">
      <CardBody className="relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl">
        <CardItem
          translateZ="50"
          className="text-xl font-bold text-neutral-600 dark:text-white"
        >
          <div className="relative w-full">
            <div
              className={`absolute -inset-1 ${ring} rounded-md blur opacity-50`}
            ></div>
            <div className="relative py-7 px-20 ring-1 ring-gray-300/30 rounded-md shadow-lg leading-none">
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
                <div className={`${color} ${fontWeight} tracking-wide`}>
                  {message}
                </div>
              </div>
            </div>
          </div>
        </CardItem>
      </CardBody>
    </CardContainer>
  );
};

export default CongratulatoryMessage;
