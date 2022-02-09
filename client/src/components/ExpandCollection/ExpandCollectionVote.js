import { useEffect, useState } from "react";

import ExpandCollectionList from "./ExpandCollectionList";
import classes from "./ExpandCollectionVote.module.css";

async function getBooks() {
  const response = await fetch("/expand");
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not fetch books.");
  }
  return data;
}

const ExpandCollectionVote = () => {
  const [books, setBooks] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getBooks().then((data) => {
      setBooks(data);
      setIsLoading(false);
    });
  }, []);

  let content;
  if (!isLoading) {
    if (books?.length > 0) {
      content = <ExpandCollectionList books={books} location="vote" />;
    } else {
      content = <div>No books found!</div>;
    }
  } else {
    content = "";
  }

  return <div className={classes.container}>{content}</div>;
};

export default ExpandCollectionVote;
