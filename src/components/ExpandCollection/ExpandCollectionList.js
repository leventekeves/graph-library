import { Fragment } from "react";
import ExpandCollectionItem from "./ExpandCollectionItem";

const ExpandCollectionList = (props) => {
  return (
    <Fragment>
      {props.books.map((book) => {
        return (
          <ExpandCollectionItem
            key={book.id}
            book={book}
            location={props.location}
          />
        );
      })}
    </Fragment>
  );
};

export default ExpandCollectionList;
