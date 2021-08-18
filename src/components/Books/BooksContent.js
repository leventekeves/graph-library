import { useState, useRef, useEffect, useMemo, Fragment } from "react";
import { useHistory, useLocation } from "react-router-dom";

import classes from "./BooksContent.module.css";
import BookList from "./BookList";
import LoadingSpinner from "../utility/LoadingSpinner";
import BookFilters from "./BookFilters";

const BooksContent = (props) => {
  const [books, setBooks] = useState([]);
  const [searchItem, setSearchItem] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const searchInputRef = useRef();
  const history = useHistory();
  const location = useLocation();

  const queryParams = useMemo(() => {
    return new URLSearchParams(location.search);
  }, [location]);

  const addQuery = (key, value) => {
    let pathname = location.pathname;
    let searchParams = new URLSearchParams(location.search);
    searchParams.set(key, value);
    history.push({
      pathname: pathname,
      search: searchParams.toString(),
    });
  };

  async function getBooks(event) {
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

  useEffect(() => {
    getBooks();
    setYearFilter(queryParams.get("year"));
    setCategoryFilter(queryParams.get("category"));
  }, [queryParams]);

  const submitHandler = (event) => {
    event.preventDefault();
    setSearchItem(searchInputRef.current.value);

    setIsLoading(true);
    getBooks();
  };

  const onYearSelectHandler = (value) => {
    addQuery("year", value);
  };

  const onCategorySelectHandler = (value) => {
    addQuery("category", value);
  };

  const removeFilterHandler = () => {
    setCategoryFilter("");
    setYearFilter("");
    history.push("/books");
  };

  return (
    <Fragment>
      <div className={classes.container}>
        <div className={classes.search}>
          <form className={classes["search--input"]} onSubmit={submitHandler}>
            <BookFilters
              onYearSelect={onYearSelectHandler}
              onCategorySelect={onCategorySelectHandler}
              onRemoveFilter={removeFilterHandler}
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
              listId={props.listId}
              action={props.action}
            />
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default BooksContent;
