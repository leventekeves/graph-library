import { useCallback, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import classes from "./BookItem.module.css";
import LoadingSpinner from "../../utility/LoadingSpinner";
import Button from "../Layout/Button";
import AuthContext from "../../store/auth-context";

async function getBooks(bookId) {
  const response = await fetch(
    `https://graph-library-kl-default-rtdb.europe-west1.firebasedatabase.app/Books/${bookId}.json`
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not fetch books.");
  }
  return data;
}

async function addBookToList(book) {
  await fetch(
    `https://graph-library-kl-default-rtdb.europe-west1.firebasedatabase.app/Lists/${book.listId}/books.json`,
    {
      method: "POST",
      body: JSON.stringify(book),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

async function removeBookFromList(listId, inListId) {
  await fetch(
    `https://graph-library-kl-default-rtdb.europe-west1.firebasedatabase.app/Lists/${listId}/books/${inListId}.json`,
    {
      method: "DELETE",
    }
  );
}

async function removeBorrow(bookId, userId, borrowingId, newStock) {
  await fetch(
    `https://graph-library-kl-default-rtdb.europe-west1.firebasedatabase.app/Users/${userId}/borrowings/${borrowingId}.json`,
    {
      method: "DELETE",
    }
  );
  await fetch(
    `https://graph-library-kl-default-rtdb.europe-west1.firebasedatabase.app/Books/${bookId}/stock.json`,
    {
      method: "PUT",
      body: JSON.stringify(newStock),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

async function extendBorrow(userId, borrowingId, borrowingUpdate) {
  await fetch(
    `https://graph-library-kl-default-rtdb.europe-west1.firebasedatabase.app/Users/${userId}/borrowings/${borrowingId}.json`,
    {
      method: "PUT",
      body: JSON.stringify(borrowingUpdate),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

const BookItem = (props) => {
  const [isRemoved, setIsRemoved] = useState(false);
  const [book, setBook] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [button, setButton] = useState("");
  const [buttonAlt, setButtonAlt] = useState("");
  const [borrowingIndex, setBorrowingIndex] = useState();
  const [remaining, setRemaining] = useState();
  const [extended, setExtended] = useState(false);

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

  useEffect(() => {
    if (props.location === "list") {
      getBooks(props.id).then((data) => {
        for (let i = 0; i < authCtx.borrowings.length; i++) {
          if (authCtx.borrowings[i].bookId === props.id) {
            setBorrowingIndex(i);
          }
        }

        if (authCtx.borrowings[borrowingIndex]) {
          let date = new Date(authCtx.borrowings[borrowingIndex].date);
          let formatedDate = formatDate(date);

          setBook({ id: props.id, ...data, expiration: formatedDate });
          setRemaining(authCtx.borrowings[borrowingIndex].remainingExtensions);
        } else {
          setBook({ id: props.id, ...data });
        }

        setIsLoading(false);
      });
    }
  }, [
    props.id,
    props.location,
    authCtx.borrowings,
    setBorrowingIndex,
    borrowingIndex,
  ]);

  const addBookToListHandler = useCallback(() => {
    addBookToList(props);
    const feedbackMessage = (
      <div className={classes["feedback-message"]}>Added!</div>
    );
    setButton(feedbackMessage);
  }, [props]);

  const removeBookFromListHandler = useCallback(() => {
    removeBookFromList(props.listId, props.inListId);
    setIsRemoved(true);
  }, [props.listId, props.inListId]);

  const returnBookHandler = useCallback(() => {
    let borrowingIndex;
    for (let i = 0; i < authCtx.borrowings.length; i++) {
      if (authCtx.borrowings[i].bookId === props.id) {
        borrowingIndex = i;
      }
    }

    removeBorrow(
      props.id,
      authCtx.id,
      authCtx.borrowings[borrowingIndex].id,
      +book.stock + 1
    );
    authCtx.borrowings.splice(borrowingIndex, borrowingIndex);

    setIsRemoved(true);
  }, [props.id, authCtx.id, authCtx.borrowings, book]);

  const extendBorrowHandler = useCallback(() => {
    let newDate = new Date(authCtx.borrowings[borrowingIndex].date);
    newDate.setDate(newDate.getDate() + 30);
    let newRemainingExtensions =
      +authCtx.borrowings[borrowingIndex].remainingExtensions - 1;

    extendBorrow(authCtx.id, authCtx.borrowings[borrowingIndex].id, {
      bookId: book.id,
      date: newDate,
      remainingExtensions: newRemainingExtensions,
    });

    let formatedDate = formatDate(newDate);

    setExtended(true);
    setBook({ ...book, expiration: formatedDate });
    setRemaining(newRemainingExtensions);
  }, [authCtx, book, borrowingIndex]);

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

  let miscContent = button;
  let expired;

  if (
    props.action === "borrow" &&
    !isLoading &&
    authCtx.borrowings[borrowingIndex]
  ) {
    const currentDate = new Date();
    const expirationDate = new Date(authCtx.borrowings[borrowingIndex].date);

    if (currentDate > expirationDate) {
      expired = true;
    } else {
      expired = false;
    }

    let extendContent = (
      <div className={classes["button-container"]}>
        <div>{buttonAlt}</div>
        <div>Remaining Extensions: {remaining}</div>
      </div>
    );

    if (expired) {
      extendContent = <div>EXPIRED!</div>;
    }
    if (+authCtx.borrowings[borrowingIndex].remainingExtensions <= 0) {
      extendContent = <div>NO EXTENSION LEFT!</div>;
    }
    if (extended) {
      extendContent = <div>EXTENDED</div>;
    }

    miscContent = (
      <div className={classes["misc-container"]}>
        <div className={classes["button-container"]}>
          <div>{button}</div>
          <div> Borrowed until: {book.expiration}</div>
        </div>
        <div>{extendContent}</div>
      </div>
    );
  }

  if (props.location === "list") {
    if (!isLoading) {
      let rating = "No ratings yet!";
      let ratingSum = 0;
      let numberOfRatings = 0;
      if (book.ratings) {
        for (const key in book.ratings) {
          const ratingObj = {
            ...book.ratings[key],
          };
          ratingSum += +ratingObj.rating;
          numberOfRatings++;
        }
        rating = (ratingSum / numberOfRatings).toFixed(2);
      }
      if (!isRemoved) {
        return (
          <div className={classes.container}>
            <Link to={`/books/${book.id}`} style={{ textDecoration: "none" }}>
              <div className={classes["book-item"]}>
                <div>
                  <img className={classes.cover} src={book.cover} alt="cover" />
                </div>
                <div>
                  <div>{book.title}</div>
                  <div>{book.author}</div>
                  <div>{book.pages} pages</div>
                  <div>{book.category}</div>
                  <div>Released in {book.year}</div>
                  <div>Rating: {rating}</div>
                </div>
              </div>
            </Link>
            {miscContent}
          </div>
        );
      } else {
        return <div></div>;
      }
    } else {
      return <LoadingSpinner />;
    }
  } else {
    let rating = "No ratings yet!";
    let ratingSum = 0;
    let numberOfRatings = 0;
    if (props.ratings) {
      for (const key in props.ratings) {
        const ratingObj = {
          ...props.ratings[key],
        };
        ratingSum += +ratingObj.rating;
        numberOfRatings++;
      }
      rating = (ratingSum / numberOfRatings).toFixed(2);
    }

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
                <div>Rating: {rating}</div>
              </div>
            </div>
          </Link>
          {button}
        </div>
      );
    } else {
      return <div></div>;
    }
  }
};

export default BookItem;
