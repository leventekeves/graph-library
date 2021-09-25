import { useState } from "react/cjs/react.development";
import classes from "./AdminUserItem.module.css";

async function banUser(userId) {
  await fetch(
    `https://graph-library-kl-default-rtdb.europe-west1.firebasedatabase.app/Users/${userId}.json`,
    {
      method: "DELETE",
    }
  );
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
