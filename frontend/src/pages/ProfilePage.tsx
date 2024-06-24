import React from 'react'
import { useUser } from '../contexts/UserContext'



const ProfilePage = () => {


  const { name, email, isSubscribed, setUser, clearUser } = useUser();

  return (
    <>
      <div>ProfilePage</div>
      <p>name: {name}</p>
      <p>email: {email}</p>
      <p>isSubscribed: {isSubscribed ? 'true' : 'false'}</p>
      
    </>
  )
}

export default ProfilePage