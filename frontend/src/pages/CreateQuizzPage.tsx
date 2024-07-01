import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import CreateQCM from "../components/quizz/CreateQCM";
import useQCMStore from "../lib/stores/quizzStore";

const CreateQuizzPage = () => {
  //Use the useQCMStore store to get the QCMs
  const { qcms } = useQCMStore();
  //State to manage the name of the quizz
  const [name, setName] = useState("");
  //State to manage the error message
  const [errorMessage, setErrorMessage] = useState("");
  //State to manage the list of QCMs
  const [qcmList, setQcmList] = useState([{ id: 0, collapsed: false }]);

  //Function to add a new QCM to the list
  const addNewQCM = (): void => {
    setQcmList([...qcmList, { id: qcmList.length, collapsed: false }]);
  };

  //Function to delete a QCM from the list
  const deleteQCM = (id: number): void => {
    setQcmList(qcmList.filter((qcm) => qcm.id !== id));
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
  function createQuizzHandler(): void {
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
        qcms: qcms,
      };
      console.log(quizz);
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="mx-auto my-4">Create Quizz</h1>
      <div className="flex flex-col gap-2 p-2 max-w-3xl min-w-full md:min-w-[768px]">
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
        <Button onClick={addNewQCM} variant="default" className="mt-2">
          Add New QCM
        </Button>
        <Separator className="my-2" />
        <Button onClick={createQuizzHandler} variant="default">
          Create Quizz
        </Button>
      </div>
    </div>
  );
};

export default CreateQuizzPage;
