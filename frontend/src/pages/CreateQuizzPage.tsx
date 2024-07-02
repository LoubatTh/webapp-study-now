import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { fetchApi } from "@/utils/api";
import CreateQCM from "../components/quizz/CreateQCM";
import useQCMStore from "../lib/stores/quizzStore";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const postQuizz = async (quizz: any, accessToken: string) => {
  const response = await fetchApi("POST", "quizzes", quizz, accessToken);
  console.log(response);
  return response;
};

const CreateQuizzPage = () => {
  //Get the access token from the AuthContext
  const { accessToken } = useAuth();
  //Get the access token from the AuthContext
  const navigate = useNavigate();
  //Use the useQCMStore store to get the QCMs
  const { qcms, resetQCMs } = useQCMStore();
  //State to manage the name of the quizz
  const [name, setName] = useState<string>("");
  //State to manage the visibility of the quizz
  const [isPublic, setIsPublic] = useState<boolean>(false);
  //State to manage the error message
  const [errorMessage, setErrorMessage] = useState<string>("");
  //State to manage the list of QCMs
  const [qcmList, setQcmList] = useState([{ id: 0, collapsed: false }]);

  //Function to add a new QCM to the list
  const addNewQCM = (): void => {
    setQcmList([...qcmList, { id: qcmList.length, collapsed: false }]);
  };

  //Function to delete a QCM from the list
  const deleteQCM = (id: number): void => {
    setQcmList(qcmList.filter((qcm) => qcm.id !== id));
    toast({
      description: "QCM deleted successfully",
    });
  };

  //Function to toggle the collapse of a QCM
  const toggleCollapse = (id: number): void => {
    setQcmList(
      qcmList.map((qcm) =>
        qcm.id === id ? { ...qcm, collapsed: !qcm.collapsed } : qcm
      )
    );
  };

  //Function to create the quizz with the QCMs and send it to the backend
  async function createQuizzHandler(): Promise<void> {
    if (name.length < 1) {
      setErrorMessage("The name field is required.");
      return;
    } else if (qcms.length < 1) {
      setErrorMessage("You need to add at least one QCM.");
      return;
    } else {
      setErrorMessage("");
      const quizz = {
        name,
        isPublic,
        qcms: [
          ...qcms.map((qcm) => ({
            question: qcm.question,
            answers: qcm.answers,
          })),
        ],
      };
      console.log(quizz);
      const response = await postQuizz(quizz, accessToken);
      if (response.status === 201) {
        setName("");
        setQcmList([{ id: 0, collapsed: false }]);
        resetQCMs();
        toast({
          description: "Quizz created successfully",
        });
        navigate("/homepage");
      } else {
        const message = response.error;
        toast({ description: message });
      }
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="mx-auto my-4">Create Quizz</h1>
      <div className="flex flex-col gap-3 p-2 max-w-3xl min-w-full md:min-w-[768px]">
        <Label htmlFor="name">Quizz name</Label>
        <Input
          id="name"
          type="text"
          placeholder="My Quizz name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errorMessage && (
          <div className="text-sm font-medium text-destructive">
            {errorMessage}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-3 p-2 max-w-3xl min-w-full md:min-w-[768px]">
        <Label htmlFor="name">Visibility</Label>
        <div className="flex gap-2">
          <Switch
            checked={isPublic}
            onCheckedChange={() => setIsPublic(!isPublic)}
          />
          <div>{isPublic ? "Public" : "Private"}</div>
        </div>
      </div>
      <div className="flex flex-col gap-2 p-2 max-w-3xl min-w-full md:min-w-[768px]">
        {qcmList.map((qcm, i) => (
          <React.Fragment key={qcm.id}>
            <Separator className="my-2" />
            <div className="text-center">
              QCM {i + 1} of {qcmList.length}
            </div>
            <CreateQCM
              id={qcm.id}
              index={i + 1}
              qcmsSize={qcmList.length}
              collapsed={qcm.collapsed}
              onToggleCollapse={() => toggleCollapse(qcm.id)}
              onDelete={() => deleteQCM(qcm.id)}
            />
          </React.Fragment>
        ))}
        <Button
          onClick={addNewQCM}
          variant="secondary"
          className="mt-2 border shadow-sm"
        >
          Add New QCM
        </Button>
        <Button onClick={createQuizzHandler} variant="default">
          Create Quizz
        </Button>
      </div>
    </div>
  );
};

export default CreateQuizzPage;
