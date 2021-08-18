import classes from "./BookFilters.module.css";
import YearSelector from "./YearSelector";

const BookFilters = (props) => {
  const categories = ["Fantasy", "Crime", "Fiction", "Horror"];

  const categoryFilterHandler = (event) => {
    props.onCategorySelect(event.target.value);
  };

  const yearFilterHandler = (value) => {
    props.onYearSelect(value);
  };

  const removeFilterHandler = () => {
    props.onRemoveFilter();
  };

  return (
    <div className={classes["filter-container"]}>
      <div className={classes["filter-title"]}>Filter</div>
      <div className={classes.center}>
        <button className={classes.button} onClick={removeFilterHandler}>
          Reset Filters
        </button>
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
