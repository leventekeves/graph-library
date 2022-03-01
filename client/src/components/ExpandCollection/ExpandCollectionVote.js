import { useEffect, useState } from "react";
import Pagination from "../../utility/Pagination";

import ExpandCollectionList from "./ExpandCollectionList";
import classes from "./ExpandCollectionVote.module.css";
import LoadingSpinner from "../../utility/LoadingSpinner";

async function getBooks(pageNumber, itemsPerPage) {
  const response = await fetch(
    `/expand?pagenumber=${pageNumber}&itemsperpage=${itemsPerPage}`
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

  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const itemsPerPage = 3;

  useEffect(() => {
    let isActive = true;

    getBooks(currentPage, itemsPerPage).then((data) => {
      if (isActive) {
        setBooks(data.bookArr);
        setPageCount(Math.ceil(data.numberOfBooks / itemsPerPage));
        setIsLoading(false);
      }
    });
    return () => {
      isActive = false;
    };
  }, [currentPage, isLoading]);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
    window.scrollTo(0, 0);
  };

  let content;
  if (isLoading) {
    return (
      <div className={classes.center}>
        <LoadingSpinner />
      </div>
    );
  }

  if (!isLoading) {
    if (books?.length > 0) {
      content = (
        <div>
          <ExpandCollectionList books={books} location="vote" />
          <Pagination pageCount={pageCount} handlePageClick={handlePageClick} />
        </div>
      );
    } else {
      content = <div>No books found!</div>;
    }
  } else {
    content = "";
  }

  return <div className={classes.container}>{content}</div>;
};

export default ExpandCollectionVote;
