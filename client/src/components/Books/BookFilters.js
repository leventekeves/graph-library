import { useState } from "react";

import Button from "../Layout/Button";
import classes from "./BookFilters.module.css";
import YearSelector from "./YearSelector";

const BookFilters = (props) => {
  const [categorySelected, setCategorySelected] = useState();

  const categories = [
    "Fantasy",
    "Crime",
    "Drama",
    "Horror",
    "Mystery",
    "Romance",
    "Science Fiction",
    "Thriller",
    "Young Adult",
    "History",
    "Biography",
    "True Crime",
    "Science",
  ].sort();

  const categoryFilterHandler = (event) => {
    setCategorySelected(event.target.value);
    props.onCategorySelect(event.target.value);
  };

  const yearFilterHandler = (value) => {
    props.onYearSelect(value);
  };

  const removeFilterHandler = () => {
    props.onRemoveFilter();
    setCategorySelected("");
  };

  return (
    <div className={classes["filter-container"]}>
      <div className={classes["filter-title"]}>Filter</div>
      <div className={classes.center}>
        <Button onClick={removeFilterHandler}>Reset Filters</Button>
      </div>

      <div className={classes["year-filter--title"]}>Year</div>
      <div className={classes["year-filter--selector"]}>
        <YearSelector onYearSelect={yearFilterHandler} />
      </div>
      <div className={classes["category-filter--title"]}>Categories</div>
      {categories.map((category, index) => {
        return (
          <option
            key={index}
            onClick={categoryFilterHandler}
            value={category}
            className={
              categorySelected === category
                ? classes["category-item-selected"]
                : classes["category-item"]
            }
            disabled={categorySelected === category ? true : false}
          >
            {category}
          </option>
        );
      })}
    </div>
  );
};

export default BookFilters;
