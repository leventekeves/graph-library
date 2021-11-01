import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

import LoadingSpinner from "../../utility/LoadingSpinner";
import classes from "./BrowseLists.module.css";
import ListItem from "./ListItem";

async function fetchLists() {
  const response = await fetch("/list");
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not fetch lists!.");
  }
  return data;
}

const BrowseLists = () => {
  const [lists, setLists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const history = useHistory();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);

  if (queryParams.get("sort") === "newest") {
    lists.sort(sortByNewest);
  }
  if (queryParams.get("sort") === "oldest") {
    lists.sort(sortByOldest);
  }
  if (queryParams.get("sort") === "recommendations") {
    lists.sort(sortByRecommendations);
  }

  const changeSortHangler = (props) => {
    history.push("/lists?function=browse&sort=" + props.target.value);
  };

  useEffect(() => {
    fetchLists().then((data) => {
      const transformedLists = [];

      for (const key in data) {
        const listObj = {
          id: key,
          ...data[key],
        };

        transformedLists.push(listObj);
      }

      setLists(transformedLists);
      setIsLoading(false);
    });
  }, []);

  function sortByRecommendations(a, b) {
    if (+a.recommendations < +b.recommendations) {
      return 1;
    }
    if (+a.recommendations > +b.recommendations) {
      return -1;
    }
    return 0;
  }

  function sortByNewest(a, b) {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    if (dateA < dateB) {
      return 1;
    }
    if (dateA > dateB) {
      return -1;
    }
    return 0;
  }

  function sortByOldest(a, b) {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    if (dateA < dateB) {
      return -1;
    }
    if (dateA > dateB) {
      return 1;
    }
    return 0;
  }

  const content =
    lists.length > 0 ? (
      <div className={classes.container}>
        <div className={classes["sort-container"]}>
          <div className={classes["sort-title"]}>Order</div>
          <div className={classes["sort-items"]}>
            <option
              className={classes["sort-item"]}
              value="recommendations"
              onClick={changeSortHangler}
            >
              Most recommended
            </option>
            <option
              className={classes["sort-item"]}
              value="newest"
              onClick={changeSortHangler}
            >
              Newest
            </option>
            <option
              className={classes["sort-item"]}
              value="oldest"
              onClick={changeSortHangler}
            >
              Oldest
            </option>
          </div>
        </div>
        <div className={classes["list-container"]}>
          {lists.map((list) => {
            if (list.books) {
              return "";
            } else {
              return (
                <ListItem
                  key={list.id}
                  id={list.id}
                  name={list.name}
                  numberOfBooks={list.numberOfBooks}
                  recommendations={list.recommendations}
                  date={list.date}
                />
              );
            }
          })}
        </div>
      </div>
    ) : (
      <div className={classes.nolist}>No list found!</div>
    );

  return isLoading ? (
    <div className={classes.center}>
      <LoadingSpinner />
    </div>
  ) : (
    content
  );
};

export default BrowseLists;
