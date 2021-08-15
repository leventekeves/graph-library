import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import classes from "./ListCard.module.css";
import BookList from "../Books/BookList";
import LoadingSpinner from "../utility/LoadingSpinner";

const ListCard = () => {
  const { listID } = useParams();
  const [list, setList] = useState({});
  const [numberOfBooks, setNumberOfBooks] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBooksHandler = useCallback(async () => {
    const response = await fetch(
      `https://graph-library-kl-default-rtdb.europe-west1.firebasedatabase.app/Lists/${listID}.json`
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Could not fetch books.");
    }

    setList({
      ...data,
      books: Object.values(data.books),
    });
    setNumberOfBooks(Object.values(data.books).length);
    setIsLoading(false);
  }, [listID]);

  useEffect(() => {
    fetchBooksHandler();
  }, [fetchBooksHandler]);

  if (isLoading) {
    return (
      <div className={classes.center}>
        <LoadingSpinner />
      </div>
    );
  } else {
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
        <BookList books={list.books} />
      </div>
    );
  }
};

export default ListCard;
