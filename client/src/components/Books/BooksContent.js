import { useState, useEffect, useMemo, Fragment } from "react";
import { useHistory, useLocation } from "react-router-dom";

import classes from "./BooksContent.module.css";
import BookList from "./BookList";
import LoadingSpinner from "../../utility/LoadingSpinner";
import BookFilters from "./BookFilters";
import Button from "../Layout/Button";
import Pagination from "../../utility/Pagination";

async function getBooks(
  queryParamsForRequest,
  pageNumber,
  itemsPerPage,
  listId
) {
  let response;
  if (listId) {
    const listResponse = await fetch(`/list/${listId}`);
    const listData = await listResponse.json();

    if (listData[0]?.books) {
      const listIdArray = [];
      listData[0].books.forEach((book) => {
        listIdArray.push(book.id);
      });
      response = await fetch(
        `/book/list/${pageNumber}/${itemsPerPage}/${listIdArray.join("-")}`
      );
    } else {
      response = await fetch(
        `/book/${pageNumber}/${itemsPerPage}?search=${
          queryParamsForRequest?.search || ""
        }&year=${queryParamsForRequest?.year || ""}&category=${
          queryParamsForRequest?.category || ""
        }`
      );
    }
  } else {
    response = await fetch(
      `/book/${pageNumber}/${itemsPerPage}?search=${
        queryParamsForRequest?.search || ""
      }&year=${queryParamsForRequest?.year || ""}&category=${
        queryParamsForRequest?.category || ""
      }`
    );
  }
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not fetch books.");
  }
  return data;
}

const BooksContent = (props) => {
  const [data, setData] = useState([]);
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageChange, setPageChange] = useState(false);

  const history = useHistory();
  const location = useLocation();
  const itemsPerPage = 4;

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
    const searchFilter = queryParams.get("search");
    const yearFilter = queryParams.get("year");
    const categoryFilter = queryParams.get("category");

    const queryParamsForRequest = {
      search: searchFilter,
      year: yearFilter,
      category: categoryFilter,
    };

    if (firstLoad) {
      getBooks(
        queryParamsForRequest,
        currentPage,
        itemsPerPage,
        props.listId
      ).then((data) => {
        setData(data);
        setIsLoading(false);
        setFirstLoad(false);
      });
    }

    if (pageChange) {
      getBooks(
        queryParamsForRequest,
        currentPage,
        itemsPerPage,
        props.listId
      ).then((data) => {
        setData(data);
        setIsLoading(false);
        setFirstLoad(false);
        setPageChange(false);
      });
    }
  }, [props.listId, queryParams, firstLoad, currentPage, pageChange]);

  useEffect(() => {
    if (!isLoading) {
      const transformedBooks = [];
      for (const key in data.bookArr) {
        const bookObj = {
          id: key,
          ...data.bookArr[key],
        };

        transformedBooks.push(bookObj);
      }

      if (data.numberOfBooks)
        setPageCount(Math.ceil(data.numberOfBooks / itemsPerPage));
      setBooks(transformedBooks);
    }
  }, [data, isLoading]);

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
    let pathname = location.pathname;

    queryParams.delete("search");
    queryParams.delete("year");
    queryParams.delete("category");

    history.push({
      pathname: pathname,
      search: queryParams.toString(),
    });
  };

  const onSearchHandler = () => {
    const searchFilter = queryParams.get("search");
    const yearFilter = queryParams.get("year");
    const categoryFilter = queryParams.get("category");

    const queryParamsForRequest = {
      search: searchFilter,
      year: yearFilter,
      category: categoryFilter,
    };

    getBooks(queryParamsForRequest, currentPage, itemsPerPage).then((data) => {
      setData(data);
    });
  };

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
    setPageChange(true);
    window.scrollTo(0, 0);
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
            <Button onClick={onSearchHandler}>Search</Button>
          </div>
          {isLoading ? (
            <div className={classes.center}>
              <LoadingSpinner />
            </div>
          ) : (
            <div>
              <BookList
                books={books}
                listId={props.listId}
                action={props.action}
              />
              <Pagination
                pageCount={pageCount}
                handlePageClick={handlePageClick}
              />
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default BooksContent;
