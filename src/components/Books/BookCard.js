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

    for (const key in data) {
      const bookObj = {
        id: key,
        ...data[key],
      };

      transformedBooks.push(bookObj);
    }
    setBooks(transformedBooks);
  }

  const bookIndex = books.findIndex((book) => {
    return book.id === bookId;
  });

  useEffect(() => {
    fetchBooksHandler();
  }, []);

  if (books.length === 0) {
    return <div></div>;
  }
  if (books[bookIndex]) {
    return (
      <Fragment>
        <div className={classes["book-container"]}>
          <div className={classes["book-card"]}>
            <div className={classes.title}>{books[bookIndex].title}</div>
            <div className={classes.author}>{books[bookIndex].author}</div>
            <div className={classes.description}>
              {books[bookIndex].description}
            </div>
            <div>Pages: {books[bookIndex].pages}</div>
            <div>Release year: {books[bookIndex].year}</div>
            <div>In stock: {books[bookIndex].stock}</div>
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
