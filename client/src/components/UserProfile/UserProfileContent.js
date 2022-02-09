import { Fragment, useContext } from "react";
import { useHistory, useLocation } from "react-router-dom";

import classes from "./UserProfileContent.module.css";
import UserBorrowingHistory from "./UserBorrowingHistory";
import ChangeUserData from "./ChangeUserData";
import SubNavigation from "../Layout/SubNavigation";
import AuthContext from "../../store/auth-context";
import Button from "../Layout/Button";

const UserProfileContent = () => {
  const history = useHistory();
  const location = useLocation();
  const authCtx = useContext(AuthContext);

  const queryParams = new URLSearchParams(location.search);

  const changeFunctionHandler = (props) => {
    history.push("/profile?function=" + props.target.value);
  };

  let content;
  let subNavigation = (
    <SubNavigation location={[{ name: "Profile", link: "" }]} />
  );

  if (authCtx.isLoggedIn) {
    if (queryParams.get("function") === "history") {
      content = <UserBorrowingHistory />;
      subNavigation = (
        <SubNavigation
          location={[
            { name: "Profile", link: "/profile" },
            { name: "History", link: "" },
          ]}
        />
      );
    }

    if (queryParams.get("function") === "changeUserData") {
      content = <ChangeUserData />;
      subNavigation = (
        <SubNavigation
          location={[
            { name: "Profile", link: "/profile" },
            { name: "Change User Data", link: "" },
          ]}
        />
      );
    }
  }

  return (
    <Fragment>
      {subNavigation}
      <div className={classes["options-panel"]}>
        <Button value={"history"} onClick={changeFunctionHandler}>
          History
        </Button>
        <Button value={"changeUserData"} onClick={changeFunctionHandler}>
          Change User Data
        </Button>
      </div>
      {content}
    </Fragment>
  );
};

export default UserProfileContent;
