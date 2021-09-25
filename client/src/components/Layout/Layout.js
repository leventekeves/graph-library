import { Fragment } from "react";

import classes from "./Layout.module.css";
import Navigation from "./Navigation";

const Layout = (props) => {
  return (
    <Fragment>
      <Navigation />
      <div className={classes.container}>{props.children}</div>
    </Fragment>
  );
};

export default Layout;
