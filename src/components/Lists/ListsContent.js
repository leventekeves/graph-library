import { Fragment } from "react";
import classes from "./ListsContent.module.css";
import BrowseLists from "./BrowseLists";
import AddBookToList from "./AddBookToList";
import NewList from "./NewList";
import { useHistory, useLocation } from "react-router-dom";
import RemoveBookFromList from "./RemoveBookFromList";

const ListsContent = () => {
  const history = useHistory();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);

  const changeSortHangler = (props) => {
    history.push("/lists?function=" + props.target.value);
  };

  let content;

  if (queryParams.get("function") === "browse") {
    content = <BrowseLists />;
  }
  if (queryParams.get("function") === "new") {
    content = <NewList />;
  }
  if (queryParams.get("function") === "add") {
    content = <AddBookToList />;
  }
  if (queryParams.get("function") === "remove") {
    content = <RemoveBookFromList />;
  }

  return (
    <Fragment>
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
