import { Fragment } from "react";
import BookList from "../Books/BookList";
import classes from "./ListCard.module.css";

const ListCard = () => {
  return (
    <Fragment>
      <div className={classes.container}>
        <div>
          <div className={classes.title}>Név</div>
          <BookList />
        </div>
        <div className={classes.miscellaneous}>
          <div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam
            optio sunt voluptas et ipsum, quas repudiandae. Officia beatae
            dolore architecto provident eum, amet aut laudantium, pariatur et
            atque nisi aspernatur?
          </div>
          <div>Könyvek száma</div>
          <div>Ajánlások száma</div>
        </div>
      </div>
    </Fragment>
  );
};

export default ListCard;
