import { useEffect, useState } from "react";
import { app } from "../../base";

import Button from "../Layout/Button";
import classes from "./AdminNewBook.module.css";

import noCover from "../../utility/nocover.png";

async function addBookHandler(book) {
  const response = await fetch("/book", {
    method: "POST",
    body: JSON.stringify(book),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.ok;
}

async function editBookHandler(book) {
  const response = await fetch("/book", {
    method: "PUT",
    body: JSON.stringify(book),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.ok;
}

const AdminNewBook = (props) => {
  const [file, setFile] = useState();
  const [newBook, setNewBook] = useState({});
  const [cover, setCover] = useState();
  const [coverChanged, setCoverChanged] = useState(false);
  const [bookAdded, setBookAdded] = useState(false);
  const [bookEdited, setBookEdited] = useState(false);

  const categories = [
    "Fantasy",
    "Drama",
    "Horror",
    "Mystery",
    "Romance",
    "Science Fiction",
    "Thriller",
    "Young Adult",
    "History",
    "Biography",
    "True Crime",
    "Science",
  ].sort();

  useEffect(() => {
    if (props?.book) {
      setNewBook(props.book);
    }
    if (props?.book?.cover && props?.book?.cover !== "https://undefined") {
      setCover(
        <img
          className={classes["book-cover"]}
          src={props.book.cover}
          alt="cover"
        />
      );
    } else {
      setCover(
        <img className={classes["book-cover"]} src={noCover} alt="noCover" />
      );
    }
  }, [props]);

  const handleChange = (event) => {
    setNewBook({
      ...newBook,
      [event.target.name]: event.target.value.trim(),
    });
  };

  const onAddBookSubmitHandler = (event) => {
    event.preventDefault();

    if (coverChanged) {
      const storageRef = app.storage().ref();
      const fileRef = storageRef.child(`covers/${file.name}`);
      fileRef.put(file);
      addBookHandler({
        ...newBook,
        cover: `https://firebasestorage.googleapis.com/v0/b/graph-library-kl.appspot.com/o/covers%2F${file.name}?alt=media`,
      }).then((response) => {
        if (response) setBookAdded(true);
      });
    } else {
      addBookHandler({
        ...newBook,
        cover: `https://undefined`,
      }).then((response) => {
        if (response) setBookAdded(true);
      });
    }
  };

  const onEditBookSubmitHandler = (event) => {
    event.preventDefault();

    if (coverChanged) {
      const storageRef = app.storage().ref();
      const fileRef = storageRef.child(`covers/${file.name}`);
      fileRef.put(file);

      editBookHandler({
        ...newBook,
        cover: `https://firebasestorage.googleapis.com/v0/b/graph-library-kl.appspot.com/o/covers%2F${file.name}?alt=media`,
      }).then((response) => {
        if (response) setBookEdited(true);
      });
    } else {
      editBookHandler({
        ...newBook,
        cover: props.book.cover,
      }).then((response) => {
        if (response) setBookEdited(true);
      });
    }
  };

  const fileSelectedHandler = (event) => {
    setFile(event.target.files[0]);

    setCover(
      <img
        className={classes["book-cover"]}
        src={URL.createObjectURL(event.target.files[0])}
        alt="cover"
      />
    );

    setCoverChanged(true);
  };

  if (bookAdded) {
    return <div className={classes["feedback-message"]}>Book Added!</div>;
  } else if (bookEdited) {
    return <div className={classes["feedback-message"]}>Book Edited!</div>;
  } else if (props.book) {
    return (
      <div className={classes.container} spellCheck={"false"}>
        <form
          className={classes["new-book"]}
          onSubmit={onEditBookSubmitHandler}
        >
          <div className={classes["new-book--double"]}>
            <label>Title</label>
            <input
              name="title"
              type="text"
              onChange={handleChange}
              defaultValue={props.book.title}
              required
            />
          </div>
          <div className={classes["new-book--double"]}>
            <label>Author</label>
            <input
              name="author"
              type="text"
              onChange={handleChange}
              defaultValue={props.book.author}
              required
            />
          </div>
          <div className={classes["new-book--double"]}>
            <label>Description</label>
            <textarea
              name="description"
              className={classes["description"]}
              onChange={handleChange}
              defaultValue={props.book.description}
              required
            ></textarea>
          </div>
          <div className={classes["new-book--single"]}>
            <label>Pages</label>
            <input
              name="pages"
              type="number"
              onChange={handleChange}
              defaultValue={props.book.pages}
              required
            />
          </div>
          <div className={classes["new-book--single"]}>
            <label>Category</label>
            <select
              name="category"
              onChange={handleChange}
              defaultValue={props.book.category}
              className={classes["category-select"]}
              required
            >
              {categories.map((category, index) => {
                return (
                  <option key={`category${index}`} value={category}>
                    {category}
                  </option>
                );
              })}
            </select>
          </div>
          <div className={classes["new-book--single"]}>
            <label>In Stock</label>
            <input
              name="stock"
              type="tenumberxt"
              onChange={handleChange}
              defaultValue={props.book.stock}
              required
            />
          </div>
          <div className={classes["new-book--single"]}>
            <label>Release Year:</label>
            <input
              name="year"
              type="number"
              onChange={handleChange}
              defaultValue={props.book.year}
              required
            />
          </div>
          <div className={classes["new-book--double"]}>
            <label>Cover:</label>
            {cover}
            <input type="file" onChange={fileSelectedHandler} />
          </div>
          <Button className={classes["add-book"]}>Edit Book</Button>
        </form>
      </div>
    );
  } else {
    return (
      <div className={classes.container} spellCheck={"false"}>
        <form className={classes["new-book"]} onSubmit={onAddBookSubmitHandler}>
          <div className={classes["new-book--double"]}>
            <label>Title</label>
            <input name="title" type="text" onChange={handleChange} required />
          </div>
          <div className={classes["new-book--double"]}>
            <label>Author</label>
            <input name="author" type="text" onChange={handleChange} required />
          </div>
          <div className={classes["new-book--double"]}>
            <label>Description</label>
            <textarea
              name="description"
              className={classes["description"]}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div className={classes["new-book--single"]}>
            <label>Pages</label>
            <input
              name="pages"
              type="number"
              onChange={handleChange}
              required
            />
          </div>
          <div className={classes["new-book--single"]}>
            <label>Category</label>
            <select
              name="category"
              onChange={handleChange}
              className={classes["category-select"]}
              required
            >
              <option key={"Select category"} value={""}>
                {"Select category"}
              </option>
              {categories.map((category, index) => {
                return (
                  <option key={`category${index}`} value={category}>
                    {category}
                  </option>
                );
              })}
            </select>
          </div>
          <div className={classes["new-book--single"]}>
            <label>In Stock</label>
            <input
              name="stock"
              type="number"
              onChange={handleChange}
              required
            />
          </div>
          <div className={classes["new-book--single"]}>
            <label>Release Year:</label>
            <input name="year" type="number" onChange={handleChange} required />
          </div>
          <div className={classes["new-book--double"]}>
            <label>Cover:</label>
            {cover}
            <input type="file" onChange={fileSelectedHandler} />
          </div>
          <Button className={classes["add-book"]}>Add Book</Button>
        </form>
      </div>
    );
  }
};

export default AdminNewBook;
