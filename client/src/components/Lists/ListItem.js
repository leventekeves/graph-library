import { Link } from "react-router-dom";
import classes from "./ListItem.module.css";

const ListItem = (props) => {
  //const transformedBooks = Object.values(props.books);

  let formatedDate;
  const date = new Date(props.date);

  //prettier-ignore
  const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

  formatedDate =
    "" +
    date.getDate() +
    " " +
    monthNames[date.getMonth()] +
    " " +
    date.getFullYear() +
    ", " +
    date.getHours() +
    ":" +
    ((date.getMinutes() < 10 ? "0" : "") + date.getMinutes());

  if (props.numberOfBooks > 0) {
    return (
      <Link to={`/lists/${props.id}`} style={{ textDecoration: "none" }}>
        <div className={classes["list-item"]}>
          <div>
            <p>{props.name}</p>
            {+props.numberOfBooks === 1 ? (
              <p>{props.numberOfBooks} book</p>
            ) : (
              <p>{props.numberOfBooks} books</p>
            )}
          </div>
          <div>{props.recommendations || 0} recommendations</div>
          <div>{formatedDate}</div>
        </div>
      </Link>
    );
  } else {
    return "";
  }
};

export default ListItem;
