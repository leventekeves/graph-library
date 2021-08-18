import { Fragment } from "react";
import classes from "./ListsContent.module.css";
import BrowseLists from "./BrowseLists";
import AddBookToList from "./AddBookToList";
import NewList from "./NewList";
import { useHistory, useLocation } from "react-router-dom";
import RemoveBookFromList from "./RemoveBookFromList";
import SubNavigation from "../Layout/SubNavigation";

const ListsContent = () => {
  const history = useHistory();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);

  const changeSortHangler = (props) => {
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

  return (
    <Fragment>
      {subNavigation}
      <div className={classes["admin-panel"]}>
        <button
          value={"browse"}
          className={classes["admin-button"]}
          onClick={changeSortHangler}
        >
          Browse Lists
        </button>
        <button
          value={"new"}
          className={classes["admin-button"]}
          onClick={changeSortHangler}
        >
          New List
        </button>
        <button
          value={"add"}
          className={classes["admin-button"]}
          onClick={changeSortHangler}
        >
          Add Books To List
        </button>
        <button
          value={"remove"}
          className={classes["admin-button"]}
          onClick={changeSortHangler}
        >
          Remove Book From List
        </button>
      </div>
      {content}
    </Fragment>
  );
};

export default ListsContent;
