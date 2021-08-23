import { Fragment, useContext, useEffect, useRef, useState } from "react";
import AuthContext from "../../store/auth-context";

import classes from "./ListSelector.module.css";

async function fetchLists() {
  const response = await fetch(
    "https://graph-library-kl-default-rtdb.europe-west1.firebasedatabase.app/Lists.json"
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not fetch lists.");
  }

  return data;
}

const ListSelector = (props) => {
  const [dropdown, setDropdown] = useState(
    <select defaultValue={"Select list"} className={classes["list-select"]}>
      <option key={"Select list"} value={"Select list"}>
        {"Select  list"}
      </option>
    </select>
  );

  const authCtx = useContext(AuthContext);
  const listRef = useRef();

  useEffect(() => {
    fetchLists().then((data) => {
      const transformedLists = [];
      const onListSelectHandler = (event) => {
        props.onListSelect(event.target.value);
      };

      for (const key in data) {
        if (authCtx.id === data[key].creator) {
          const listObj = {
            id: key,
            ...data[key],
          };

          transformedLists.push(listObj);
        }
      }

      const dropdownMapped = (
        <select
          defaultValue={"Select list"}
          ref={listRef}
          onChange={onListSelectHandler}
          className={classes["list-select"]}
        >
          <option key={"Select list"} value={"Select list"}>
            {"Select list"}
          </option>
          {transformedLists.map((list) => {
            return (
              <option key={list.id} value={list.id}>
                {list.name}
              </option>
            );
          })}
        </select>
      );

      setDropdown(dropdownMapped);
    });
  }, [authCtx.id, props]);

  return <Fragment>{dropdown}</Fragment>;
};

export default ListSelector;
