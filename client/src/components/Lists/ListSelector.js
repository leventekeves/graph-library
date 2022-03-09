import { Fragment, useContext, useEffect, useRef, useState } from "react";
import AuthContext from "../../store/auth-context";

import classes from "./ListSelector.module.css";

async function fetchLists(userId) {
  const response = await fetch(`/list/user/${userId}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not fetch lists.");
  }

  return data;
}

const ListSelector = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState();
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
    let isActive = true;
    fetchLists(authCtx.id).then((data) => {
      if (isActive) {
        setData(data);
        setIsLoading(false);
      }
    });

    return () => {
      isActive = false;
    };
  }, [authCtx.id]);

  useEffect(() => {
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

    if (!isLoading) setDropdown(dropdownMapped);
  }, [authCtx.id, props, isLoading, data]);

  return <Fragment>{dropdown}</Fragment>;
};

export default ListSelector;
