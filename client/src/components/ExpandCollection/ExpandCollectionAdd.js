import { useCallback, useEffect, useRef, useState } from "react";

import classes from "./ExpandCollectionAdd.module.css";
import Button from "../Layout/Button";
import ExpandCollectionList from "./ExpandCollectionList";
import Pagination from "../../utility/Pagination";

async function getBooks(title, author, category, currentPage, itemsPerPage) {
  const titleSerach = title ? `+intitle:${title}` : "";
  const authorSearch = author ? `+inauthor:${author}` : "";
  const categorySearch = category ? `+subject:${category}` : "";

  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${titleSerach}${authorSearch}${categorySearch}&langRestrict=en&startIndex=${
      currentPage * itemsPerPage
    }&maxResults=${itemsPerPage}`
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not fetch books.");
  }

  return data;
}

const ExpandCollectionAdd = () => {
  const [books, setBooks] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [searchInputError, setSearchInputError] = useState(false);

  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [firstLoad, setFirstLoad] = useState(true);

  const itemsPerPage = 10;

  const titleInputRef = useRef();
  const authorInputRef = useRef();
  const categoryInputRef = useRef();

  const fetchBooks = useCallback(() => {
    getBooks(
      titleInputRef.current.value || "",
      authorInputRef.current.value || "",
      categoryInputRef.current.value || "",
      currentPage,
      itemsPerPage
    )
      .then((data) => {
        const transformedBooks = [];
        data.items.forEach((fetchedBook) => {
          const releaseYear = new Date(fetchedBook.volumeInfo.publishedDate);
          const slicedURL =
            fetchedBook.volumeInfo.imageLinks?.thumbnail?.slice(7);

          const bookObj = {
            id: fetchedBook.id,
            title: fetchedBook.volumeInfo.title,
            pages: undefined,
            author: "Unknown",
            category: "Uncategorized",
            year: releaseYear.getFullYear(),
            description: fetchedBook.volumeInfo.description,
            cover: `https://${slicedURL}`,
          };

          if (fetchedBook.volumeInfo.authors) {
            bookObj.author = fetchedBook.volumeInfo.authors[0];
          }

          if (fetchedBook.volumeInfo.categories) {
            bookObj.category = fetchedBook.volumeInfo.categories[0];
          }

          if (fetchedBook.volumeInfo.pageCount) {
            bookObj.pages = fetchedBook.volumeInfo.pageCount;
          }

          transformedBooks.push(bookObj);
        });
        setSearchInputError(false);
        setBooks(transformedBooks);
        setPageCount(Math.ceil(data.totalItems / itemsPerPage));
        setIsLoading(false);
        setFirstLoad(false);
      })
      .catch((error) => {
        console.log(error);
        setSearchInputError(true);
      });
  }, [currentPage]);

  useEffect(() => {
    if (!firstLoad) fetchBooks();
  }, [fetchBooks, firstLoad]);

  const onSubmitHandler = (event) => {
    event.preventDefault();
    fetchBooks();
  };

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
    window.scrollTo(0, 0);
  };

  return (
    <div className={classes.container}>
      <div className={classes.search}>
        <form onSubmit={onSubmitHandler}>
          <div>Title</div>
          <input
            type="text"
            ref={titleInputRef}
            className={classes["input-fields"]}
          />
          <div>Author</div>
          <input
            type="text"
            ref={authorInputRef}
            className={classes["input-fields"]}
          />
          <div>Category</div>
          <input
            type="text"
            ref={categoryInputRef}
            className={classes["input-fields"]}
          />
          <div className={classes.center}>
            <Button>Search</Button>
          </div>
          {searchInputError ? (
            <div className={classes.error}>
              At least 1 input field must be filled
            </div>
          ) : (
            ""
          )}
        </form>
      </div>

      <div>
        {isLoading ? (
          ""
        ) : (
          <div>
            <ExpandCollectionList books={books} location="add" />{" "}
            <Pagination
              pageCount={pageCount}
              handlePageClick={handlePageClick}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpandCollectionAdd;
