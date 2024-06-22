import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import Homepage from '../pages/Homepage'
import LoginPage from '../pages/LoginPage'
import ProfilePage from '../pages/ProfilePage'

const Navbar = () => {
  return (
    <nav className="bg-white py-4 shadow-md">
      <div className="flex justify-center space-x-4">
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            isActive ? "px-4 py-2 border-2 border-transparent bg-blue-500 text-white rounded" : 
            "px-4 py-2 border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white rounded"
          }
        >
          Home
        </NavLink>
        <NavLink 
          to="/login" 
          className={({ isActive }) => 
            isActive ? "px-4 py-2 border-2 border-transparent bg-blue-500 text-white rounded" : 
            "px-4 py-2 border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white rounded"
          }
        >
          Login
        </NavLink>
        <NavLink 
          to="/profile" 
          className={({ isActive }) => 
            isActive ? "px-4 py-2 border-2 border-transparent bg-blue-500 text-white rounded" : 
            "px-4 py-2 border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white rounded"
          }
        >
          Profile
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar