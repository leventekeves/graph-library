import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import AuthContext from "../../store/auth-context";

import CommentList from "../Comments/CommentList";
import NewComment from "../Comments/NewComment";
import Button from "../Layout/Button";
import SubNavigation from "../Layout/SubNavigation";
import LoadingSpinner from "../../utility/LoadingSpinner";
import AdminNewBook from "../Admin/AdminNewBook";
import classes from "./BookCard.module.css";

import noCover from "../../utility/nocover.png";

async function getBooks(bookId) {
  const response = await fetch(`/book/${bookId}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not fetch the book.");
  }
  return data;
}

async function addRateHandler(userId, bookId, rating) {
  await fetch(`/book/rate`, {
    method: "POST",
    body: JSON.stringify({ rating, userId, bookId }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

async function addBookmark(bookId, userId) {
  await fetch(`/bookmarks`, {
    method: "POST",
    body: JSON.stringify({ bookId, userId }),
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

async function addBorrow(data) {
  await fetch(`/borrow`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

async function addHistoryBorrow(data) {
  await fetch(`/historyborrow`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

async function deleteBook(bookId) {
  await fetch(`/book`, {
    method: "DELETE",
    body: JSON.stringify({ bookId }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

const BookCard = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState([]);
  const [newCommentAdded, setNewCommentAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [borrowButtonActive, setBorrowButtonActive] = useState(true);
  const [borrowButton, setBorrowButton] = useState();
  const [isRated, setisRated] = useState(false);
  const [canRate, setCanRate] = useState(true);
  const [rating, setRating] = useState("No ratings yet!");
  const [bookmarkButtonActive, setBookmarkButtonActive] = useState(true);
  const [bookmarkButton, setBookmarkButton] = useState();
  const [deleteBookButton, setDeleteBookButton] = useState();
  const [editBookButton, setEditBookButton] = useState();
  const [editing, setEditing] = useState(false);

  const authCtx = useContext(AuthContext);
  const history = useHistory();

  useEffect(() => {
    getBooks(bookId).then((data) => {
      if (isLoading) {
        setBook(data);
        setIsLoading(false);
      }
    });

    return () => {
      setIsLoading(false);
    };
  }, [bookId, isLoading]);

  const newCommentAddedHandler = (value) => {
    setNewCommentAdded(value);
  };

  const onBorrowHandler = useCallback(() => {
    const newStock = +book.stock - 1;
    const currentDate = new Date();
    const expirationDate = new Date();
    expirationDate.setDate(currentDate.getDate() + 30);
    addBorrow({
      userId: authCtx.id,
      bookId: bookId,
      date: expirationDate,
    }).then(() => {
      const updatedBorrowings = authCtx.borrowings;
      updatedBorrowings.push({ bookId: +bookId });
      authCtx.updateBorrowings(updatedBorrowings);
    });
    addHistoryBorrow({
      userId: authCtx.id,
      bookId: bookId,
      date: currentDate,
    }).then(() => {
      authCtx.historyBorrowings.push({ bookId: +bookId });
    });

    book.stock = newStock;
    setBorrowButtonActive(false);
    setBorrowButton(
      <div className={classes["feedback-message"]}>Book borrowed!</div>
    );
  }, [authCtx, bookId, book]);

  const onRateHandler = (event) => {
    if (isFinite(event.target.value)) {
      addRateHandler(authCtx.id, bookId, event.target.value);
      authCtx.ratings.push({
        bookId: +bookId,
        rating: +event.target.value,
      });
      setisRated(true);
      calcRate(event.target.value);
    }
  };

  useEffect(() => {
    if (!isLoading && borrowButtonActive && authCtx.isLoggedIn) {
      const borrowingsArray = authCtx.borrowings.map(
        (borrowing) => borrowing.bookId
      );

      if (+book.stock === 0) {
        setBorrowButton(
          <div className={classes["feedback-message"]}>Out of stock!</div>
        );
      } else if (!borrowingsArray.includes(+bookId)) {
        setBorrowButton(<Button onClick={onBorrowHandler}>Borrow</Button>);
      } else {
        setBorrowButton(
          <div className={classes["feedback-message"]}>Already borrowed!</div>
        );
      }
    }
  }, [
    isLoading,
    borrowButtonActive,
    authCtx.isLoggedIn,
    authCtx.borrowings,
    bookId,
    book.stock,
    onBorrowHandler,
  ]);

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
      if (newRating) {
        if (book.rating) {
          setRating(
            (
              (book.rating * book.numberOfRatings + +newRating) /
              (book.numberOfRatings + 1)
            ).toFixed(2)
          );
        } else {
          setRating(newRating);
        }
      }
      if (!isLoading && book?.rating && !newRating) {
        setRating(book.rating.toFixed(2));
      }
    },
    [book, isLoading]
  );

  useEffect(() => {
    calcRate();
  }, [calcRate]);

  const alreadyRated = useCallback(() => {
    for (let i = 0; i < authCtx.ratings.length; i++) {
      if (+authCtx.ratings[i].bookId === +bookId) {
        setCanRate(false);
        break;
      } else {
        setCanRate(true);
      }
    }
  }, [authCtx.ratings, bookId]);

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
    addBookmark(bookId, authCtx.id).then(() => {
      const updatedBookmarks = authCtx.bookmarks;
      updatedBookmarks.push({ bookId: +bookId });
      authCtx.updateBookmarks(updatedBookmarks);
    });
    setBookmarkButtonActive(false);
    setBookmarkButton(<div className={classes["bookmark-message"]}>ADDED</div>);
  }, [authCtx, bookId]);

  const removeBookmarkHandler = useCallback(() => {
    const bookmarksArray = authCtx.bookmarks.map((bookmark) => {
      return bookmark.bookId;
    });

    const removeIndex = bookmarksArray.findIndex((bookmarkId) => {
      return +bookmarkId === +bookId;
    });

    removeBookmark(bookId, authCtx.id);
    const updatedBookmarks = authCtx.bookmarks;
    updatedBookmarks.splice(removeIndex, 1);
    authCtx.updateBookmarks(updatedBookmarks);

    setBookmarkButtonActive(false);
    setBookmarkButton(
      <div className={classes["bookmark-message"]}>REMOVED</div>
    );
  }, [authCtx, bookId]);

  const deleteBookHandler = useCallback(() => {
    deleteBook(book.id);
    history.replace("/books");
  }, [book.id, history]);

  const editBookHandler = useCallback(() => {
    setEditing(true);
  }, []);

  useEffect(() => {
    if (!isLoading && bookmarkButtonActive && authCtx.isLoggedIn) {
      const bookmarksArray = authCtx.bookmarks.map(
        (bookmark) => bookmark.bookId
      );

      if (bookmarksArray.includes(+bookId)) {
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
    if (!isLoading && authCtx.access === "admin") {
      setDeleteBookButton(
        <div className={classes.bookmarker} onClick={deleteBookHandler}>
          Delete Book
        </div>
      );
      setEditBookButton(
        <div className={classes.bookmarker} onClick={editBookHandler}>
          Edit Book
        </div>
      );
    }
  }, [
    removeBookmarkHandler,
    addBookmarkHandler,
    deleteBookHandler,
    editBookHandler,
    isLoading,
    bookmarkButtonActive,
    authCtx.bookmarks,
    authCtx.isLoggedIn,
    authCtx.access,
    book,
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
    if (!editing) {
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
                <div className={classes["button-container"]}>
                  {bookmarkButton}
                  {editBookButton}
                  {deleteBookButton}
                </div>

                {book.cover === "https://undefined" ? (
                  <img className={classes.cover} src={noCover} alt="noCover" />
                ) : (
                  <img className={classes.cover} src={book.cover} alt="cover" />
                )}
              </div>
              <div className={classes["book-details"]}>
                <div className={classes.title}>{book.title}</div>
                <div className={classes.author}>by {book.author}</div>
                <div className={classes.description}>{book.description}</div>
                <div className={classes.pages}>Pages: {book.pages}</div>
                <div className={classes.category}>
                  Categeory: {book.category}
                </div>
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

                <div className={classes["borrow-container"]}>
                  {borrowButton}
                </div>
              </div>
            </div>
            {authCtx.token ? (
              <NewComment
                currentBook={bookId}
                onNewComment={newCommentAddedHandler}
              />
            ) : (
              ""
            )}

            <CommentList
              currentBook={bookId}
              newCommentAdded={newCommentAdded}
              onNewComment={newCommentAddedHandler}
            />
          </div>
        </Fragment>
      );
    }
    if (editing) {
      return <AdminNewBook book={book} />;
    }
  } else {
    return <div className={classes["not-found"]}>Book Not Found!</div>;
  }
};

export default BookCard;
