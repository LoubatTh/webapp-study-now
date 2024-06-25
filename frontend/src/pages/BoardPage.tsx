import React from 'react'
import { useUser } from '../contexts/UserContext'

const BoardPage = () => {

  const { name, email, isSubscribed } = useUser();

}

 export default BoardPage
