import classes from "./BookItem.module.css";
import { Link } from "react-router-dom";

const BookItem = (props) => {
  return (
    <Link to={`books/${props.id}`} style={{ textDecoration: "none" }}>
      <div className={classes["book-item"]}>
        <div>{props.title}</div>
        <div>{props.author}</div>
        <div>{props.pages}</div>
        <div>{props.year}</div>
        <div>{props.category}</div>
      </div>
    </Link>
  );
};

export default BookItem;
