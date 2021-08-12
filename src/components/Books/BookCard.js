import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CommentList from "../Comments/CommentList";
import NewComment from "../Comments/NewComment";
import classes from "./BookCard.module.css";

const BookCard = () => {
  const { bookId } = useParams();
  const [books, setBooks] = useState([]);

  async function fetchBooksHandler() {
    const response = await fetch(
      "https://graph-library-kl-default-rtdb.europe-west1.firebasedatabase.app/Books.json"
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Could not fetch books.");
    }

    const transformedBooks = [];

    for (const id in data) {
      const bookObj = {
        ...data[id],
      };

      transformedBooks.push(bookObj);
    }
    setBooks(transformedBooks);
  }

  useEffect(() => {
    fetchBooksHandler();
  }, []);

  if (books.length === 0) {
    return <div></div>;
  }
  if (books[bookId - 1]) {
    return (
      <Fragment>
        <div className={classes["book-container"]}>
          <div className={classes["book-card"]}>
            <div className={classes.title}>{books[bookId - 1].title}</div>
            <div className={classes.author}>{books[bookId - 1].author}</div>
            <div className={classes.description}>
              {books[bookId - 1].description}
            </div>
            <div>Pages: {books[bookId - 1].pages}</div>
            <div>Release year: {books[bookId - 1].year}</div>
            <div>In stock: {books[bookId - 1].stock}</div>
            <button className={classes["rent-button"]}>Rent</button>
          </div>
        </div>
        <NewComment currentBook={bookId} />
        <CommentList currentBook={bookId} />
      </Fragment>
    );
  } else {
    return <div>Book Not Found!</div>;
  }
};

export default BookCard;
