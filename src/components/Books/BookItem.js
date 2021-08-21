import classes from "./BookItem.module.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import LoadingSpinner from "../utility/LoadingSpinner";

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

const BookItem = (props) => {
  const [isRemoved, setIsRemoved] = useState(false);
  const [book, setBook] = useState();
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    if (props.location === "list") {
      getBooks(props.id).then((data) => {
        setBook(data);
        setIsLoading(false);
      });
    }
  }, [props.id, props.location]);

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
