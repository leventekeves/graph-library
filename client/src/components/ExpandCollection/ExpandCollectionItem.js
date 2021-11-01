import { useCallback, useContext, useEffect, useState } from "react";
import AuthContext from "../../store/auth-context";
import Button from "../Layout/Button";
import classes from "./ExpandCollectionItem.module.css";

async function addBookToVoteListPost(book, userId) {
  await fetch(`/expand`, {
    method: "POST",
    body: JSON.stringify({ ...book, userId }),
    headers: {
      "Content-Type": "application/json",
    },
  });
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

  const authCtx = useContext(AuthContext);

  const onShowDescriptionHandler = () => {
    setShowDescription(!showDescription);
  };

  const addBookToVoteListHandler = () => {
    addBookToVoteListPost(props.book, authCtx.id);
    setIsPressed(true);
  };

  const alreadyVoted = useCallback(() => {
    for (let i = 0; i < authCtx.votes.length; i++) {
      if (+authCtx.votes[i].bookId === +props.book.id) {
        console.log("cant vote");
        setCanVote(false);
        break;
      } else {
        console.log("can vote");
        setCanVote(true);
      }
    }
  }, [authCtx.votes, props.book.id]);

  useEffect(() => {
    alreadyVoted();
  }, [alreadyVoted]);

  const voteHandler = () => {
    if (props.book.votes > 2) {
      addBookToLibrary(props.book);
      setIsAdded(true);
    } else {
      updateVotes(props.book.id, authCtx.id);
    }
    setIsPressed(true);
    authCtx.votes.push({ bookId: +props.book.id });
  };

  if (isAdded) {
    return (
      <div className={classes["added-message"]}>Book added to library!</div>
    );
  }

  if (canVote && !isAdded) {
    return (
      <div className={classes.container}>
        <div
          className={classes["book-item"]}
          onClick={onShowDescriptionHandler}
        >
          <div>
            <img className={classes.cover} src={props.book.cover} alt="cover" />
          </div>
          <div>
            <div>{props.book.title}</div>
            <div>{props.book.author}</div>
            <div>{props.book.pages} pages</div>
            <div>Category: {props.book.category}</div>
            <div>Released in {props.book.year}</div>
            {props.location === "vote" ? (
              <div>Votes: {props.book.votes}</div>
            ) : (
              ""
            )}
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
          isPressed ? (
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
