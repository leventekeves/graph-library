import { NavLink } from "react-router-dom";

import classes from "./SubNavigation.module.css";

const SubNavigation = (props) => {
  const content = props.location.map((location) => {
    return (
      <div key={location.name}>
        {"> "}
        {location.link ? (
          <NavLink to={location.link} className={classes.link}>
            {location.name}
          </NavLink>
        ) : (
          location.name
        )}
      </div>
    );
  });

  content.unshift(
    <div key={"home"}>
      <NavLink to="/" className={classes.link}>
        Home
      </NavLink>
    </div>
  );
  return <div className={classes.container}>{content}</div>;
};

export default SubNavigation;
