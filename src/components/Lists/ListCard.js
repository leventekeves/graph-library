import { Fragment, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import classes from "./ListCard.module.css";
import BookList from "../Books/BookList";
import LoadingSpinner from "../utility/LoadingSpinner";
import SubNavigation from "../Layout/SubNavigation";

const ListCard = (props) => {
  let { listId } = useParams();
  const [list, setList] = useState();
  const [numberOfBooks, setNumberOfBooks] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRecommended, setIsRecommended] = useState(false);

  if (!listId) {
    listId = props.listId;
  }

  const getBooks = useCallback(async () => {
    const response = await fetch(
      `https://graph-library-kl-default-rtdb.europe-west1.firebasedatabase.app/Lists/${listId}.json`
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Could not fetch books.");
    }

    const transformedBooks = [];
    for (const key in data.books) {
      const bookObj = {
        inListId: key,
        ...data.books[key],
      };

      transformedBooks.push(bookObj);
    }

    let recommendations = 0;
    if (data.recommendations) {
      recommendations = Object.entries(data.recommendations).length;
    }

    if (data) {
      setList({
        ...data,
        books: transformedBooks,
        recommendations: recommendations,
      });
      setNumberOfBooks(transformedBooks.length);
    }

    setIsLoading(false);
  }, [listId]);

  async function addRecommendation(username) {
    await fetch(
      `https://graph-library-kl-default-rtdb.europe-west1.firebasedatabase.app/Lists/${listId}/recommendations.json`,
      {
        method: "POST",
        body: JSON.stringify(username),
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
    addRecommendation("Guest");
  };

  const recommendButton = isRecommended ? (
    <div className={classes["feedback-message"]}>Recommended</div>
  ) : (
    <div className={classes.double}>
      <button className={classes.button} onClick={onRecommendHandler}>
        Recommend
      </button>
    </div>
  );

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
                <div>Recommendations: {list.recommendations}</div>
                {recommendButton}
              </div>
            </div>
            <BookList
              books={list.books}
              listId={props.listId}
              action={props.action}
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
