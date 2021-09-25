import { Fragment, useState } from "react";

import BooksContent from "../Books/BooksContent";
import ListSelector from "./ListSelector";
import classes from "./AddBookToList.module.css";

const AddBookToList = () => {
  const [bookContent, setBookContent] = useState(<div></div>);

  const onListSelectHandler = (value) => {
    setBookContent(<BooksContent listId={value} action="add" />);
  };

  return (
    <Fragment>
      <div className={classes.container}>
        <div className={classes.selector}>
          <label className={classes["choose-list"]}>Choose a list:</label>
          <ListSelector onListSelect={onListSelectHandler} />
        </div>
      </div>
      <div>{bookContent}</div>
    </Fragment>
  );
};

export default AddBookToList;
