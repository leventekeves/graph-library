import { Fragment, useState } from "react";
import classes from "./ListsContent.module.css";
import BrowseLists from "./BrowseLists";
import AddBookToList from "./AddBookToList";
import NewList from "./NewList";

const ListsContent = () => {
  const [listFunction, setListFunction] = useState("List Page");

  const loadBrowseListsFunction = () => {
    setListFunction("Browse Lists");
  };

  const loadNewListFunction = () => {
    setListFunction("New List");
  };

  const loadModifyList = () => {
    setListFunction("Add Books To List");
  };

  let content;

  if (listFunction === "Browse Lists") {
    content = <BrowseLists />;
  }
  if (listFunction === "New List") {
    content = <NewList />;
  }
  if (listFunction === "Add Books To List") {
    content = <AddBookToList />;
  }

  return (
    <Fragment>
      <div className={classes["admin-panel"]}>
        <button
          className={classes["admin-button"]}
          onClick={loadBrowseListsFunction}
        >
          Browse Lists
        </button>
        <button
          className={classes["admin-button"]}
          onClick={loadNewListFunction}
        >
          New List
        </button>
        <button className={classes["admin-button"]} onClick={loadModifyList}>
          Add Books To List
        </button>
      </div>
      {content}
    </Fragment>
  );
};

export default ListsContent;
