import classes from "./BooksContent.module.css";
import BookList from "./BookList";
import { useState, useRef } from "react";
import LoadingSpinner from "../utility/LoadingSpinner";
import BookFilters from "./BookFilters";

const BooksContent = (props) => {
  const [books, setBooks] = useState([]);
  const [searchItem, setSearchItem] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const searchInputRef = useRef();

  async function fetchBooksHandler(event) {
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
    setIsLoading(false);
  }

  const submitHandler = (event) => {
    event.preventDefault();
    setSearchItem(searchInputRef.current.value);

    setIsLoading(true);
    fetchBooksHandler();
  };

  const onYearSelectHandler = (value) => {
    setYearFilter(value);
  };

  const onCategorySelectHandler = (value) => {
    setCategoryFilter(value);
  };

  return (
    <div className={classes.container}>
      <div className={classes.search}>
        <form className={classes["search--input"]} onSubmit={submitHandler}>
          <BookFilters
            onYearSelect={onYearSelectHandler}
            onCategorySelect={onCategorySelectHandler}
          />
          <input
            type="text"
            className={classes["search--field"]}
            placeholder="Search..."
            ref={searchInputRef}
          />
          <button className={classes["search--button"]}>Search</button>
        </form>
        {isLoading ? (
          <div className={classes.center}>
            <LoadingSpinner />
          </div>
        ) : (
          <BookList
            books={books}
            search={searchItem}
            year={yearFilter}
            category={categoryFilter}
            list={props.listId}
          />
        )}
      </div>
    </div>
  );
};

export default BooksContent;
