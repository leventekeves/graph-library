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

async function addBookmark(book, userId) {
  await fetch(
    `https://graph-library-kl-default-rtdb.europe-west1.firebasedatabase.app/Users/${userId}/bookmarks.json`,
    {
      method: "POST",
      body: JSON.stringify(book),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const response = await fetch(
    `https://graph-library-kl-default-rtdb.europe-west1.firebasedatabase.app/Users/${userId}/bookmarks.json`
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not fetch bookmarks.");
  }
  const bookmarks = data;
  const transformedBookmarks = [];
  for (const key in bookmarks) {
    const BookmarkObj = {
      id: key,
      ...bookmarks[key],
    };
    transformedBookmarks.push(BookmarkObj);
  }

  return transformedBookmarks;
}

async function removeBookmark(userId, bookmarkId) {
  await fetch(
    `https://graph-library-kl-default-rtdb.europe-west1.firebasedatabase.app/Users/${userId}/bookmarks/${bookmarkId}.json`,
    {
      method: "DELETE",
    }
  );
}

const BookCard = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState([]);
  const [newCommentAdded, setNewCommentAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRented, setIsRented] = useState(false);
  const [isRated, setisRated] = useState(false);
  const [canRate, setCanRate] = useState(false);
  const [rating, setRating] = useState("No ratings yet!");
  const [bookmarkButtonActive, setBookmarkButtonActive] = useState(true);
  const [bookmarkButton, setBookmarkButton] = useState();

  const authCtx = useContext(AuthContext);

  useEffect(() => {
    getBooks(bookId).then((data) => {
      let transformedRatings;
      if (data && data.ratings) {
        transformedRatings = Object.values(data.ratings);
      }
      setBook({ ...data, ratings: transformedRatings });
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
      addRateHandler(bookId, { id: authCtx.id, rating: event.target.value });
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
        setRating((ratingSum / numberOfRatings).toFixed(2));
      }

      if (!isLoading && book && book.ratings) {
        book.ratings.forEach((ratingObj) => {
          ratingSum += +ratingObj.rating;
          numberOfRatings++;
        });

        setRating((ratingSum / numberOfRatings).toFixed(2));
      }
    },
    [book, isLoading]
  );

  useEffect(() => {
    calcRate();
  }, [calcRate]);

  const alreadyRated = useCallback(() => {
    let loggedInRatings;
    if (book.ratings) {
      loggedInRatings = book.ratings.filter(
        (rating) => rating.id === authCtx.id
      );
      if (loggedInRatings.length > 0) {
        setCanRate(false);
      } else {
        setCanRate(true);
      }
    } else {
      setCanRate(true);
    }
  }, [authCtx.id, book]);

  useEffect(() => {
    if (!isLoading) alreadyRated();
  }, [alreadyRated, isLoading]);

  let rateContent;
  if (canRate) {
    rateContent = isRated ? (
      <div className={classes["feedback-message"]}>Rated!</div>
    ) : (
      <div>Rate: {rateSelector}</div>
    );
  } else {
    rateContent = (
      <div className={classes["feedback-message"]}>Already rated!</div>
    );
  }

  const addBookmarkHandler = useCallback(() => {
    addBookmark({ bookId: bookId }, authCtx.id).then((transformedBookmarks) => {
      authCtx.bookmarks = transformedBookmarks;
    });
    authCtx.bookmarks.push();
    setBookmarkButtonActive(false);
    setBookmarkButton(<div className={classes["bookmark-message"]}>ADDED</div>);
  }, [authCtx, bookId]);

  const removeBookmarkHandler = useCallback(() => {
    const bookmarksArray = authCtx.bookmarks.map((bookmark) => {
      return bookmark.bookId;
    });

    const removeIndex = bookmarksArray.findIndex((bookmarkId) => {
      return bookmarkId === bookId;
    });

    removeBookmark(authCtx.id, authCtx.bookmarks[removeIndex].id);
    authCtx.bookmarks.splice(removeIndex, 1);
    setBookmarkButtonActive(false);
    setBookmarkButton(
      <div className={classes["bookmark-message"]}>REMOVED</div>
    );
  }, [authCtx.bookmarks, authCtx.id, bookId]);

  useEffect(() => {
    if (!isLoading && bookmarkButtonActive && authCtx.isLoggedIn) {
      const bookmarksArray = authCtx.bookmarks.map(
        (bookmark) => bookmark.bookId
      );

      if (bookmarksArray.includes(bookId)) {
        setBookmarkButton(
          <div className={classes.bookmarker} onClick={removeBookmarkHandler}>
            Remove from bookmarks
          </div>
        );
      } else {
        setBookmarkButton(
          <div className={classes.bookmarker} onClick={addBookmarkHandler}>
            Add to bookmarks
          </div>
        );
      }
    }
  }, [
    removeBookmarkHandler,
    addBookmarkHandler,
    isLoading,
    bookmarkButtonActive,
    authCtx.bookmarks,
    authCtx.isLoggedIn,
    bookId,
  ]);

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
              {bookmarkButton}
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
