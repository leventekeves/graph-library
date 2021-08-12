import { Fragment, useRef } from "react";

import classes from "./NewComment.module.css";

const NewComment = (props) => {
  const commentInputRef = useRef();

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
      date.getMinutes();

    const comment = {
      bookid: props.currentBook,
      commenter: "Guest",
      date: formatedDate,
      message: commentInputRef.current.value,
    };
    addCommentHandler(comment);
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
    </Fragment>
  );
};

export default NewComment;