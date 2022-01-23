import { useEffect, useState } from "react";
import { app } from "../../base";

import Button from "../Layout/Button";
import classes from "./AdminNewBook.module.css";

async function addBookHandler(book) {
  await fetch("/book", {
    method: "POST",
    body: JSON.stringify(book),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

async function editBookHandler(book) {
  await fetch("/book", {
    method: "PUT",
    body: JSON.stringify(book),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

const AdminNewBook = (props) => {
  const [file, setFile] = useState();
  const [newBook, setNewBook] = useState({});
  const [cover, setCover] = useState();
  const [coverChanged, setCoverChanged] = useState(false);

  useEffect(() => {
    if (props?.book) {
      setNewBook(props.book);
    }
    if (props?.book?.cover) {
      setCover(
        <img
          className={classes["book-cover"]}
          src={props.book.cover}
          alt="cover"
        />
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

    const storageRef = app.storage().ref();
    const fileRef = storageRef.child(`covers/${file.name}`);
    fileRef.put(file);

    addBookHandler({
      ...newBook,
      cover: `https://firebasestorage.googleapis.com/v0/b/graph-library-kl.appspot.com/o/covers%2F${file.name}?alt=media`,
    });
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
      });
    } else {
      editBookHandler({
        ...newBook,
        cover: props.book.cover,
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

  if (props.book) {
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
            />
          </div>
          <div className={classes["new-book--double"]}>
            <label>Author</label>
            <input
              name="author"
              type="text"
              onChange={handleChange}
              defaultValue={props.book.author}
            />
          </div>
          <div className={classes["new-book--double"]}>
            <label>Description</label>
            <textarea
              name="description"
              className={classes["description"]}
              onChange={handleChange}
              defaultValue={props.book.description}
            ></textarea>
          </div>
          <div className={classes["new-book--single"]}>
            <label>Pages</label>
            <input
              name="pages"
              type="text"
              onChange={handleChange}
              defaultValue={props.book.pages}
            />
          </div>
          <div className={classes["new-book--single"]}>
            <label>Category</label>
            <input
              name="category"
              type="text"
              onChange={handleChange}
              defaultValue={props.book.category}
            />
          </div>
          <div className={classes["new-book--single"]}>
            <label>In Stock</label>
            <input
              name="stock"
              type="text"
              onChange={handleChange}
              defaultValue={props.book.stock}
            />
          </div>
          <div className={classes["new-book--single"]}>
            <label>Release Year:</label>
            <input
              name="year"
              type="text"
              onChange={handleChange}
              defaultValue={props.book.year}
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
            <input name="title" type="text" onChange={handleChange} />
          </div>
          <div className={classes["new-book--double"]}>
            <label>Author</label>
            <input name="author" type="text" onChange={handleChange} />
          </div>
          <div className={classes["new-book--double"]}>
            <label>Description</label>
            <textarea
              name="description"
              className={classes["description"]}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className={classes["new-book--single"]}>
            <label>Pages</label>
            <input name="pages" type="text" onChange={handleChange} />
          </div>
          <div className={classes["new-book--single"]}>
            <label>Category</label>
            <input name="category" type="text" onChange={handleChange} />
          </div>
          <div className={classes["new-book--single"]}>
            <label>In Stock</label>
            <input name="stock" type="text" onChange={handleChange} />
          </div>
          <div className={classes["new-book--single"]}>
            <label>Release Year:</label>
            <input name="year" type="text" onChange={handleChange} />
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
