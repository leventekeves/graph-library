import { Fragment } from "react";

import classes from "./BookList.module.css";
import BookItem from "./BookItem";

const BookList = (props) => {
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
              ratings={book.ratings}
              cover={book.cover}
              inListId={book.inListId}
              listId={props.listId}
              action={props.action}
              location={props.location}
            />
          );
        })}
      </div>
    </Fragment>
  );
};

export default BookList;
