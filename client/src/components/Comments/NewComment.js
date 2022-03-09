import { Fragment, useContext, useRef, useState } from "react";

import classes from "./NewComment.module.css";
import AuthContext from "../../store/auth-context";
import Button from "../Layout/Button";

async function addCommentHandler(comment) {
  const response = await fetch("/comment", {
    method: "POST",
    body: JSON.stringify(comment),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.ok;
}

const NewComment = (props) => {
  const commentInputRef = useRef();
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const authCtx = useContext(AuthContext);

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
      userId: authCtx.id,
      bookId: props.currentBook,
      date: formatedDate,
      comment: commentInputRef.current.value,
    };

    addCommentHandler(comment, props.currentBook).then((response) => {
      if (response) {
        props.onNewComment(true);
        commentInputRef.current.value = "";
        setFeedbackMessage("New comment added!");
      } else {
        setFeedbackMessage("Something went wrong!");
      }
    });
  };

  return (
    <Fragment>
      <div>
        <form onSubmit={onSubmitHandler} className={classes["new-comment"]}>
          <textarea
            className={classes["new-comment--input"]}
            ref={commentInputRef}
          />
          <Button>New Comment</Button>
        </form>
      </div>
      <div className={classes["new-comment--success"]}>{feedbackMessage}</div>
    </Fragment>
  );
};

export default NewComment;
