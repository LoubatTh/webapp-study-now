import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";

const DeleteOrganizations = ({ org_id, removeOrganization }) => {
  const deleteHandler = async () => {
    removeOrganization(org_id);
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="p-3 hover:bg-red-500 hover:text-background"
            onClick={(event) => event.stopPropagation()}
          >
            <Trash2 size={14} />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this organization ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button
                type="button"
                onClick={() => deleteHandler()}
                variant="destructive"
                className="w-1/2"
              >
                <div>Delete</div>
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeleteOrganizations;
