import { Fragment, useContext, useEffect, useState } from "react";

import AuthContext from "../../store/auth-context";
import SubNavigation from "../Layout/SubNavigation";
import LoadingSpinner from "../../utility/LoadingSpinner";
import classes from "./BorrowingsContent.module.css";
import BookList from "../Books/BookList";
import Pagination from "../../utility/Pagination";

async function getBorrowings(userId, pageNumber, itemsPerPage) {
  const response = await fetch(
    `/borrow/${userId}?pagenumber=${pageNumber}&itemsperpage=${itemsPerPage}`
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not fetch bookmarks.");
  }
  return data;
}

const BorrowingsContent = () => {
  const [borrowings, setBorrowings] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const itemsPerPage = 2;

  const authCtx = useContext(AuthContext);

  useEffect(() => {
    let isActive = true;

    if (authCtx.token) {
      getBorrowings(authCtx.id, currentPage, itemsPerPage).then((data) => {
        const transformedBorrowings = [];
        for (const key in data.bookArr) {
          const BorrowingObj = {
            id: key,
            ...data.bookArr[key],
          };
          transformedBorrowings.push(BorrowingObj);
        }

        if (isActive) {
          setBorrowings(transformedBorrowings);
          setPageCount(Math.ceil(data.numberOfBooks / itemsPerPage));
          setIsLoading(false);
        }
      });
    }

    return () => {
      isActive = false;
    };
  }, [authCtx, currentPage, isLoading]);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
    window.scrollTo(0, 0);
  };

  if (!authCtx.isLoggedIn) {
    return (
      <Fragment>
        <SubNavigation location={[{ name: "Borrowings", link: "" }]} />{" "}
        <div className={classes["feedback-message"]}>
          You need to login to use this feature!
        </div>
      </Fragment>
    );
  }

  if (isLoading) {
    return (
      <div className={classes.container}>
        <LoadingSpinner />
      </div>
    );
  } else {
    if (borrowings.length > 0) {
      return (
        <Fragment>
          <SubNavigation location={[{ name: "Borrowings", link: "" }]} />
          <div className={classes.container}>
            <div className={classes.container1}>
              <BookList books={borrowings} action="borrow" location="list" />
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
          <SubNavigation location={[{ name: "Borrowings", link: "" }]} />{" "}
          <div className={classes["feedback-message"]}>No books borrowed!</div>
        </Fragment>
      );
    }
  }
};

export default BorrowingsContent;
