import { useState, useEffect, useMemo, Fragment } from "react";
import { useHistory, useLocation } from "react-router-dom";

import classes from "./BooksContent.module.css";
import BookList from "./BookList";
import LoadingSpinner from "../utility/LoadingSpinner";
import BookFilters from "./BookFilters";

async function getBooks() {
  const response = await fetch(
    "https://graph-library-kl-default-rtdb.europe-west1.firebasedatabase.app/Books.json"
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not fetch books.");
  }
  return data;
}

const BooksContent = (props) => {
  const [data, setData] = useState();
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const history = useHistory();
  const location = useLocation();

  async function transformBooks(data) {
    const transformedBooks = [];
    for (const key in data) {
      const bookObj = {
        id: key,
        ...data[key],
      };

      transformedBooks.push(bookObj);
    }
    setBooks(transformedBooks);
    setFilteredBooks(transformedBooks);
    setIsLoading(false);
  }

  const addQuery = (key, value) => {
    let pathname = location.pathname;
    let searchParams = new URLSearchParams(location.search);
    searchParams.set(key, value);
    history.push({
      pathname: pathname,
      search: searchParams.toString(),
    });
  };

  const queryParams = useMemo(() => {
    return new URLSearchParams(location.search);
  }, [location]);

  useEffect(() => {
    getBooks().then((data) => {
      setData(data);
    });
  }, []);

  useEffect(() => {
    transformBooks(data);
  }, [data]);

  useEffect(() => {
    const searchFilter = queryParams.get("search");
    const yearFilter = queryParams.get("year");
    const categoryFilter = queryParams.get("category");
    const filteredBooks = books.filter(
      (book) =>
        (searchFilter
          ? book.author.toLowerCase().includes(searchFilter.toLowerCase()) ||
            book.title.toLowerCase().includes(searchFilter.toLowerCase())
          : true) &&
        (yearFilter && yearFilter !== "Select year"
          ? +book.year === +yearFilter
          : true) &&
        (categoryFilter ? book.category === categoryFilter : true)
    );
    setFilteredBooks(filteredBooks);
  }, [queryParams, books]);

  const onSearchChangeHandler = (event) => {
    addQuery("search", event.target.value);
  };

  const onYearSelectHandler = (value) => {
    addQuery("year", value);
  };

  const onCategorySelectHandler = (value) => {
    addQuery("category", value);
  };

  const removeFilterHandler = () => {
    history.push("/books");
  };

  return (
    <Fragment>
      <div className={classes.container}>
        <div className={classes.search}>
          <div className={classes["search--input"]}>
            <BookFilters
              onYearSelect={onYearSelectHandler}
              onCategorySelect={onCategorySelectHandler}
              onRemoveFilter={removeFilterHandler}
            />

            <input
              type="text"
              className={classes["search--field"]}
              placeholder="Search..."
              onChange={onSearchChangeHandler}
            />
          </div>
          {isLoading ? (
            <div className={classes.center}>
              <LoadingSpinner />
            </div>
          ) : (
            <BookList
              books={filteredBooks}
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
