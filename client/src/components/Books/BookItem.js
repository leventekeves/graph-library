import { useCallback, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import classes from "./BookItem.module.css";
import Button from "../Layout/Button";
import AuthContext from "../../store/auth-context";

async function addBookToList(listId, bookId) {
  await fetch(`/list/book`, {
    method: "POST",
    body: JSON.stringify({ listId: listId, bookId: bookId }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

async function removeBookFromList(listId, bookId) {
  await fetch(`/list/book`, {
    method: "DELETE",
    body: JSON.stringify({ listId: listId, bookId: bookId }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

async function removeBorrow(bookId, userId) {
  await fetch(`/borrow`, {
    method: "DELETE",
    body: JSON.stringify({ bookId: bookId, userId: userId }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

async function extendBorrow(userId, bookId, newDate) {
  await fetch(`/borrow/extend`, {
    method: "POST",
    body: JSON.stringify({ userId: userId, bookId: bookId, newDate: newDate }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

const BookItem = (props) => {
  const [isRemoved, setIsRemoved] = useState(false);
  const [book, setBook] = useState();
  const [button, setButton] = useState("");
  const [buttonAlt, setButtonAlt] = useState("");
  const [extended, setExtended] = useState(false);
  const [miscContent, setMiscContent] = useState(button);

  const authCtx = useContext(AuthContext);

  const formatDate = (date) => {
    let formatedDate;

    //prettier-ignore
    const monthNames = ["January", "February", "March", "April", "May", "June",
              "July", "August", "September", "October", "November", "December"];

    formatedDate =
      "" +
      date.getDate() +
      " " +
      monthNames[date.getMonth()] +
      " " +
      date.getFullYear() +
      ", " +
      date.getHours() +
      ":" +
      ((date.getMinutes() < 10 ? "0" : "") + date.getMinutes());

    return formatedDate;
  };

  const addBookToListHandler = useCallback(() => {
    addBookToList(props.listId, props.id);
    const feedbackMessage = (
      <div className={classes["feedback-message"]}>Added!</div>
    );
    setButton(feedbackMessage);
  }, [props]);

  const removeBookFromListHandler = useCallback(() => {
    removeBookFromList(props.listId, props.id);
    setIsRemoved(true);
  }, [props.listId, props.id]);

  const returnBookHandler = useCallback(() => {
    let borrowingIndex;
    for (let i = 0; i < authCtx.borrowings.length; i++) {
      if (authCtx.borrowings[i].bookId === props.id) {
        borrowingIndex = i;
      }
    }

    removeBorrow(props.id, authCtx.id);
    authCtx.borrowings.splice(borrowingIndex, borrowingIndex);

    setIsRemoved(true);
  }, [props.id, authCtx.id, authCtx.borrowings]);

  const extendBorrowHandler = useCallback(() => {
    let newDate = new Date(props.date);
    newDate.setDate(newDate.getDate() + 30);

    extendBorrow(authCtx.id, props.id, newDate);
    let formatedDate = formatDate(newDate);

    setExtended(true);
    setBook({ ...book, expiration: formatedDate });
  }, [authCtx, book, props]);

  useEffect(() => {
    if (props.action === "add")
      setButton(
        <Button className={classes.add} onClick={addBookToListHandler}>
          ADD
        </Button>
      );
    if (props.action === "remove")
      setButton(
        <Button className={classes.add} onClick={removeBookFromListHandler}>
          REMOVE
        </Button>
      );
    if (props.action === "borrow")
      setButton(
        <Button className={classes.add} onClick={returnBookHandler}>
          RETURN
        </Button>
      );
    if (props.action === "borrow")
      setButtonAlt(
        <Button className={classes.add} onClick={extendBorrowHandler}>
          EXTEND
        </Button>
      );
  }, [
    addBookToListHandler,
    removeBookFromListHandler,
    returnBookHandler,
    extendBorrowHandler,
    props.action,
  ]);

  useEffect(() => {
    let expired;

    if (props.action === "borrow") {
      const currentDate = new Date();
      const expirationDate = new Date(props.date);

      if (currentDate > expirationDate) {
        expired = true;
      } else {
        expired = false;
      }

      let extendContent = (
        <div className={classes["button-container"]}>
          <div>{buttonAlt}</div>
          <div>Remaining Extensions: {props.remainingExtensions}</div>
        </div>
      );

      if (expired) {
        extendContent = <div>EXPIRED!</div>;
      }
      if (+props.remainingExtensions <= 0) {
        extendContent = <div>NO EXTENSION LEFT!</div>;
      }
      if (extended) {
        extendContent = <div>EXTENDED</div>;
      }

      setMiscContent(
        <div className={classes["misc-container"]}>
          <div className={classes["button-container"]}>
            <div>{button}</div>
            <div> Borrowed until: {props.date}</div>
          </div>
          <div>{extendContent}</div>
        </div>
      );
    }
  }, [
    button,
    buttonAlt,
    extended,
    props.action,
    props.date,
    props.remainingExtensions,
  ]);

  if (!isRemoved) {
    return (
      <div className={classes.container}>
        <Link to={`/books/${props.id}`} style={{ textDecoration: "none" }}>
          <div className={classes["book-item"]}>
            <div>
              <img className={classes.cover} src={props.cover} alt="cover" />
            </div>
            <div>
              <div>{props.title}</div>
              <div>{props.author}</div>
              <div>{props.pages} pages</div>
              <div>{props.category}</div>
              <div>Released in {props.year}</div>
              <div>Rating: {props.rating || "No Ratings Yet!"}</div>
            </div>
          </div>
        </Link>
        {props.action === "borrow" ? miscContent : button}
      </div>
    );
  } else {
    return <div></div>;
  }
};

export default BookItem;
