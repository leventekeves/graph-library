import { Link } from "react-router-dom";

import classes from "./Navigaton.module.css";

const Navigation = () => {
  return (
    <header className={classes.header}>
      <nav className={classes.container}>
        <div className={classes["left-container"]}>
          <ul>
            <li>
              <Link to="/">Homepage</Link>
            </li>
            <li>
              <Link to="/books">Books</Link>
            </li>
            <li>
              <Link to="/lists">Lists</Link>
            </li>
            <li>
              <Link to="/expand">Expand</Link>
            </li>
            <li>
              <Link to="/rent">Rentals</Link>
            </li>
            <li>
              <Link to="/bookmarks">Bookmarks</Link>
            </li>
          </ul>
        </div>
        <div className={classes["right-container"]}>
          <ul>
            <li>
              <Link to="/admin">Admin</Link>
            </li>
            <li>
              <Link to="/profile">Profil</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/signup">Signup</Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Navigation;
