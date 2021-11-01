import classes from "./CommentItem.module.css";

const CommentItem = (props) => {
  return (
    <div className={classes["comment-item"]}>
      <div className={classes["comment-item--header"]}>
        <p>{props.userId}</p>
        <p>{props.date}</p>
      </div>
      <div className={classes["comment-item--content"]}>{props.comment}</div>
    </div>
  );
};

export default CommentItem;
