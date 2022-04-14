import { Fragment, useContext } from "react";
import { useHistory, useLocation } from "react-router-dom";

import classes from "./ListsContent.module.css";
import BrowseLists from "./BrowseLists";
import AddBookToList from "./AddBookToList";
import NewList from "./NewList";
import RemoveBookFromList from "./RemoveBookFromList";
import SubNavigation from "../Layout/SubNavigation";
import AuthContext from "../../store/auth-context";
import Button from "../Layout/Button";
import DeleteList from "./DeleteList";

const ListsContent = () => {
  const history = useHistory();
  const location = useLocation();
  const authCtx = useContext(AuthContext);

  const queryParams = new URLSearchParams(location.search);

  const changeFunctionHandler = (props) => {
    history.push("/lists?function=" + props.target.value);
  };

  let content;
  let subNavigation = (
    <SubNavigation location={[{ name: "Lists", link: "" }]} />
  );

  if (queryParams.get("function") === "browse") {
    content = <BrowseLists />;
    subNavigation = (
      <SubNavigation
        location={[
          { name: "Lists", link: "/lists" },
          { name: "Browse Lists", link: "" },
        ]}
      />
    );
  }

  if (authCtx.isLoggedIn) {
    if (queryParams.get("function") === "new") {
      content = <NewList />;
      subNavigation = (
        <SubNavigation
          location={[
            { name: "Lists", link: "/lists" },
            { name: "New List", link: "" },
          ]}
        />
      );
    }

    if (queryParams.get("function") === "delete") {
      content = <DeleteList />;
      subNavigation = (
        <SubNavigation
          location={[
            { name: "Lists", link: "/lists" },
            { name: "Delete List", link: "" },
          ]}
        />
      );
    }

    if (queryParams.get("function") === "add") {
      content = <AddBookToList />;
      subNavigation = (
        <SubNavigation
          location={[
            { name: "Lists", link: "/lists" },
            { name: "Add Book To List", link: "" },
          ]}
        />
      );
    }

    if (queryParams.get("function") === "remove") {
      content = <RemoveBookFromList />;
      subNavigation = (
        <SubNavigation
          location={[
            { name: "Lists", link: "/lists" },
            { name: "Remove Book From List", link: "" },
          ]}
        />
      );
    }
  }

  if (!authCtx.isLoggedIn && !(queryParams.get("function") === "browse")) {
    content = (
      <div className={classes["error-message"]}>
        Without logging in, you can only use the "Browse Lists" feature!
      </div>
    );
  }

  return (
    <Fragment>
      {subNavigation}
      <div className={classes["list-panel"]}>
        <Button value={"browse"} onClick={changeFunctionHandler}>
          Browse Lists
        </Button>
        <Button value={"new"} onClick={changeFunctionHandler}>
          New List
        </Button>
        <Button value={"delete"} onClick={changeFunctionHandler}>
          Delete List
        </Button>
        <Button value={"add"} onClick={changeFunctionHandler}>
          Add Books To List
        </Button>
        <Button value={"remove"} onClick={changeFunctionHandler}>
          Remove Book From List
        </Button>
      </div>
      {content}
    </Fragment>
  );
};

export default ListsContent;
