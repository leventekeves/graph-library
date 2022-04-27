import { useContext } from "react";

import AuthContext from "../../store/auth-context";
import classes from "./HomeContent.module.css";

const HomeContent = () => {
  const authCtx = useContext(AuthContext);

  const welcomeContent = authCtx.isLoggedIn
    ? `Welcome, ${authCtx.name}!`
    : "Welcome!";

  return <div className={classes.home}>{welcomeContent}</div>;
};

export default HomeContent;
