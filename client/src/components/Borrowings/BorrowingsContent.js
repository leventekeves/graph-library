import { Fragment, useContext, useEffect, useState } from "react";

import AuthContext from "../../store/auth-context";
import SubNavigation from "../Layout/SubNavigation";
import LoadingSpinner from "../../utility/LoadingSpinner";
import classes from "./BorrowingsContent.module.css";
import BookList from "../Books/BookList";

async function getBorrowings(userId) {
  const response = await fetch(`/borrow/${userId}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not fetch bookmarks.");
  }

  return data;
}

const BorrowingsContent = () => {
  const [borrowings, setBorrowings] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    if (authCtx.token) {
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

        setBorrowings(transformedBorrowings);
        setIsLoading(false);
      });
    }
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
    if (borrowings.length > 0) {
      return (
        <Fragment>
          <SubNavigation location={[{ name: "Borrowings", link: "" }]} />
          <div className={classes.container}>
            <div className={classes.container1}>
              <BookList books={borrowings} action="borrow" location="list" />
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
