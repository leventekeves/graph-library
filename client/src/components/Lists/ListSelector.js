import { Fragment, useContext, useEffect, useRef, useState } from "react";
import AuthContext from "../../store/auth-context";

import classes from "./ListSelector.module.css";

async function fetchLists(userId) {
  const response = await fetch(`/list/user?userid=${userId}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not fetch lists.");
  }

  return data;
}

const ListSelector = (props) => {
  const [isLoading, setIsLoading] = useState(true);
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
    fetchLists(authCtx.id).then((data) => {
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

      if (isLoading) {
        setDropdown(dropdownMapped);
        setIsLoading(false);
      }
    });
    return () => {
      setIsLoading(false);
    };
  }, [authCtx.id, props, isLoading]);

  return <Fragment>{dropdown}</Fragment>;
};

export default ListSelector;
