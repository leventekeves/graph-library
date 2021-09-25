import { Fragment, useContext, useEffect, useState } from "react";

import AuthContext from "../../store/auth-context";
import BookItem from "../Books/BookItem";
import SubNavigation from "../Layout/SubNavigation";
import LoadingSpinner from "../../utility/LoadingSpinner";
import classes from "./BookmarksContent.module.css";

async function getBookmarks(userId) {
  const response = await fetch(
    `https://graph-library-kl-default-rtdb.europe-west1.firebasedatabase.app/Users/${userId}/bookmarks.json`
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not fetch bookmarks.");
  }
  return data;
}

const BookmarksContent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    getBookmarks(authCtx.id).then((data) => {
      const bookmarks = data;
      const transformedBookmarks = [];
      for (const key in bookmarks) {
        const BookmarkObj = {
          id: key,
          ...bookmarks[key],
        };
        transformedBookmarks.push(BookmarkObj);
      }

      authCtx.bookmarks = transformedBookmarks;
      setIsLoading(false);
    });
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
    if (authCtx.bookmarks.length > 0) {
      return (
        <Fragment>
          <SubNavigation location={[{ name: "Bookmarks", link: "" }]} />
          <div className={classes.container}>
            {authCtx.bookmarks.map((bookmark) => {
              return (
                <BookItem
                  key={bookmark.bookId}
                  id={bookmark.bookId}
                  location="list"
                />
              );
            })}
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
