import { useState } from "react";

import ListSelector from "./ListSelector";
import classes from "./DeleteList.module.css";
import Button from "../Layout/Button";

async function deleteList(listId) {
  await fetch(`/list`, {
    method: "DELETE",
    body: JSON.stringify({ listId: listId }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

const DeleteList = () => {
  const [isSelected, setIsSelected] = useState(false);
  const [listId, setListId] = useState();
  const [isDeleted, setIsDeleted] = useState(false);

  const onListSelectHandler = (value) => {
    if (value !== "Select list") {
      setListId(value);
      setIsSelected(true);
    } else {
      setIsSelected(false);
    }
  };

  const deleteListHandler = () => {
    deleteList(listId);
    setIsDeleted(true);
  };

  let content = (
    <div className={classes.container}>
      <div className={classes.selector}>
        <label className={classes["choose-list"]}>Choose a list:</label>
        <ListSelector onListSelect={onListSelectHandler} />
      </div>
      {isSelected ? (
        <div className={classes.button}>
          <Button onClick={deleteListHandler}>Delete</Button>
        </div>
      ) : (
        <div> </div>
      )}
    </div>
  );

  if (isDeleted) {
    content = <div className={classes["delete-message"]}>List Deleted!</div>;
  }

  return content;
};

export default DeleteList;
