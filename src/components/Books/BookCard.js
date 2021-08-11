import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

  console.log(books);

  if (books.length === 0) {
    return <div></div>;
  } else {
    return (
      <Fragment>
        <div className={classes["book-container"]}>
          <div className={classes["book-card"]}>
            <div className={classes.title}>{books[bookId - 1].title}</div>
            <div className={classes.author}>{books[bookId - 1].author}</div>
            <div className={classes.description}>
              {books[bookId - 1].description}
            </div>
            <div>Oldalak száma: {books[bookId - 1].pages}</div>
            <div>Megjelenési év: {books[bookId - 1].year}</div>
            <div>Raktáron: {books[bookId - 1].stock} darab</div>
            <button className={classes["rent-button"]}>Kölcsönzés</button>
          </div>
        </div>

        <div className={classes["new-comment"]}>
          <button className={classes["new-comment--button"]}>Új komment</button>
        </div>

        <div>
          <div className={classes["comment-container"]}>
            <div className={classes["comment-item"]}>
              <div className={classes["comment-item--header"]}>
                <p>Név</p>
                <p>Dátum</p>
              </div>
              <div className={classes["comment-item--content"]}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Praesentium nihil ullam voluptatibus voluptate inventore ut quo
                perspiciatis debitis! Harum aliquid ratione ut possimus
                veritatis, beatae accusamus eos maiores placeat cumque.{" "}
              </div>
            </div>
            <div className={classes["comment-item"]}>
              <div className={classes["comment-item--header"]}>
                <p>Név</p>
                <p>Dátum</p>
              </div>
              <div className={classes["comment-item--content"]}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Praesentium nihil ullam voluptatibus voluptate inventore ut quo
                perspiciatis debitis! Harum aliquid ratione ut possimus
                veritatis, beatae accusamus eos maiores placeat cumque.
              </div>
            </div>
            <div className={classes["comment-item"]}>
              <div className={classes["comment-item--header"]}>
                <p>Név</p>
                <p>Dátum</p>
              </div>
              <div className={classes["comment-item--content"]}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Praesentium nihil ullam voluptatibus voluptate inventore ut quo
                perspiciatis debitis! Harum aliquid ratione ut possimus
                veritatis, beatae accusamus eos maiores placeat cumque.
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
};

export default BookCard;
