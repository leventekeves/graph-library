import classes from "./BooksContent.module.css";
import BookList from "./BookList";
import { useState, useRef } from "react";

const BooksContent = () => {
  const [books, setBooks] = useState([]);
  const [searchItem, setSearchItem] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const searchInputRef = useRef();
  const yearInputRef = useRef();

  let content;

  async function fetchBooksHandler(event) {
    const response = await fetch(
      "https://graph-library-kl-default-rtdb.europe-west1.firebasedatabase.app/Books.json"
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Could not fetch books.");
    }

    const transformedBooks = [];

    for (const id in data) {
      const bookObj = {
        ...data[id],
      };

      transformedBooks.push(bookObj);
    }
    console.log(data);
    console.log(transformedBooks);
    setBooks(transformedBooks);
  }

  content = (
    <BookList
      books={books}
      search={searchItem}
      year={yearFilter}
      category={categoryFilter}
    />
  );

  const submitHandler = (event) => {
    event.preventDefault();
    setSearchItem(searchInputRef.current.value);
    setYearFilter(yearInputRef.current.value);

    fetchBooksHandler();
  };

  const categoryFilterHandler = (props) => {
    if (props.target.innerText === "Remove filter") {
      setCategoryFilter("");
    } else {
      setCategoryFilter(props.target.innerText);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.search}>
        <form className={classes["search--input"]} onSubmit={submitHandler}>
          <div className={classes["filter-container"]}>
            <div className={classes["filter-title"]}>Filter</div>
            <div className={classes["year-filter--title"]}>Év</div>
            <input type="number" placeholder="Év..." ref={yearInputRef} />
            <div className={classes["category-filter--title"]}>Kategóriák</div>
            <div
              onClick={categoryFilterHandler}
              className={classes["category-item"]}
            >
              Remove filter
            </div>
            <div
              onClick={categoryFilterHandler}
              className={classes["category-item"]}
            >
              Category 1
            </div>
            <div
              onClick={categoryFilterHandler}
              className={classes["category-item"]}
            >
              Category 2
            </div>
            <div
              onClick={categoryFilterHandler}
              className={classes["category-item"]}
            >
              Category 3
            </div>
          </div>
          <input
            type="text"
            className={classes["search--field"]}
            placeholder="Könyv keresése..."
            ref={searchInputRef}
          />
          <button className={classes["search--button"]}>Keresés</button>
        </form>
        {content}
      </div>
    </div>
  );
};

export default BooksContent;
