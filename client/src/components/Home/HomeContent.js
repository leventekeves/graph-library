import { useContext, useEffect, useState } from "react";

import AuthContext from "../../store/auth-context";
import classes from "./HomeContent.module.css";

const HomeContent = () => {
  const [data, setData] = useState(null);
  const authCtx = useContext(AuthContext);
  const welcomeContent = authCtx.isLoggedIn
    ? `Welcome, ${authCtx.name}!`
    : "Welcome!";

  useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  return (
    <div className={classes.home}>
      {welcomeContent}
      <div>{!data ? "Loading..." : "API check: " + data}</div>
    </div>
  );
};

export default HomeContent;
