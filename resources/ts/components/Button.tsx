import React, { MouseEventHandler } from "react";
import { Link } from "react-router-dom";

interface Prop {
  id?: string,
  color?: string,
  to?: string,
  onClick?: MouseEventHandler,
  children: React.ReactNode,
  className?: string
}

const Button = ({id, color = 'yellow', to = '', onClick, children, className}: Prop) => {
  const buttonClass: string = (color) ? `py-2 px-4 text-white font-semibold rounded-lg shadow-md duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-75 bg-${color}-500 hover:bg-${color}-400 focus:ring-${color}-400 ${className}` : `py-2 px-4 font-semibold rounded-lg shadow-md duration-300 focus:outline-none hover:bg-gray-200 ${className}`
  return (
    <>
      {to && <Link to={to} id={id} className={buttonClass} onClick={onClick}>{children}</Link>}
      {!to && <button id={id} className={buttonClass} onClick={onClick}>{children}</button>}
    </>
  )
}
export default Button