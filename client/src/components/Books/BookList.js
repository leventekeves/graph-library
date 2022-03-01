import { Fragment, useState } from "react";

import classes from "./BookList.module.css";
import BookItem from "./BookItem";

const BookList = (props) => {
  const [bookCounter, setBookCounter] = useState(props.books.length);

  const handleDelete = (value) => {
    if (value) setBookCounter(bookCounter - 1);
  };

  if (bookCounter === 0 && props.action === "borrow") {
    if (props.action === "borrow")
      return (
        <div className={classes["feedback-message"]}>No books borrowed!</div>
      );
  } else if (bookCounter === 0 && props.action === "bookmark") {
    if (props.action === "bookmark")
      return (
        <div className={classes["feedback-message"]}>No books bookmarked!</div>
      );
  } else {
    return (
      <Fragment>
        <div className={classes["book-container"]}>
          {props.books.map((book) => {
            return (
              <BookItem
                key={book.id}
                id={book.id}
                title={book.title}
                author={book.author}
                pages={book.pages}
                year={book.year}
                category={book.category}
                rating={book.rating}
                cover={book.cover}
                inListId={book.inListId}
                listId={props.listId}
                action={props.action}
                location={props.location}
                remainingExtensions={book.remainingExtensions}
                date={book.date}
                onDelete={handleDelete}
                realId={book.realId}
              />
            );
          })}
        </div>
      </Fragment>
    );
  }
};

export default BookList;
