import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { Heart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

// colors for tags
// const colorPalette: { [key: string]: string } = {
//   history: "bg-orange-100 text-orange-800",
//   geography: "bg-green-100 text-green-800",
//   science: "bg-yellow-100 text-yellow-800",
//   maths: "bg-red-100 text-red-800",
//   french: "bg-blue-100 text-blue-800",
//   english: "bg-violet-100 text-violet-800",
//   technology: "bg-rose-100 text-rose-800",
//   art: "bg-indigo-100 text-indigo-800",
// };

// method to define tag color
// const getColorClass = (tagName: string) => {
//   return colorPalette[tagName] || "bg-gray-100 text-gray-800";
// };

// set type for quizz and deck
// type CardDataType = QuizzType | DeckType;

type CommonCardProps = {
  id?: number;
  name: string;
  tag: string;
  type: string;
  likes: number;
  is_public?: boolean;
  is_organization?: boolean;
};

const QuizzDeckCard: React.FC<CommonCardProps> = ({
  id,
  name,
  tag,
  type,
  likes,
  is_organization,
  is_public,
}: CommonCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/${type}/${id}`);
  };

  return (
    <div onClick={handleClick} className="cursor-pointer">
      <Card className="transition-transform duration-200 transform hover:shadow-lg hover:scale-105">
        <CardHeader>
          <CardTitle>{name}</CardTitle>
          <CardDescription>
            {type === "quizz" ? "Quizz" : "Deck"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <span>{tag}</span>
        </CardContent>
        <CardFooter className="justify-between">
          <div className="flex items-center">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <p className="ml-2">lulu</p>
          </div>
          <div className="flex items-center">
            <p className="mr-1">{likes}</p>
            <Heart className="text-red-500" />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuizzDeckCard;
