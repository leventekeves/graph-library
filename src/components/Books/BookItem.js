import classes from "./BookItem.module.css";
import { Link } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import LoadingSpinner from "../utility/LoadingSpinner";
import Button from "../Layout/Button";

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

const BookItem = (props) => {
  const [isRemoved, setIsRemoved] = useState(false);
  const [book, setBook] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [button, setButton] = useState("");

  useEffect(() => {
    if (props.location === "list") {
      getBooks(props.id).then((data) => {
        setBook({ id: props.id, ...data });
        setIsLoading(false);
      });
    }
  }, [props.id, props.location]);

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
  }, [addBookToListHandler, removeBookFromListHandler, props.action]);

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
          ratingSum += +ratingObj[0];
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
            {button}
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
        ratingSum += +ratingObj[0];
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
