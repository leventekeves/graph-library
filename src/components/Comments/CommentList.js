import { useEffect, useState } from "react";
import CommentItem from "./CommentItem";
import classes from "./CommentList.module.css";

async function getComments(currentBook) {
  const response = await fetch(
    `https://graph-library-kl-default-rtdb.europe-west1.firebasedatabase.app/Books/${currentBook}/comments.json`
  );
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
          if (props.currentBook === comment.bookid) {
            return (
              <CommentItem
                key={comment.id}
                message={comment.message}
                commenter={comment.commenter}
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
