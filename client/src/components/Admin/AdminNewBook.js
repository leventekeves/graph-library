import { useState } from "react";
import { app } from "../../base";

import Button from "../Layout/Button";
import classes from "./AdminNewBook.module.css";

async function addBookHandler(book) {
  await fetch(
    "https://graph-library-kl-default-rtdb.europe-west1.firebasedatabase.app/Books.json",
    {
      method: "POST",
      body: JSON.stringify(book),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

const AdminNewBook = () => {
  const [newBook, setNewBook] = useState({});
  let file;

  const handleChange = (event) => {
    setNewBook({
      ...newBook,
      [event.target.name]: event.target.value.trim(),
    });
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();

    const storageRef = app.storage().ref();
    const fileRef = storageRef.child(`covers/${file.name}`);
    fileRef.put(file);

    addBookHandler({
      ...newBook,
      cover: `https://firebasestorage.googleapis.com/v0/b/graph-library-kl.appspot.com/o/covers%2F${file.name}?alt=media`,
    });
  };

  const fileSelectedHandler = (event) => {
    file = event.target.files[0];
  };

  return (
    <div className={classes.container} spellCheck={"false"}>
      <form className={classes["new-book"]} onSubmit={onSubmitHandler}>
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
          <input type="file" onChange={fileSelectedHandler} />
        </div>
        <Button className={classes["add-book"]}>Add Book</Button>
      </form>
    </div>
  );
};

export default AdminNewBook;
