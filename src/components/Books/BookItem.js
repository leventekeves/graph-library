import classes from "./BookItem.module.css";
import { Link } from "react-router-dom";
import { useState } from "react";

const BookItem = (props) => {
  const [isRemoved, setIsRemoved] = useState(false);

  async function addBookToList(book) {
    await fetch(
      `https://graph-library-kl-default-rtdb.europe-west1.firebasedatabase.app/Lists/${props.listId}/books.json`,
      {
        method: "POST",
        body: JSON.stringify(book),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  async function removeBookFromList(book) {
    await fetch(
      `https://graph-library-kl-default-rtdb.europe-west1.firebasedatabase.app/Lists/${props.listId}/books/${props.inListId}.json`,
      {
        method: "DELETE",
      }
    );
  }

  const addBookToListHandler = () => {
    addBookToList(props);
  };

  const removeBookFromListHandler = () => {
    removeBookFromList(props);
    setIsRemoved(true);
  };

  let button = "";
  if (props.action === "add")
    button = (
      <button className={classes.add} onClick={addBookToListHandler}>
        ADD
      </button>
    );
  if (props.action === "remove")
    button = (
      <button className={classes.add} onClick={removeBookFromListHandler}>
        REMOVE
      </button>
    );

  if (!isRemoved) {
    return (
      <div className={classes.container}>
        <Link
          replace
          to={`/books/${props.id}`}
          style={{ textDecoration: "none" }}
        >
          <div className={classes["book-item"]}>
            <div>{props.title}</div>
            <div>{props.author}</div>
            <div>{props.pages} pages</div>
            <div>{props.category}</div>
            <div>Released in {props.year}</div>
          </div>
        </Link>
        {button}
      </div>
    );
  } else {
    return <div></div>;
  }
};

export default BookItem;
