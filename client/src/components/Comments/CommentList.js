import { useEffect, useState } from "react";
import CommentItem from "./CommentItem";
import classes from "./CommentList.module.css";

async function getComments(bookId) {
  const response = await fetch(`/book/comment/${bookId}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not fetch comments.");
  }

  return data;
}

const CommentList = (props) => {
  const [comments, setComments] = useState([]);
  const [firstRender, setFirstRender] = useState(true);

  useEffect(() => {
    if (firstRender) {
      getComments(props.currentBook).then((data) => {
        const transformedComments = [];

        for (const key in data) {
          const commentObj = {
            id: key,
            ...data[key],
          };

          transformedComments.push(commentObj);
        }
        setComments(transformedComments);
      });
      setFirstRender(false);
    }
    if (props.newCommentAdded) {
      setTimeout(() => {
        getComments(props.currentBook).then((data) => {
          const transformedComments = [];

          for (const key in data) {
            const commentObj = {
              id: key,
              ...data[key],
            };

            transformedComments.push(commentObj);
          }
          setComments(transformedComments);
        });
        props.onNewComment(false);
      }, 3000);
    }
  }, [props, firstRender]);

  return (
    <div className={classes["comment-container"]}>
      {comments
        .map((comment) => {
          if (true) {
            return (
              <CommentItem
                key={comment.id}
                comment={comment.comment}
                userId={comment.userId}
                date={comment.date}
              />
            );
          } else {
            return "";
          }
        })
        .reverse()}
    </div>
  );
};

export default CommentList;
