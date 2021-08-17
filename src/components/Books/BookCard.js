import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import CommentList from "../Comments/CommentList";
import NewComment from "../Comments/NewComment";
import LoadingSpinner from "../utility/LoadingSpinner";
import classes from "./BookCard.module.css";

const BookCard = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState([]);
  const [newCommentAdded, setNewCommentAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRented, setIsRented] = useState(false);

  const fetchBooksHandler = useCallback(async () => {
    const response = await fetch(
      `https://graph-library-kl-default-rtdb.europe-west1.firebasedatabase.app/Books/${bookId}.json`
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Could not fetch the book.");
    }

    setBook(data);
    setIsLoading(false);
  }, [bookId]);

  useEffect(() => {
    fetchBooksHandler();
  }, [fetchBooksHandler]);

  const newCommentAddedHandler = (value) => {
    setNewCommentAdded(value);
  };

  const onRentHandler = () => {
    setIsRented(true);
  };

  const rentContent = isRented ? (
    <div className={classes["rent-message"]}>Book Rented!</div>
  ) : (
    <button className={classes["rent-button"]} onClick={onRentHandler}>
      Rent
    </button>
  );

  if (isLoading) {
    return (
      <div className={classes.center}>
        <LoadingSpinner />
      </div>
    );
  }
  if (book) {
    return (
      <div className={classes.container}>
        <div className={classes["book-container"]}>
          <div>
            {book.cover ? (
              <img
                className={classes["book-cover"]}
                src={book.cover}
                alt="cover"
              />
            ) : (
              ""
            )}
          </div>
          <div className={classes["book-details"]}>
            <div className={classes.title}>{book.title}</div>
            <div className={classes.author}>by {book.author}</div>
            <div className={classes.description}>{book.description}</div>
            <div className={classes.pages}>Pages: {book.pages}</div>
            <div className={classes.category}>Categeory: {book.category}</div>
            <div className={classes.year}>Release year: {book.year}</div>
            <div className={classes.stock}>In stock: {book.stock}</div>
            <div className={classes["rent-container"]}>{rentContent}</div>
          </div>
        </div>
        <NewComment
          currentBook={bookId}
          onNewComment={newCommentAddedHandler}
        />
        <CommentList
          currentBook={bookId}
          newCommentAdded={newCommentAdded}
          onNewComment={newCommentAddedHandler}
        />
      </div>
    );
  } else {
    return <div className={classes["not-found"]}>Book Not Found!</div>;
  }
};

export default BookCard;
