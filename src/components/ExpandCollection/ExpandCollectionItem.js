import { useState } from "react";
import Button from "../Layout/Button";
import classes from "./ExpandCollectionItem.module.css";

async function addBookToVoteListPost(book) {
  await fetch(
    `https://graph-library-kl-default-rtdb.europe-west1.firebasedatabase.app/VoteList.json`,
    {
      method: "POST",
      body: JSON.stringify({ ...book, votes: 1 }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

async function addBookToLibrary(book) {
  await fetch(
    `https://graph-library-kl-default-rtdb.europe-west1.firebasedatabase.app/VoteList/${book.idfirebase}.json`,
    {
      method: "DELETE",
    }
  );

  delete book.id;
  delete book.idfirebase;

  await fetch(
    `https://graph-library-kl-default-rtdb.europe-west1.firebasedatabase.app/Books.json`,
    {
      method: "POST",
      body: JSON.stringify({ ...book, stock: 3 }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

async function updateVotes(bookId, newVotes) {
  await fetch(
    `https://graph-library-kl-default-rtdb.europe-west1.firebasedatabase.app/VoteList/${bookId}/votes.json`,
    {
      method: "PUT",
      body: JSON.stringify(newVotes),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

const ExpandCollectionItem = (props) => {
  document.cookie = "cookie1=value1; SameSite=Lax";

  const [showDescription, setShowDescription] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const onShowDescriptionHandler = () => {
    setShowDescription(!showDescription);
  };

  const addBookToVoteListHandler = () => {
    addBookToVoteListPost(...Object.values(props));
    setIsPressed(true);
  };

  const voteHandler = () => {
    if (props.book.votes > 1) {
      addBookToLibrary(props.book);
      setIsAdded(true);
    } else {
      updateVotes(props.book.idfirebase, +props.book.votes + 1);
    }
    setIsPressed(true);
  };

  if (!isAdded) {
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
  }

  if (isAdded) {
    return (
      <div className={classes["added-message"]}>Book added to library!</div>
    );
  }
};

export default ExpandCollectionItem;
