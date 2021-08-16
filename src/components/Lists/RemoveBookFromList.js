import { Fragment, useState } from "react";

import ListSelector from "./ListSelector";
import classes from "./AddBookToList.module.css";
import ListCard from "./ListCard";

const RemoveBookFromList = () => {
  const [bookContent, setBookContent] = useState(<div></div>);

  const onListSelectHandler = (value) => {
    setBookContent(<ListCard listId={value} action="remove" />);
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

export default RemoveBookFromList;
