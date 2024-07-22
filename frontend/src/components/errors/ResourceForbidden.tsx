import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

export const ResourceForbidden = ({ type }) => {
  const navigation = useNavigate();

  const handleNavigation = (path: string) => {
    navigation(path);
  };

  return (
    <>
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-red-400">Sorry !</h1>
          <p className="text-2xl text-gray-600 mt-4">This {type} is private</p>
          <p className="text-gray-500 mt-2">
            You do not have permission to access this {type}.
          </p>
          <Button onClick={() => handleNavigation("/explore")} className="mt-6">
            Go back to explore
          </Button>
        </div>
      </div>
    </>
  );
};
