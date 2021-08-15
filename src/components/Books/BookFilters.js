import classes from "./BookFilters.module.css";
import YearSelector from "./YearSelector";

const BookFilters = (props) => {
  const categories = ["Fantasy", "Crime", "Fiction"];

  const categoryFilterHandler = (event) => {
    props.onCategorySelect(event.target.value);
  };

  const yearFilterHandler = (value) => {
    props.onYearSelect(value);
  };

  return (
    <div className={classes["filter-container"]}>
      <div className={classes["filter-title"]}>Filter</div>
      <div className={classes["year-filter--title"]}>Year</div>
      <div className={classes["year-filter--selector"]}>
        <YearSelector onYearSelect={yearFilterHandler} />
      </div>
      <div className={classes["category-filter--title"]}>Categories</div>
      <option
        onClick={categoryFilterHandler}
        value=""
        className={classes["category-item"]}
      >
        Remove filters
      </option>
      {categories.map((category, index) => {
        return (
          <option
            key={index}
            onClick={categoryFilterHandler}
            value={category}
            className={classes["category-item"]}
          >
            {category}
          </option>
        );
      })}
    </div>
  );
};

export default BookFilters;
