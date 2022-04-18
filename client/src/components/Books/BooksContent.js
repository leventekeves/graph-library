import { useState, useEffect, useMemo } from "react";
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

    if (listData.list?.books) {
      const listIdArray = [];
      listData.list.books.forEach((book) => {
        listIdArray.push(book.id);
      });

      response = await fetch(
        `/book/list/${listIdArray.join("-")}?search=${
          queryParamsForRequest?.search || ""
        }&year=${queryParamsForRequest?.year || ""}&category=${
          queryParamsForRequest?.category || ""
        }&pagenumber=${pageNumber}&itemsperpage=${itemsPerPage}`
      );
    } else {
      response = await fetch(
        `/book?search=${queryParamsForRequest?.search || ""}&year=${
          queryParamsForRequest?.year || ""
        }&category=${
          queryParamsForRequest?.category || ""
        }&pagenumber=${pageNumber}&itemsperpage=${itemsPerPage}`
      );
    }
  } else {
    response = await fetch(
      `/book?search=${queryParamsForRequest?.search || ""}&year=${
        queryParamsForRequest?.year || ""
      }&category=${
        queryParamsForRequest?.category || ""
      }&pagenumber=${pageNumber}&itemsperpage=${itemsPerPage}`
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
  const [isLoading, setIsLoading] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageChange, setPageChange] = useState(false);

  const history = useHistory();
  const location = useLocation();
  const itemsPerPage = 8;

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
    let isActive = true;

    const searchFilter = queryParams.get("search");
    const yearFilter = queryParams.get("year");
    const categoryFilter = queryParams.get("category");

    const queryParamsForRequest = {
      search: searchFilter,
      year: yearFilter,
      category: categoryFilter,
    };

    // if (firstLoad) {
    //   getBooks(
    //     queryParamsForRequest,
    //     currentPage,
    //     itemsPerPage,
    //     props.listId
    //   ).then((data) => {
    //     if (isActive) {
    //       setData(data);
    //       setIsLoading(false);
    //       setFirstLoad(false);
    //     }
    //   });
    // }

    // if (pageChange) {
    //   getBooks(
    //     queryParamsForRequest,
    //     currentPage,
    //     itemsPerPage,
    //     props.listId
    //   ).then((data) => {
    //     if (isActive) {
    //       setData(data);
    //       setIsLoading(false);
    //       setFirstLoad(false);
    //       setPageChange(false);
    //     }
    //   });
    // }

    if (pageChange || firstLoad)
      getBooks(
        queryParamsForRequest,
        currentPage,
        itemsPerPage,
        props.listId
      ).then((data) => {
        if (isActive) {
          setData(data);
          setIsLoading(false);
          setFirstLoad(false);
          setPageChange(false);
        }
      });

    return () => {
      isActive = false;
    };
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

  const onSearchHandler = (event) => {
    event.preventDefault();
    const searchFilter = queryParams.get("search");
    const yearFilter = queryParams.get("year");
    const categoryFilter = queryParams.get("category");

    const queryParamsForRequest = {
      search: searchFilter,
      year: yearFilter,
      category: categoryFilter,
    };

    setIsLoading(true);
    setCurrentPage(0);

    getBooks(queryParamsForRequest, 0, itemsPerPage, props.listId).then(
      (data) => {
        setData(data);
        setIsLoading(false);
      }
    );
  };

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
    setPageChange(true);
    setIsLoading(true);
    window.scrollTo(0, 0);
  };

  return (
    <div className={classes.container}>
      <div className={classes.search}>
        <div className={classes["search--input"]}>
          <BookFilters
            onYearSelect={onYearSelectHandler}
            onCategorySelect={onCategorySelectHandler}
            onRemoveFilter={removeFilterHandler}
          />

          <form onSubmit={onSearchHandler}>
            <input
              type="text"
              className={classes["search--field"]}
              placeholder="Search..."
              onChange={onSearchChangeHandler}
            />
          </form>

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
          </div>
        )}
        <Pagination
          pageCount={pageCount}
          handlePageClick={handlePageClick}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
};

export default BooksContent;
