import { useContext } from "react";
import { Link, useHistory } from "react-router-dom";

import classes from "./Navigaton.module.css";
import AuthContext from "../../store/auth-context";

const Navigation = () => {
  const authCtx = useContext(AuthContext);
  const history = useHistory();

  const onLogoutHandler = () => {
    authCtx.logout();
    history.replace("/");
  };

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
              <Link to="/borrowings">Borrowings</Link>
            </li>
            <li>
              <Link to="/bookmarks">Bookmarks</Link>
            </li>
          </ul>
        </div>
        <div className={classes["right-container"]}>
          <ul>
            {authCtx.isLoggedIn && authCtx.access === "admin" && (
              <li>
                <Link to="/admin">Admin</Link>
              </li>
            )}

            {authCtx.isLoggedIn && (
              <li>
                <Link to="/profile">Profile</Link>
              </li>
            )}

            {!authCtx.isLoggedIn && (
              <li>
                <Link to="/login">Login</Link>
              </li>
            )}

            {!authCtx.isLoggedIn && (
              <li>
                <Link to="/signup">Signup</Link>
              </li>
            )}

            {authCtx.isLoggedIn && (
              <button onClick={onLogoutHandler} className={classes.button}>
                Logout
              </button>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Navigation;
