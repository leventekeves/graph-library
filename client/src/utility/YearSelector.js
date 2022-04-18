import classes from "./YearSelector.module.css";

const YearSelector = (props) => {
  let startYear = 1600;
  const currentYear = new Date().getFullYear();
  const years = [];

  while (startYear < currentYear) {
    years.push(startYear);
    startYear++;
  }

  const onChangeHandler = (event) => {
    props.onYearSelect(event.target.value);
  };

  return (
    <select
      onChange={onChangeHandler}
      defaultValue={"Select year"}
      className={classes["year-select"]}
    >
      <option key={"Select year"} value={"Select year"} disabled>
        {"Select year"}
      </option>
      {years.map((year, index) => {
        return (
          <option key={`year${index}`} value={year}>
            {year}
          </option>
        );
      })}
    </select>
  );
};

export default YearSelector;
