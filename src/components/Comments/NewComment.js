import { Fragment, useRef, useState } from "react";

import classes from "./NewComment.module.css";

const NewComment = (props) => {
  const commentInputRef = useRef();
  const [succesMessage, setSuccesMessage] = useState("");

  async function addCommentHandler(comment) {
    await fetch(
      "https://graph-library-kl-default-rtdb.europe-west1.firebasedatabase.app/Comments.json",
      {
        method: "POST",
        body: JSON.stringify(comment),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const onSubmitHandler = (event) => {
    event.preventDefault();

    let formatedDate;
    const date = new Date();

    //prettier-ignore
    const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

    formatedDate =
      "" +
      date.getDate() +
      " " +
      monthNames[date.getMonth()] +
      " " +
      date.getFullYear() +
      ", " +
      date.getHours() +
      ":" +
      ((date.getMinutes() < 10 ? "0" : "") + date.getMinutes());

    const comment = {
      bookid: props.currentBook,
      commenter: "Guest",
      date: formatedDate,
      message: commentInputRef.current.value,
    };
    addCommentHandler(comment);
    commentInputRef.current.value = "";
    setSuccesMessage(
      "New comment added, it will appear shortly! If you can't see your comment in a few seconds, reload the page!"
    );
    props.onNewComment(true);
  };

  return (
    <Fragment>
      <div>
        <form onSubmit={onSubmitHandler} className={classes["new-comment"]}>
          <textarea
            className={classes["new-comment--input"]}
            ref={commentInputRef}
          ></textarea>
          <button className={classes["new-comment--button"]}>
            New Comment
          </button>
        </form>
      </div>
      <div className={classes["new-comment--success"]}>{succesMessage}</div>
    </Fragment>
  );
};

export default NewComment;
