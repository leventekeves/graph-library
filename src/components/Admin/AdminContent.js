import { Fragment, useState } from "react";
import Button from "../Layout/Button";
import classes from "./AdminContent.module.css";
import AdminNewBook from "./AdminNewBook";
import AdminManageUsers from "./AdminManageUsers";

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
    content = <AdminManageUsers />;
  }

  return (
    <Fragment>
      <div className={classes["admin-panel"]}>
        <Button onClick={loadNewBookFunction}>Add New Book</Button>
        <Button onClick={loadUserList}>User List</Button>
      </div>
      {content}
    </Fragment>
  );
};

export default AdminContent;
