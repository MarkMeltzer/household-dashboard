import { useContext } from 'react';
import { Link } from 'react-router-dom';
import globalContext from "../globalContext";
import '../css/components/Nav.css';

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
      <Link to="/shoppingItems">Shopping items</Link>
      <button onClick={logout}>Logout!</button>
    </nav>
  );
}

export default Nav;