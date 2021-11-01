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
      const transformedBooks = [];
      for (const key in data) {
        const bookObj = {
          id: key,
          ...data[key],
        };

        transformedBooks.push(bookObj);
      }
      setBooks(transformedBooks);
      setIsLoading(false);
    });
  }, []);

  return (
    <div className={classes.container}>
      <div>
        {isLoading ? (
          ""
        ) : (
          <ExpandCollectionList books={books} location="vote" />
        )}
      </div>
    </div>
  );
};

export default ExpandCollectionVote;
