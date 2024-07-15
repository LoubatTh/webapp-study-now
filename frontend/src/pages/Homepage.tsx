import StudyImg from "@/assets/images/study_img.jpg";
import { useNavigate } from "react-router-dom";

const Homepage = () => {

  const navigate = useNavigate();
  const handleNavigate = (path: string) => {
    navigate(path);
  };
  return (
    <>
      <div className="flex justify-center items-center my-20 mx-auto">
        <div className="max-w-md my-auto">
          <h1 className="text-5xl md:text-3xl lg:text-5xl m-4">
            Study smarter, share easily
          </h1>
          <p className="text-base md:text-sm lg:text-base m-4">
            Our app lets you create custom flashcard decks and quizzes sets to
            optimize your learning. Share your creations, collaborate with
            friends, and revolutionize your study habits for greater success
          </p>
          <button
            className="items-center bg-black p-3 text-white rounded-md hover:bg-slate-800 cursor-pointer m-4"
            onClick={() => handleNavigate("/explore")}
          >
            Get started
          </button>
        </div>
        <div className="hidden md:flex items-center max-w-md">
          <img
            src={StudyImg}
            alt="Image de valerian qui embrasse matteo"
            className="rounded-md"
          />
        </div>
      </div>
    </>
  );
};

export default Homepage;
