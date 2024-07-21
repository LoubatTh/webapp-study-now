import { useUser } from '@/contexts/UserContext';
import { Dialog } from '@radix-ui/react-dialog';
import { Apple, User, UserMinus } from 'lucide-react'
import React from 'react'
import ReactLoading from 'react-loading'
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';

const OrganizationMember = ({id: id_user, name, pending, is_owner, onRemoveUser}) => {

  const { id } = useUser();

  return (
    <>
      <div className="flex items-center justify-between gap-2 border-2 border-slate-300 p-3 rounded-lg">
        <p className="flex flex-row items-center gap-2">
          {name} {id == id_user && <User size={20} />}
        </p>
        {is_owner && (
          <>
            <Dialog>
              <DialogTrigger asChild>
                <UserMinus
                  className="cursor-pointer hover:text-red-400"
                  size={20}
                />
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Remove this member ?</DialogTitle>
                  <DialogDescription>
                    This action is irreversible, are you sure you want to remove
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="destructive"
                    onClick={() => onRemoveUser(id_user)}
                  >
                    Remove
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </>
  );
}

export default OrganizationMember;