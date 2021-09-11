import { useEffect, useState } from "react/cjs/react.development";

import ExpandCollectionList from "./ExpandCollectionList";
import classes from "./ExpandCollectionVote.module.css";

async function getBooks() {
  const response = await fetch(
    "https://graph-library-kl-default-rtdb.europe-west1.firebasedatabase.app/VoteList.json"
  );
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
          idfirebase: key,
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
