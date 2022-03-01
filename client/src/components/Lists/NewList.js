import { useContext, useState } from "react";
import AuthContext from "../../store/auth-context";
import Button from "../Layout/Button";
import classes from "./NewList.module.css";

async function newListHandler(newlist) {
  const response = await fetch("/list", {
    method: "POST",
    body: JSON.stringify(newlist),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.ok;
}

const NewList = () => {
  const date = new Date();
  const authCtx = useContext(AuthContext);
  const [newList, setNewList] = useState({ date: date, userId: authCtx.id });
  const [listCreated, setListCreated] = useState(false);

  const handleChange = (event) => {
    setNewList({
      ...newList,
      [event.target.name]: event.target.value.trim(),
    });
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();
    newListHandler(newList).then((response) => {
      if (response) {
        setListCreated(true);
      }
    });
  };

  if (!listCreated) {
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
  } else {
    return <div className={classes["feedback-message"]}>List Created!</div>;
  }
};

export default NewList;
