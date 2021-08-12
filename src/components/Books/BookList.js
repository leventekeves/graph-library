import { Fragment } from "react";

import classes from "./BookList.module.css";
import BookItem from "./BookItem";

const BookList = (props) => {
  return (
    <Fragment>
      <div className={classes["book-container"]}>
        {props.books.map((book) => {
          if (
            (book.pages === +props.search ||
              book.title.toLowerCase().includes(props.search.toLowerCase()) ||
              book.author.toLowerCase().includes(props.search.toLowerCase()) ||
              book.category
                .toLowerCase()
                .includes(props.search.toLowerCase())) &&
            (props.year && props.year !== "Select year"
              ? +book.year === +props.year
              : true) &&
            (props.category ? book.category === props.category : true)
          ) {
            return (
              <BookItem
                key={book.id}
                id={book.id}
                title={book.title}
                author={book.author}
                pages={book.pages}
                year={book.year}
                category={book.category}
              />
            );
          } else {
            return "";
          }
        })}
      </div>
    </Fragment>
  );
};

export default BookList;
