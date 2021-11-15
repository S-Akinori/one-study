import React from "react";
import { Link } from "react-router-dom";
import { User } from "../interface/User";
import { useAuth } from "./AuthContext";

const Navbar = () => {
  const auth = useAuth();
  return (
    <nav className="px-4 h-full flex justify-between items-center">
      <div className="w-20"><Link to="/posts"><img src="/storage/logo-text.png" width="420" height="180" alt="One Study" /></Link></div>
      <ul className="flex">
        {auth?.user === 'unauthorized' ? 
        <>
          <li className="px-4"><Link to="/login" className="text-black">ログイン</Link></li>
        </>
        :
        <>
          <li><Link to="/user"><img className="c-avatar w-12 h-12" src={(auth?.user as User).photoURL} alt={(auth?.user as User).name} /></Link></li>
        </>
        }
      </ul>
    </nav>
  )
}

export default Navbar