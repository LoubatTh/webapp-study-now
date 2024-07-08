import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { QuizzType } from "@/types/QuizzContext.type";
import { DeckType } from "@/types/DeckContext.type";
import { Heart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { colorPalette } from "@/utils/tagscolor";

// method to define tag color
const getColorClass = (tagName: string) => {
  return colorPalette[tagName] || "bg-gray-100 text-gray-800";
};

// set type for quizz and deck
type CardDataType = QuizzType | DeckType;

type CommonCardProps = {
  data: CardDataType;
  type: "quizz" | "deck";
};

const QuizzDeckCard: React.FC<CommonCardProps> = ({ data, type }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/${type}/${data.id}`);
  };

  return (
    <div onClick={handleClick} className="cursor-pointer">
      <Card className="transition-transform duration-200 transform hover:shadow-lg hover:scale-105">
        <CardHeader>
          <CardTitle>{data.name}</CardTitle>
          <CardDescription>
            {type === "quizz" ? "Quizz" : "Deck"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <span
            className={`px-2 py-1 rounded-full text-sm font-medium ${getColorClass(
              data.tags.name
            )}`}
          >
            {data.tags.name}
          </span>
        </CardContent>
        <CardFooter className="justify-between">
          <div className="flex items-center">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <p className="ml-2">{data.owner.name}</p>
          </div>
          <div className="flex items-center">
            <p className="mr-1">{data.likes}</p>
            <Heart className="text-red-500" />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuizzDeckCard;
