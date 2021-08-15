import { Fragment, useState } from "react";
import classes from "./AdminContent.module.css";
import AdminNewBook from "./AdminNewBook";
import AdminUserList from "./AdminUserList";

const AdminContent = () => {
  const [adminFunction, setAdminFunction] = useState("Admin Page");

  const loadNewBookFunction = () => {
    setAdminFunction("New Book");
  };

  const loadUserList = () => {
    setAdminFunction("User List");
  };

  let content;

  if (adminFunction === "New Book") {
    content = <AdminNewBook />;
  }
  if (adminFunction === "User List") {
    content = <AdminUserList />;
  }

  return (
    <Fragment>
      <div className={classes["admin-panel"]}>
        <button
          className={classes["admin-button"]}
          onClick={loadNewBookFunction}
        >
          Add New Book
        </button>
        <button className={classes["admin-button"]} onClick={loadUserList}>
          User List
        </button>
      </div>
      {content}
    </Fragment>
  );
};

export default AdminContent;
