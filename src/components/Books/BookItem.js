import classes from "./BookItem.module.css";
import { Link } from "react-router-dom";

const BookItem = (props) => {
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

  const addBookToListHandler = () => {
    addBookToList(props);
  };

  let addButton = "";
  if (props.listId) {
    addButton = (
      <button className={classes.add} onClick={addBookToListHandler}>
        ADD
      </button>
    );
  }

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
      {addButton}
    </div>
  );
};

export default BookItem;
