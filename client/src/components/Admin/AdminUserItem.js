import { useState } from "react";
import classes from "./AdminUserItem.module.css";

async function banUser(userId) {
  await fetch(`/user`, {
    method: "DELETE",
    body: JSON.stringify({ userId: userId }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

const AdminUserItem = (props) => {
  const [isBanned, setIsBanned] = useState(false);

  const banHandler = () => {
    banUser(props.user.id);
    setIsBanned(true);
  };

  return (
    <div className={`${isBanned ? classes.hidden : classes.container}`}>
      <div className={classes["label-border"]}>{props.user.name}</div>
      <div className={classes["label-border"]}>{props.user.email}</div>
      <div className={classes.ban} onClick={banHandler}>
        Ban User
      </div>
    </div>
  );
};

export default AdminUserItem;
