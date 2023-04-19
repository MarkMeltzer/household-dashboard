import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../css/components/Nav.css";
import useWindowSize from "../hooks/useWindowSize";

const Nav = ({ setLoginToken }) => {
  const windowSize = useWindowSize();
  const [overflowOpen, setOverflowOpen] = useState(false);
  const [overflowCuttoff, setOverflowCuttoff] = useState(2);

  const links = [
    { location: "/", label: "Home" },
    { location: "/newweek", label: "New Week" },
    { location: "/playground", label: "Playground" },
    { location: "/shoppingItems", label: "Shopping Items" },
  ];

  useEffect(() => {
    if (windowSize.width < 600) {
      setOverflowCuttoff(3);
    } else if (windowSize.width < 1200) {
      setOverflowCuttoff(2);
    } else if (windowSize.width < 1500) {
      setOverflowCuttoff(3);
    } else if (windowSize.width < 1900) {
      setOverflowCuttoff(4);
    } else {
      setOverflowCuttoff(100);
    }
  }, [windowSize]);

  function logout(event) {
    event.preventDefault();

    localStorage.removeItem("loginToken");
    setLoginToken(null);
  }

  function toggleOverflow(event) {
    event.preventDefault();

    setOverflowOpen((prev) => !prev);
  }

  return (
    <nav>
      <div className="menu">
        {links.slice(0, overflowCuttoff).map((link) => {
          return (
            <Link
              to={link.location}
              key={link.location + link.label}
              onClick={() => setOverflowOpen(false)}
            >
              {link.label}
            </Link>
          );
        })}
        <a href="" onClick={logout}>
          Logout!
        </a>
        {overflowCuttoff < links.length && (
          <a href="" onClick={toggleOverflow}>
            {overflowOpen ? "≢" : "≡"}
          </a>
        )}
      </div>
      {overflowOpen && (
        <div className="overflowMenu">
          {links.slice(overflowCuttoff).map((link) => {
            return (
              <Link
                to={link.location}
                key={link.location + link.label}
                onClick={() => setOverflowOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
};

export default Nav;
