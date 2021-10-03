import { Link } from 'react-router-dom';
import './css/Nav.css';

const Nav = () => {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/newweek">New Week</Link>
      <Link to="/week">Dead link</Link>
    </nav>
  );
}

export default Nav;