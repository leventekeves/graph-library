import { Fragment, useContext, useEffect, useState } from "react";

import AuthContext from "../../store/auth-context";
import SubNavigation from "../Layout/SubNavigation";
import LoadingSpinner from "../../utility/LoadingSpinner";
import classes from "./BookmarksContent.module.css";
import BookList from "../Books/BookList";

async function getBookmarks(userId) {
  const response = await fetch(`/bookmarks/${userId}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not fetch bookmarks.");
  }
  return data;
}

const BookmarksContent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState();
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    if (authCtx.token) {
      getBookmarks(authCtx.id).then((bookmarks) => {
        const transformedBookmarks = [];
        for (const key in bookmarks) {
          const BookmarkObj = {
            id: key,
            ...bookmarks[key],
          };
          transformedBookmarks.push(BookmarkObj);
        }

        setBookmarks(transformedBookmarks);
        setIsLoading(false);
      });
    }
  }, [authCtx]);

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
            <BookList books={bookmarks} />
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
