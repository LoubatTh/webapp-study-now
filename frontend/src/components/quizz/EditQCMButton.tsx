import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

type EditQCMButtonProps = {
  id: number;
};

const EditQCMButton = ({ id }: EditQCMButtonProps) => {
  const navigate = useNavigate();
  const editHandler = () => {
    navigate(`/quizz/${id}/edit`);
  };
  return (
    <div>
      <Button onClick={() => editHandler()}>Edit</Button>
    </div>
  );
};

export default EditQCMButton;
