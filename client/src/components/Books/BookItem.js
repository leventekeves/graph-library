import { useCallback, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import classes from "./BookItem.module.css";
import Button from "../Layout/Button";
import AuthContext from "../../store/auth-context";
import noCover from "../../utility/nocover.png";

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

async function removeBookmark(bookId, userId) {
  await fetch(`/bookmarks`, {
    method: "DELETE",
    body: JSON.stringify({ bookId, userId }),
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
    props.onDelete(true);

    const updatedBorrowings = authCtx.borrowings;
    updatedBorrowings.splice(borrowingIndex, 1);
    authCtx.updateBorrowings(updatedBorrowings);

    setIsRemoved(true);
  }, [authCtx, props]);

  const extendBorrowHandler = useCallback(() => {
    let newDate = new Date(props.date);
    newDate.setDate(newDate.getDate() + 30);

    extendBorrow(authCtx.id, props.id, newDate);
    let formatedDate = formatDate(newDate);

    setExtended(true);
    setBook({ ...book, expiration: formatedDate });
  }, [authCtx, book, props]);

  const removeBookmarkHandler = useCallback(() => {
    const bookmarksArray = authCtx.bookmarks.map((bookmark) => {
      return bookmark.id;
    });

    const removeIndex = bookmarksArray.findIndex((bookmarkId) => {
      return +bookmarkId === +props.id;
    });

    removeBookmark(props.id, authCtx.id);

    const updatedBookmarks = authCtx.bookmarks;
    updatedBookmarks.splice(removeIndex, 1);
    authCtx.updateBookmarks(updatedBookmarks);
    setIsRemoved(true);
  }, [authCtx, props.id]);

  useEffect(() => {
    if (props.action === "add") {
      setButton(
        <Button className={classes.add} onClick={addBookToListHandler}>
          ADD
        </Button>
      );
    }
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
    if (props.action === "bookmark") {
      setButton(
        <Button className={classes.add} onClick={removeBookmarkHandler}>
          REMOVE
        </Button>
      );
    }
  }, [
    addBookToListHandler,
    removeBookFromListHandler,
    returnBookHandler,
    extendBorrowHandler,
    removeBookmarkHandler,
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
        expirationDate.setDate(expirationDate.getDate() + 30);
      }

      setMiscContent(
        <div className={classes["misc-container"]}>
          <div className={classes["button-container"]}>
            <div>{button}</div>
            <div> Borrowed until: {expirationDate.toLocaleDateString()}</div>
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

  useEffect(() => {
    if (props.action === "history") {
      const borrowDate = new Date(props.date);
      setMiscContent(
        <div className={classes["misc-container"]}>
          <div> Borrowed at: {borrowDate.toLocaleDateString()}</div>
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
        <Link
          to={`/books/${props.action === "history" ? props.realId : props.id}`}
          style={{ textDecoration: "none" }}
        >
          <div className={classes["book-item"]}>
            <div>
              {props.cover === "https://undefined" ? (
                <img className={classes.cover} src={noCover} alt="noCover" />
              ) : (
                <img className={classes.cover} src={props.cover} alt="cover" />
              )}
            </div>
            <div>
              <div>{props.title}</div>
              <div>{props.author}</div>
              <div>{props.pages} pages</div>
              <div>{props.category}</div>
              <div>Released in {props.year}</div>
              <div>Rating: {props.rating?.toFixed(2) || "No Ratings Yet!"}</div>
            </div>
          </div>
        </Link>
        {props.action === "borrow" || props.action === "history"
          ? miscContent
          : button}
      </div>
    );
  } else {
    return <div></div>;
  }
};

export default BookItem;
