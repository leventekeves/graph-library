import { useState } from "react";
import classes from "./AdminNewBook.module.css";

const AdminNewBook = () => {
  const [newBook, setNewBook] = useState({});

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

  const handleChange = (e) => {
    setNewBook({
      ...newBook,
      [e.target.name]: e.target.value.trim(),
    });
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();
    console.log(newBook);
    addBookHandler(newBook);
  };

  return (
    <div className={classes.container}>
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
          <input name="description" type="text" onChange={handleChange} />
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
        <div className={classes["new-book--single"]}>
          <label>ID:</label>
          <input name="id" type="text" onChange={handleChange} />
        </div>
        <button className={classes["add-book"]}>Add Book</button>
      </form>
    </div>
  );
};

export default AdminNewBook;
