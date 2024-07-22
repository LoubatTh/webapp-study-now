import { InvitationType } from '@/types/invitations.type';
import { Check, Cross, X } from 'lucide-react';
import React from 'react'
import { Button } from './ui/button';

const InvitationCard = ({id, owner, organization, organization_id, requestInvitation} : InvitationType) => {

  const handleRequest = (choice: boolean) => {
    requestInvitation(id, choice);
  }

  return (
    <div className="flex flex-col gap-2 border-2 border-slate-300 p-3 rounded-lg">
      <p>
        <span className="font-semibold">{owner}</span> vous a invité à rejoindre
        l'organisation
        <span className="font-semibold"> {organization}</span>
      </p>
      <div className="flex gap-2">
        <Button onClick={() => handleRequest(true)}>
          <Check size={16} />
        </Button>
        <Button onClick={() => handleRequest(false)}>
          <X size={16} />
        </Button>
      </div>
    </div>
  );
}

export default InvitationCard;