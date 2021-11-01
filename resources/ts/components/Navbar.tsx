import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

const Navbar = () => {
  const auth = useAuth();
  return (
    <nav className="px-4 h-full flex justify-between items-center">
      <div className="w-20"><Link to="/"><img src="/storage/logo-text.png" width="420" height="180" alt="One Study" /></Link></div>
      <ul className="flex">
        <li className="px-4"><Link to="/posts">index</Link></li>
        <li className="px-4"><Link to="/posts/create">Create</Link></li>
        {auth?.user === 'unauthorized' ? 
        <>
          <li className="px-4"><Link to="/register">Register</Link></li>
          <li className="px-4"><Link to="/login">Login</Link></li>
        </>
        :
        <>
        <Link to="/user">
          <li className="px-4">User</li>
        </Link>
        </>
        }
      </ul>
    </nav>
  )
}

export default Navbar