const YearSelector = (props) => {
  let startYear = 1940;
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
      name="testname"
      id="testid"
      onChange={onChangeHandler}
      defaultValue={"Select year"}
    >
      <option key={"Select year"} value={"Select year"}>
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
