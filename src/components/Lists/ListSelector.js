import { Fragment, useCallback, useEffect, useRef, useState } from "react";

import classes from "./ListSelector.module.css";

const ListSelector = (props) => {
  const [dropdown, setDropdown] = useState(
    <select defaultValue={"Select list"} className={classes.select}>
      <option key={"Select list"} value={"Select list"}>
        {"Select  list"}
      </option>
    </select>
  );

  const listRef = useRef();

  const fetchLists = useCallback(async () => {
    const response = await fetch(
      "https://graph-library-kl-default-rtdb.europe-west1.firebasedatabase.app/Lists.json"
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Could not fetch lists.");
    }

    const transformedLists = [];
    const onListSelectHandler = (event) => {
      props.onListSelect(event.target.value);
    };

    for (const key in data) {
      const listObj = {
        id: key,
        ...data[key],
      };

      transformedLists.push(listObj);
    }

    const dropdownMapped = (
      <select
        defaultValue={"Select list"}
        ref={listRef}
        onChange={onListSelectHandler}
      >
        <option key={"Select list"} value={"Select list"}>
          {"Select list"}
        </option>
        {transformedLists.map((year) => {
          return (
            <option key={year.id} value={year.id}>
              {year.name}
            </option>
          );
        })}
      </select>
    );

    setDropdown(dropdownMapped);
  }, [props]);

  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  return <Fragment>{dropdown}</Fragment>;
};

export default ListSelector;
