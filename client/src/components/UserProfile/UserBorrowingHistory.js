import { Fragment, useContext, useEffect, useState } from "react";

import AuthContext from "../../store/auth-context";
import LoadingSpinner from "../../utility/LoadingSpinner";
import BookList from "../Books/BookList";
import classes from "./UserBorrowingHistory.module.css";

async function getBorrowings(userId) {
  const response = await fetch(`/historyborrow/${userId}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not fetch bookmarks.");
  }

  return data;
}

const UserBorrowingHistory = () => {
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
          <div className={classes.container}>
            <div className={classes.container1}>
              <BookList books={borrowings} action="history" />
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
