import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import classes from "./ListCard.module.css";
import BookList from "../Books/BookList";
import LoadingSpinner from "../../utility/LoadingSpinner";
import SubNavigation from "../Layout/SubNavigation";
import AuthContext from "../../store/auth-context";
import Button from "../Layout/Button";
import Pagination from "../../utility/Pagination";

async function addRecommendation(userId, listId) {
  await fetch(`/list/recommendation`, {
    method: "POST",
    body: JSON.stringify({ userId: userId, listId: listId }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

async function getList(listId, pageNumber, itemsPerPage) {
  const response = await fetch(`/list/${listId}/${pageNumber}/${itemsPerPage}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not fetch books.");
  }
  return data;
}

const ListCard = (props) => {
  let { listId } = useParams();
  const authCtx = useContext(AuthContext);

  const [list, setList] = useState();
  const [numberOfBooks, setNumberOfBooks] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [numberOfRecommendations, setNumberOfRecommendations] = useState(0);
  const [isRecommended, setIsRecommended] = useState(false);
  const [canRecommend, setCanRecommend] = useState(true);

  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const itemsPerPage = 2;

  if (!listId) {
    listId = props.listId;
  }

  const alreadyRecommended = useCallback(() => {
    if (!isLoading) {
      authCtx.recommendations.forEach((recommendation) => {
        if (recommendation.listId === list.id) {
          setCanRecommend(false);
        }
      });
    }
  }, [isLoading, authCtx.recommendations, list?.id]);

  useEffect(() => {
    getList(listId, currentPage, itemsPerPage).then((data) => {
      if (data.listArr[0]) {
        setList(data.listArr[0]);
        setNumberOfBooks(data.listArr[0].books.length);
      }
      setPageCount(Math.ceil(data.numberOfBooks / itemsPerPage));
      setIsLoading(false);
    });
  }, [listId, currentPage]);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
    window.scrollTo(0, 0);
  };

  const onRecommendHandler = () => {
    setIsRecommended(true);
    addRecommendation(authCtx.id, listId);
    setNumberOfRecommendations(list.recommendations + 1);
    authCtx.recommendations.push({ listId: +listId });
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
        <Button onClick={onRecommendHandler}>Recommend</Button>
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
    } else if (list.books.length > 0) {
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
                <div>
                  Recommendations:
                  {isRecommended
                    ? numberOfRecommendations
                    : list.recommendations}
                </div>
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
            <Pagination
              pageCount={pageCount}
              handlePageClick={handlePageClick}
            />
          </div>
        </Fragment>
      );
    }
  } else {
    return <div>This list is empty!</div>;
  }
};

export default ListCard;
