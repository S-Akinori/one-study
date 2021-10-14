import React from "react";
import Navbar from "./Navbar";

const Layout: React.FC = (props) => {
  return (
    <div className="layout">
      <header>
        <Navbar />
      </header>
      <main>
        {props.children}
      </main>
      <footer>
        1スタディ
      </footer>
    </div>
  )
}

export default Layout