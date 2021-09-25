import AdminUserItem from "./AdminUserItem";
import classes from "./AdminUserList.module.css";

const AdminUserList = (props) => {
  return (
    <div className={classes.container}>
      <div className={classes.labels}>
        <div className={classes["label-border"]}>Name</div>
        <div className={classes["label-border"]}>E-mail</div>
        <div className={classes["label"]}>Ban User</div>
      </div>

      {props.users.map((user) => {
        return <AdminUserItem key={user.id} user={user} />;
      })}
    </div>
  );
};

export default AdminUserList;
