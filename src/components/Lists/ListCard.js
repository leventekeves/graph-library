import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import classes from "./ListCard.module.css";
import BookList from "../Books/BookList";
import LoadingSpinner from "../utility/LoadingSpinner";
import SubNavigation from "../Layout/SubNavigation";
import AuthContext from "../../store/auth-context";

const ListCard = (props) => {
  let { listId } = useParams();
  const authCtx = useContext(AuthContext);

  const [list, setList] = useState();
  const [numberOfBooks, setNumberOfBooks] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [numberOfRecommendations, setRecommendations] = useState(0);
  const [isRecommended, setIsRecommended] = useState(false);
  const [canRecommend, setCanRecommend] = useState();

  if (!listId) {
    listId = props.listId;
  }

  const alreadyRecommended = useCallback(() => {
    let loggedInRecommendations;
    if (list.recommendations) {
      loggedInRecommendations = list.recommendations.filter(
        (rec) => rec.id === authCtx.id
      );
      if (loggedInRecommendations.length > 0) {
        setCanRecommend(false);
        console.log("false");
      } else {
        setCanRecommend(true);
        console.log("true");
      }
    } else {
      setCanRecommend(true);
      console.log("true");
    }
  }, [authCtx.id, list]);

  const getBooks = useCallback(async () => {
    const response = await fetch(
      `https://graph-library-kl-default-rtdb.europe-west1.firebasedatabase.app/Lists/${listId}.json`
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Could not fetch books.");
    }

    const transformedBooks = [];
    if (data) {
      for (const key in data.books) {
        const bookObj = {
          inListId: key,
          ...data.books[key],
        };

        transformedBooks.push(bookObj);
      }
    }

    if (data && data.recommendations) {
      setRecommendations(Object.entries(data.recommendations).length);
    }

    let transformedRecommendations;
    if (data && data.recommendations) {
      transformedRecommendations = Object.values(data.recommendations);
    }

    if (data) {
      setList({
        ...data,
        books: transformedBooks,
        recommendations: transformedRecommendations,
      });
      setNumberOfBooks(transformedBooks.length);
    }

    setIsLoading(false);
  }, [listId]);

  async function addRecommendation(id) {
    await fetch(
      `https://graph-library-kl-default-rtdb.europe-west1.firebasedatabase.app/Lists/${listId}/recommendations.json`,
      {
        method: "POST",
        body: JSON.stringify(id),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  useEffect(() => {
    getBooks();
  }, [getBooks]);

  const onRecommendHandler = () => {
    setIsRecommended(true);
    addRecommendation({ id: authCtx.id });
    setRecommendations(numberOfRecommendations + 1);
  };

  useEffect(() => {
    if (!isLoading) alreadyRecommended();
  }, [isLoading, alreadyRecommended]);

  let recommendButton;
  if (canRecommend) {
    recommendButton = isRecommended ? (
      <div className={classes["feedback-message"]}>Recommended!</div>
    ) : (
      <div className={classes.double}>
        <button className={classes.button} onClick={onRecommendHandler}>
          Recommend
        </button>
      </div>
    );
  } else {
    recommendButton = (
      <div className={classes["feedback-message"]}>Already recommended!</div>
    );
  }

  if (isLoading) {
    return (
      <div className={classes.center}>
        <LoadingSpinner />
      </div>
    );
  } else if (list) {
    if (props.listId) {
      return (
        <BookList
          books={list.books}
          listId={props.listId}
          action={props.action}
          location="list"
        />
      );
    } else {
      return (
        <Fragment>
          <SubNavigation
            location={[
              { name: "Lists", link: "/lists" },
              { name: "Browse Lists", link: "/lists?function=browse" },
              { name: `${list.name}`, link: "" },
            ]}
          />
          <div className={classes.container}>
            <div className={classes["list-container"]}>
              <div className={classes["list-card"]}>
                <div className={classes.double}>{list.name}</div>
                <div className={classes.double}>{list.description}</div>
                <div>Number of books: {numberOfBooks}</div>
                <div>Recommendations: {numberOfRecommendations}</div>
                {authCtx.isLoggedIn ? (
                  recommendButton
                ) : (
                  <div className={classes["feedback-message"]}>
                    Login to recommend this list!
                  </div>
                )}
              </div>
            </div>
            <BookList
              books={list.books}
              listId={props.listId}
              action={props.action}
              location="list"
            />
          </div>
        </Fragment>
      );
    }
  } else {
    return <div>List Not Found!</div>;
  }
};

export default ListCard;
