import { useContext, useState } from "react";
import AuthContext from "../../store/auth-context";
import Button from "../Layout/Button";
import classes from "./NewList.module.css";

async function newListHandler(list) {
  await fetch(
    "https://graph-library-kl-default-rtdb.europe-west1.firebasedatabase.app/Lists.json",
    {
      method: "POST",
      body: JSON.stringify(list),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

const NewList = () => {
  const date = new Date();
  const authCtx = useContext(AuthContext);
  const [newList, setNewList] = useState({ date: date, creator: authCtx.id });

  const handleChange = (event) => {
    setNewList({
      ...newList,
      [event.target.name]: event.target.value.trim(),
    });
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();
    newListHandler(newList);
    event.target.reset();
  };

  return (
    <div className={classes.container}>
      <div className={classes["form-container"]}>
        <div className={classes.title}>New List</div>
        <form onSubmit={onSubmitHandler}>
          <div className={classes.label}>List Name</div>
          <input
            name="name"
            type="text"
            onChange={handleChange}
            className={classes.input}
          />
          <div className={classes.label}>Description</div>
          <input
            name="description"
            type="text"
            onChange={handleChange}
            className={classes.input}
          />
          <div className={classes["button-container"]}>
            <Button>Create New List</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewList;
