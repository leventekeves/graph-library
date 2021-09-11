import { Fragment, useContext, useEffect, useState } from "react";

import AuthContext from "../../store/auth-context";
import BookItem from "../Books/BookItem";
import SubNavigation from "../Layout/SubNavigation";
import LoadingSpinner from "../../utility/LoadingSpinner";
import classes from "./BorrowingsContent.module.css";

async function getBorrowings(userId) {
  const response = await fetch(
    `https://graph-library-kl-default-rtdb.europe-west1.firebasedatabase.app/Users/${userId}/borrowings.json`
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not fetch bookmarks.");
  }
  return data;
}

const BorrowingsContent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    getBorrowings(authCtx.id).then((data) => {
      const borrowing = data;
      const transformedBorrowings = [];
      for (const key in borrowing) {
        const BorrowingObj = {
          id: key,
          ...borrowing[key],
        };
        transformedBorrowings.push(BorrowingObj);
      }

      authCtx.borrowings = transformedBorrowings;
      setIsLoading(false);
    });
  }, [authCtx]);

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
    if (authCtx.borrowings.length > 0) {
      return (
        <Fragment>
          <SubNavigation location={[{ name: "Borrowings", link: "" }]} />
          <div className={classes.container}>
            <div className={classes.container1}>
              {authCtx.borrowings.map((bookmark) => {
                return (
                  <BookItem
                    key={bookmark.bookId}
                    id={bookmark.bookId}
                    location="list"
                    action="borrow"
                  />
                );
              })}
            </div>
          </div>
        </Fragment>
      );
    } else {
      return (
        <Fragment>
          <SubNavigation location={[{ name: "Borrowings", link: "" }]} />{" "}
          <div className={classes["feedback-message"]}>No books boorowed!</div>
        </Fragment>
      );
    }
  }
};

export default BorrowingsContent;
