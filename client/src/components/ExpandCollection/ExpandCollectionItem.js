import { useCallback, useContext, useEffect, useState } from "react";
import AuthContext from "../../store/auth-context";
import Button from "../Layout/Button";
import classes from "./ExpandCollectionItem.module.css";
import noCover from "../../utility/nocover.png";

async function addBookToVoteListPost(book, userId) {
  const response = await fetch(`/expand`, {
    method: "POST",
    body: JSON.stringify({ ...book, userId }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not fetch books.");
  }
  return data;
}

async function addBookToLibrary(book) {
  await fetch(`/expand`, {
    method: "DELETE",
    body: JSON.stringify({ bookId: book.id }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  await fetch(`/book`, {
    method: "POST",
    body: JSON.stringify({ ...book, stock: 3 }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

async function updateVotes(bookId, userId) {
  await fetch(`/expand/vote`, {
    method: "POST",
    body: JSON.stringify({ bookId: bookId, userId: userId }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

const ExpandCollectionItem = (props) => {
  document.cookie = "cookie1=value1; SameSite=Lax";

  const [showDescription, setShowDescription] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [canVote, setCanVote] = useState(true);
  const [numberOfVotes, setNumberOfVotes] = useState(props.book.votes);

  const authCtx = useContext(AuthContext);

  const onShowDescriptionHandler = () => {
    setShowDescription(!showDescription);
  };

  const addBookToVoteListHandler = () => {
    addBookToVoteListPost(props.book, authCtx.id).then((data) => {
      authCtx.votes.push({ bookId: data.bookId });
    });
    setIsPressed(true);
  };

  const alreadyVoted = useCallback(() => {
    for (let i = 0; i < authCtx.votes.length; i++) {
      if (+authCtx.votes[i].bookId === +props.book.id) {
        setCanVote(false);
        break;
      } else {
        setCanVote(true);
      }
    }
  }, [authCtx.votes, props.book.id]);

  useEffect(() => {
    alreadyVoted();
  }, [alreadyVoted]);

  const voteHandler = () => {
    if (props.book.votes >= 2) {
      addBookToLibrary(props.book);
      setIsAdded(true);
    } else {
      updateVotes(props.book.id, authCtx.id);
    }
    setIsPressed(true);
    authCtx.votes.push({ bookId: +props.book.id });
    setNumberOfVotes(numberOfVotes + 1);
  };

  if (isAdded) {
    return (
      <div className={classes["added-message"]}>Book added to library!</div>
    );
  }

  if (!isAdded) {
    return (
      <div className={classes.container}>
        <div
          className={classes["book-item"]}
          onClick={onShowDescriptionHandler}
        >
          <div>
            {props.book.cover === "https://undefined" ? (
              <img className={classes.cover} src={noCover} alt="noCover" />
            ) : (
              <img
                className={classes.cover}
                src={props.book.cover}
                alt="cover"
              />
            )}
          </div>
          <div>
            <div>{props.book.title}</div>
            <div>{props.book.author}</div>
            <div>{props.book.pages} pages</div>
            <div>Category: {props.book.category}</div>
            <div>Released in {props.book.year}</div>
            {props.location === "vote" ? <div>Votes: {numberOfVotes}</div> : ""}
            {showDescription ? (
              <div className={classes}>
                Description: {props.book.description}
              </div>
            ) : (
              <div>Description: Click to show</div>
            )}
          </div>
        </div>
        {props.location === "add" ? (
          isPressed ? (
            "Added"
          ) : (
            <Button onClick={addBookToVoteListHandler}>Add</Button>
          )
        ) : (
          ""
        )}
        {props.location === "vote" ? (
          isPressed || !canVote ? (
            "Voted"
          ) : (
            <Button onClick={voteHandler}>Vote</Button>
          )
        ) : (
          ""
        )}
      </div>
    );
  } else {
    return "";
  }
};

export default ExpandCollectionItem;
