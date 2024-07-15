import React from 'react'
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';

const CreateOrganizations = () => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create an organisation</DialogTitle>
        <DialogDescription>
          This action cannot be undone. This will permanently delete your
          account and remove your data from our servers.
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  );
}

export default CreateOrganizations;