import { Link } from "react-router-dom";
import classes from "./ListItem.module.css";

const ListItem = (props) => {
  const transformedBooks = Object.values(props.books);
  return (
    <Link to={`/lists/${props.id}`} style={{ textDecoration: "none" }}>
      <div className={classes["list-item"]}>
        <div>
          <p>{props.name}</p>
          <p>{transformedBooks.length} books</p>
        </div>
        <div>{props.recommendations || 0} recommendations</div>
      </div>
    </Link>
  );
};

export default ListItem;
