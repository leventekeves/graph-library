import { Fragment, useEffect, useState } from "react";

import ListSelector from "./ListSelector";
import classes from "./AddBookToList.module.css";
import ListCard from "./ListCard";

const RemoveBookFromList = () => {
  const [bookContent, setBookContent] = useState(<div></div>);
  const [selectedList, setSelectedList] = useState();

  const onListSelectHandler = (value) => {
    if (selectedList !== "Select list") {
      setSelectedList(value);
    }
  };

  useEffect(() => {
    let isActive = true;

    if (selectedList && isActive) {
      setBookContent(<ListCard listId={selectedList} action="remove" />);
    }

    return () => {
      isActive = false;
    };
  }, [selectedList]);

  return (
    <Fragment>
      <div className={classes.container}>
        <div className={classes.selector}>
          <label className={classes["choose-list"]}>Choose a list:</label>
          <ListSelector onListSelect={onListSelectHandler} />
        </div>
      </div>
      <div className={classes.container}>{bookContent}</div>
    </Fragment>
  );
};

export default RemoveBookFromList;
