import { CircleHelp, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Separator } from "../ui/separator";

type HelpBoxProps = {
  type: string;
};

const HelpBox = ({ type }: HelpBoxProps) => {
  return (
    // <div className="fixed bottom-4 right-4  z-50">
    //   <DropdownMenu>
    //     <DropdownMenuTrigger>
    //       <div className="p-2 rounded-xl bg-primary text-white shadow-lg">
    //         <CircleHelp className="w-6 h-6" />
    //       </div>
    //     </DropdownMenuTrigger>
    //     {type === "deck" && (
    //       <DropdownMenuContent className="max-w-56 mr-2">
    //         <DropdownMenuLabel>
    //           Rate your performance from 1 to 5 stars
    //         </DropdownMenuLabel>
    //         <DropdownMenuSeparator />
    //         <div className="flex flex-col gap-3 text-xs text-ellipsis p-2">
    //           <p>
    //             - Select <Star size={10} className="inline fill-yellow-400" />{" "}
    //             star if you feel you failed or took too long to answer.
    //           </p>
    //           <p>
    //             - Select <Star size={10} className="inline fill-yellow-400" />{" "}
    //             <Star size={10} className="inline fill-yellow-400" />{" "}
    //             <Star size={10} className="inline fill-yellow-400" /> stars if
    //             you were close to the correct answer but took a bit too long.
    //           </p>
    //           <p>
    //             - Select <Star size={10} className="inline fill-yellow-400" />{" "}
    //             <Star size={10} className="inline fill-yellow-400" />{" "}
    //             <Star size={10} className="inline fill-yellow-400" />{" "}
    //             <Star size={10} className="inline fill-yellow-400" />{" "}
    //             <Star size={10} className="inline fill-yellow-400" /> stars if
    //             you quickly found the correct answer.
    //           </p>
    //         </div>
    //       </DropdownMenuContent>
    //     )}
    //     {type === "quizz" && (
    //       <DropdownMenuContent className="max-w-56 mr-2">
    //         <DropdownMenuLabel>Legend</DropdownMenuLabel>
    //         <DropdownMenuSeparator />
    //         <div className="flex flex-col gap-3 text-xs p-2">
    //           <p className="text-blue-500">- Blue: The answer you selected.</p>
    //           <p className="text-green-500">- Green: The correct answer.</p>
    //           <p className="text-orange-500">
    //             - Orange: The correct answer that you missed.
    //           </p>
    //           <p className="text-red-500">- Red: The incorrect answer.</p>
    //         </div>
    //       </DropdownMenuContent>
    //     )}
    //   </DropdownMenu>
    // </div>
    <div className="fixed bottom-0 right-0 md:bottom-4 md:right-4  z-50">
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="link">
            <CircleHelp className="w-6 h-6" />
          </Button>
        </HoverCardTrigger>
        {type === "deck" && (
          <HoverCardContent className="max-w-56 mr-2">
            <div className="flex flex-col gap-3">
              <p className="font-semibold">
                Rate your performance from 1 to 5 stars
              </p>
              <Separator />
              <div className="flex flex-col gap-3 text-xs text-ellipsis p-2">
                <p>
                  - Select <Star size={10} className="inline fill-yellow-400" />{" "}
                  star if you feel you failed or took too long to answer.
                </p>
                <p>
                  - Select <Star size={10} className="inline fill-yellow-400" />{" "}
                  <Star size={10} className="inline fill-yellow-400" />{" "}
                  <Star size={10} className="inline fill-yellow-400" /> stars if
                  you were close to the correct answer but took a bit too long.
                </p>
                <p>
                  - Select <Star size={10} className="inline fill-yellow-400" />{" "}
                  <Star size={10} className="inline fill-yellow-400" />{" "}
                  <Star size={10} className="inline fill-yellow-400" />{" "}
                  <Star size={10} className="inline fill-yellow-400" />{" "}
                  <Star size={10} className="inline fill-yellow-400" /> stars if
                  you quickly found the correct answer.
                </p>
              </div>
            </div>
          </HoverCardContent>
        )}
        {type === "quizz" && (
          <HoverCardContent className="max-w-56 mr-2">
            <div className="flex flex-col gap-3">
              <p className=" font-semibold">Colors legend</p>
              <Separator />
              <div className="flex flex-col gap-3 text-xs p-2">
                <p className="text-blue-500">Blue: The answer you selected.</p>
                <p className="text-green-500">Green: The correct answer.</p>
                <p className="text-orange-500">
                  Orange: The correct answer that you missed.
                </p>
                <p className="text-red-500">Red: The incorrect answer.</p>
              </div>
            </div>
          </HoverCardContent>
        )}
      </HoverCard>
    </div>
  );
};

export default HelpBox;
