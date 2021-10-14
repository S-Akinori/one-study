import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="ml-auto">
    <ul className="flex">
      <Link to="/about">
        <li className="px-4">About</li>
      </Link>
      <Link to="/user">
        <li className="px-4">User</li>
      </Link>
      <Link to="/register">
        <li className="px-4">Register</li>
      </Link>
      <Link to="/login">
        <li className="px-4">Login</li>
      </Link>
      <Link to="/logout">
        <li className="px-4">Logout</li>
      </Link>
    </ul>
  </nav>
  )
}

export default Navbar