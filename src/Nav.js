import { useContext } from 'react';
import { Link } from 'react-router-dom';
import './css/Nav.css';
import globalContext from "./globalContext";

const Nav = ({ setLoginToken }) => {
  const context = useContext(globalContext);

  function logout() {
    localStorage.removeItem("loginToken");
    setLoginToken(null);
  }

  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/newweek">New Week</Link>
      <Link to="/playground">Playground</Link>
      <Link to="/week">Dead link</Link>
      <button onClick={logout}>Logout!</button>
    </nav>
  );
}

export default Nav;