import { Fragment, useContext, useEffect, useState } from "react";

import AuthContext from "../../store/auth-context";
import SubNavigation from "../Layout/SubNavigation";
import LoadingSpinner from "../../utility/LoadingSpinner";
import classes from "./BookmarksContent.module.css";
import BookList from "../Books/BookList";
import Pagination from "../../utility/Pagination";

async function getBookmarks(userId, pageNumber, itemsPerPage) {
  const response = await fetch(
    `/bookmarks/${userId}?pagenumber=${pageNumber}&itemsperpage=${itemsPerPage}`
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not fetch bookmarks.");
  }
  return data;
}

const BookmarksContent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState();

  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const itemsPerPage = 8;

  const authCtx = useContext(AuthContext);

  useEffect(() => {
    let isActive = true;

    if (authCtx.token) {
      getBookmarks(authCtx.id, currentPage, itemsPerPage).then((data) => {
        const transformedBookmarks = [];
        for (const key in data.bookArr) {
          const BookmarkObj = {
            id: key,
            ...data.bookArr[key],
          };
          transformedBookmarks.push(BookmarkObj);
        }

        if (isActive) {
          setBookmarks(transformedBookmarks);
          setPageCount(Math.ceil(data.numberOfBooks / itemsPerPage));
          setIsLoading(false);
        }
      });
    }

    return () => {
      isActive = false;
    };
  }, [authCtx, currentPage]);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
    window.scrollTo(0, 0);
  };

  if (!authCtx.isLoggedIn) {
    return (
      <Fragment>
        <SubNavigation location={[{ name: "Bookmarks", link: "" }]} />{" "}
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
    if (bookmarks.length > 0) {
      return (
        <Fragment>
          <SubNavigation location={[{ name: "Bookmarks", link: "" }]} />
          <div className={classes.container}>
            <BookList books={bookmarks} action="bookmark" />
            <Pagination
              pageCount={pageCount}
              handlePageClick={handlePageClick}
            />
          </div>
        </Fragment>
      );
    } else {
      return (
        <Fragment>
          <SubNavigation location={[{ name: "Bookmarks", link: "" }]} />{" "}
          <div className={classes["feedback-message"]}>No bookmarks yet!</div>
        </Fragment>
      );
    }
  }
};

export default BookmarksContent;
