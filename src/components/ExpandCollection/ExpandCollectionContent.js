import { Fragment, useContext } from "react";
import { useHistory, useLocation } from "react-router";

import AuthContext from "../../store/auth-context";
import Button from "../Layout/Button";
import SubNavigation from "../Layout/SubNavigation";
import ExpandCollectionAdd from "./ExpandCollectionAdd";
import classes from "./ExpandCollectionContent.module.css";
import ExpandCollectionVote from "./ExpandCollectionVote";

const ExpandCollectionContent = () => {
  const history = useHistory();
  const location = useLocation();
  const authCtx = useContext(AuthContext);

  const queryParams = new URLSearchParams(location.search);

  const changeSortHangler = (props) => {
    history.push("/expand?function=" + props.target.value);
  };

  let content;
  let subNavigation = (
    <SubNavigation location={[{ name: "Expand", link: "" }]} />
  );

  if (queryParams.get("function") === "add") {
    content = <ExpandCollectionAdd />;
    subNavigation = (
      <SubNavigation
        location={[
          { name: "Expand", link: "/expand" },
          { name: "Add", link: "" },
        ]}
      />
    );
  }

  if (authCtx.isLoggedIn) {
    if (queryParams.get("function") === "vote") {
      content = <ExpandCollectionVote />;
      subNavigation = (
        <SubNavigation
          location={[
            { name: "Expand", link: "/expand" },
            { name: "Vote", link: "" },
          ]}
        />
      );
    }
  }

  if (!authCtx.isLoggedIn) {
    content = (
      <div className={classes["error-message"]}>
        You must login in to use this feature!
      </div>
    );
  }

  return (
    <Fragment>
      {subNavigation}
      <div className={classes["expand-panel"]}>
        <Button value={"add"} onClick={changeSortHangler}>
          Add
        </Button>
        <Button value={"vote"} onClick={changeSortHangler}>
          Vote
        </Button>
      </div>
      {content}
    </Fragment>
  );
};

export default ExpandCollectionContent;
