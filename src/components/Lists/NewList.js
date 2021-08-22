import { Fragment, useContext, useState } from "react";
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
    <Fragment>
      <form className={classes.container} onSubmit={onSubmitHandler}>
        <label>List Name</label>
        <input name="name" type="text" onChange={handleChange} />
        <label>Description</label>
        <input name="description" type="text" onChange={handleChange} />
        <Button>Create New List</Button>
      </form>
    </Fragment>
  );
};

export default NewList;
