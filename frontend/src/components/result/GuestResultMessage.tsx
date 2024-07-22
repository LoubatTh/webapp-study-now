import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const GuestResultMessage = () => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div className="bg-background shadow-md rounded-lg text-center flex flex-col md:flex-row items-center gap-10 p-8 max-w-[70rem] mx-auto">
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold mb-4">Join the community!</h2>
        <p className="mb-4 text-lg">
          Create an account to design your own quizzes and decks, and track your
          progress on each card you complete. With a personalized statistics
          dashboard, you can visualize all your results on a graph and see your
          improvement over time.
        </p>
      </div>
      <Button onClick={handleLoginRedirect}>Create an Account</Button>
    </div>
  );
};

export default GuestResultMessage;
