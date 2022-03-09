import { Fragment, useContext, useEffect, useState } from "react";

import AuthContext from "../../store/auth-context";
import LoadingSpinner from "../../utility/LoadingSpinner";
import BookList from "../Books/BookList";
import classes from "./UserBorrowingHistory.module.css";
import Pagination from "../../utility/Pagination";

async function getBorrowings(userId, pageNumber, itemsPerPage) {
  const response = await fetch(
    `/historyborrow/${userId}?pagenumber=${pageNumber}&itemsperpage=${itemsPerPage}`
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not fetch bookmarks.");
  }
  return data;
}

const UserBorrowingHistory = () => {
  const [isLoading, setIsLoading] = useState(true);
  const authCtx = useContext(AuthContext);

  const [historyBorrowings, setHistoryBorrowings] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const itemsPerPage = 10;

  useEffect(() => {
    let isActive = true;
    if (authCtx.token) {
      getBorrowings(authCtx.id, currentPage, itemsPerPage).then((data) => {
        const transformedBorrowings = [];

        for (let i = 0; i < data.booksArr.length; i++) {
          const BorrowingObj = {
            ...data.booksArr[i],
            id: i,
            realId: data.booksArr[i].id,
          };
          transformedBorrowings.push(BorrowingObj);
        }

        if (isActive) {
          setHistoryBorrowings(transformedBorrowings);
          setPageCount(Math.ceil(data.numberOfBooks / itemsPerPage));
          setIsLoading(false);
        }
      });
    }
    return () => {
      isActive = false;
    };
  }, [authCtx, itemsPerPage, currentPage]);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
    window.scrollTo(0, 0);
  };

  if (isLoading) {
    return (
      <div className={classes.container}>
        <LoadingSpinner />
      </div>
    );
  } else {
    if (historyBorrowings.length > 0) {
      return (
        <Fragment>
          <div className={classes.container}>
            <div className={classes.container1}>
              <BookList books={historyBorrowings} action="history" />
              <Pagination
                pageCount={pageCount}
                handlePageClick={handlePageClick}
              />
            </div>
          </div>
        </Fragment>
      );
    } else {
      return (
        <Fragment>
          <div className={classes["feedback-message"]}>
            Your borrowing history is empty!
          </div>
        </Fragment>
      );
    }
  }
};

export default UserBorrowingHistory;
