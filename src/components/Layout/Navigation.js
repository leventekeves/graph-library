import { Link } from "react-router-dom";

import classes from "./Navigaton.module.css";

const Navigation = () => {
  return (
    <header className={classes.header}>
      <nav className={classes.container}>
        <div className={classes["left-container"]}>
          <ul>
            <li>
              <Link to="/">Főoldal</Link>
            </li>
            <li>
              <Link to="/books">Könyvek</Link>
            </li>
            <li>
              <Link to="/lists">Listák</Link>
            </li>
            <li>
              <Link to="/expand">Bővítés</Link>
            </li>
            <li>
              <Link to="/rent">Kölcsönzések</Link>
            </li>
            <li>
              <Link to="/bookmarks">Könyvjelzők</Link>
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
              <Link to="/login">Bejelentkezés</Link>
            </li>
            <li>
              <Link to="/signup">Regisztrálás</Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Navigation;
