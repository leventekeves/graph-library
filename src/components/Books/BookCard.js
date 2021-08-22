import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AuthContext from "../../store/auth-context";

import CommentList from "../Comments/CommentList";
import NewComment from "../Comments/NewComment";
import Button from "../Layout/Button";
import SubNavigation from "../Layout/SubNavigation";
import LoadingSpinner from "../utility/LoadingSpinner";
import classes from "./BookCard.module.css";

async function getBooks(bookId) {
  const response = await fetch(
    `https://graph-library-kl-default-rtdb.europe-west1.firebasedatabase.app/Books/${bookId}.json`
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not fetch the book.");
  }
  return data;
}

async function addRateHandler(bookId, rating) {
  await fetch(
    `https://graph-library-kl-default-rtdb.europe-west1.firebasedatabase.app/Books/${bookId}/ratings.json`,
    {
      method: "POST",
      body: JSON.stringify(rating),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

const BookCard = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState([]);
  const [newCommentAdded, setNewCommentAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRented, setIsRented] = useState(false);
  const [rating, setRating] = useState("");
  const [isRated, setisRated] = useState(false);

  const authCtx = useContext(AuthContext);

  useEffect(() => {
    getBooks(bookId).then((data) => {
      setBook(data);
      setIsLoading(false);
    });
  }, [bookId]);

  const newCommentAddedHandler = (value) => {
    setNewCommentAdded(value);
  };

  const onRentHandler = () => {
    setIsRented(true);
  };

  const onRateHandler = (event) => {
    if (isFinite(event.target.value)) {
      addRateHandler(book.id, event.target.value);
      setisRated(true);
      calcRate(event.target.value);
    }
  };

  const rentContent = isRented ? (
    <div className={classes["feedback-message"]}>Book Rented!</div>
  ) : (
    <Button onClick={onRentHandler}>Rent</Button>
  );

  const rateSelector = (
    <select
      className={classes["rate-select"]}
      onChange={onRateHandler}
      defaultValue={"Rate"}
    >
      <option key={"Rate"} value={"Rate"}>
        Rate
      </option>
      <option key={1} value={1}>
        1
      </option>
      <option key={2} value={2}>
        2
      </option>
      <option key={3} value={3}>
        3
      </option>
      <option key={4} value={4}>
        4
      </option>
      <option key={5} value={5}>
        5
      </option>
    </select>
  );

  const calcRate = useCallback(
    (newRating) => {
      let ratingSum = 0;
      let numberOfRatings = 0;
      if (newRating) {
        ratingSum += +newRating;
        numberOfRatings++;
      }

      if (!isLoading && book && book.ratings) {
        for (const key in book.ratings) {
          const ratingObj = {
            ...book.ratings[key],
          };
          ratingSum += +ratingObj[0];
          numberOfRatings++;
        }
      }
      setRating((ratingSum / numberOfRatings).toFixed(2));
    },
    [book, isLoading]
  );

  useEffect(() => {
    calcRate();
  }, [calcRate]);

  const rateContent = isRated ? (
    <div className={classes["feedback-message"]}>Rated!</div>
  ) : (
    <div>Rate: {rateSelector}</div>
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
      <Fragment>
        <SubNavigation
          location={[
            { name: "Books", link: "/books" },
            { name: `${book.title}`, link: "" },
          ]}
        />
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
              <div className={classes.rating}>Rating: {rating}</div>
              <div className={classes.stock}>In stock: {book.stock}</div>
              {authCtx.isLoggedIn ? (
                <div className={classes.rate}>{rateContent}</div>
              ) : (
                <div className={classes["feedback-message"]}>
                  Login to rate!
                </div>
              )}

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
      </Fragment>
    );
  } else {
    return <div className={classes["not-found"]}>Book Not Found!</div>;
  }
};

export default BookCard;
