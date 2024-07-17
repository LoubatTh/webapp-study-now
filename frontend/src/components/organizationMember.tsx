import { useUser } from '@/contexts/UserContext';
import { Apple, User, UserMinus } from 'lucide-react'
import React from 'react'
import ReactLoading from 'react-loading'

const OrganizationMember = ({id: id_user, name, pending, is_owner}) => {

  const { id } = useUser();

  return (
    <>
      <div className="flex items-center justify-between gap-2 border-2 border-slate-300 p-3 rounded-lg">
        <p className='flex flex-raw items-center gap-2'>{name} {id == id_user && <User size={20}/>}</p>
        {is_owner && <UserMinus size={20} />}
      </div>
    </>
  );
}

export default OrganizationMember;