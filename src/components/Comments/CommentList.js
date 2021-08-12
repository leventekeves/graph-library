import { useEffect, useState } from "react";
import CommentItem from "./CommentItem";
import classes from "./CommentList.module.css";

const CommentList = (props) => {
  const [comments, setComments] = useState([]);

  async function getComments() {
    const response = await fetch(
      "https://graph-library-kl-default-rtdb.europe-west1.firebasedatabase.app/Comments.json"
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Could not fetch books.");
    }

    const transformedComments = [];

    for (const key in data) {
      const commentObj = {
        id: key,
        ...data[key],
      };

      transformedComments.push(commentObj);
    }
    setComments(transformedComments);
  }

  useEffect(() => {
    getComments();
  }, []);

  return (
    <div className={classes["comment-container"]}>
      {comments
        .map((comment) => {
          if (+props.currentBook === +comment.bookid) {
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
