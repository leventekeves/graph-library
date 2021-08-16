import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import classes from "./ListCard.module.css";
import BookList from "../Books/BookList";
import LoadingSpinner from "../utility/LoadingSpinner";

const ListCard = (props) => {
  let { listId } = useParams();
  const [list, setList] = useState();
  const [numberOfBooks, setNumberOfBooks] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  if (!listId) {
    listId = props.listId;
  }

  const fetchBooksHandler = useCallback(async () => {
    const response = await fetch(
      `https://graph-library-kl-default-rtdb.europe-west1.firebasedatabase.app/Lists/${listId}.json`
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Could not fetch books.");
    }

    const transformedBooks = [];
    for (const key in data.books) {
      const bookObj = {
        inListId: key,
        ...data.books[key],
      };

      transformedBooks.push(bookObj);
    }

    if (data) {
      setList({
        ...data,
        books: transformedBooks,
      });
      setNumberOfBooks(transformedBooks.length);
    }

    setIsLoading(false);
  }, [listId]);

  useEffect(() => {
    fetchBooksHandler();
  }, [fetchBooksHandler]);

  if (isLoading) {
    return (
      <div className={classes.center}>
        <LoadingSpinner />
      </div>
    );
  } else if (list) {
    return (
      <div className={classes.container}>
        <div className={classes["list-container"]}>
          <div className={classes["list-card"]}>
            <div className={classes.title}>{list.name}</div>
            <div className={classes.description}>{list.description}</div>
            <div>Number of books: {numberOfBooks}</div>
            <div>Recommendations:{list.recommendations || 0}</div>
          </div>
        </div>
        <BookList
          books={list.books}
          listId={props.listId}
          action={props.action}
        />
      </div>
    );
  } else {
    return <div>List Not Found!</div>;
  }
};

export default ListCard;
