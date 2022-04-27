import { useEffect, useMemo, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

import LoadingSpinner from "../../utility/LoadingSpinner";
import Pagination from "../../utility/Pagination";
import classes from "./BrowseLists.module.css";
import ListItem from "./ListItem";

async function fetchLists(pageNumber, itemsPerPage, sort) {
  const response = await fetch(
    `/list?pagenumber=${pageNumber}&itemsperpage=${itemsPerPage}&sort=${sort}`
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not fetch lists!.");
  }
  return data;
}

const BrowseLists = () => {
  const [lists, setLists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const itemsPerPage = 5;

  const history = useHistory();
  const location = useLocation();

  const queryParams = useMemo(() => {
    return new URLSearchParams(location.search);
  }, [location]);

  const changeSortHandler = (event) => {
    addQuery("sort", event.target.value);
  };

  const addQuery = (key, value) => {
    let pathname = location.pathname;
    let searchParams = new URLSearchParams(location.search);
    searchParams.set(key, value);
    history.push({
      pathname: pathname,
      search: searchParams.toString(),
    });
  };

  useEffect(() => {
    let isActive = true;
    const sort = queryParams.get("sort");

    fetchLists(currentPage, itemsPerPage, sort).then((data) => {
      const transformedLists = [];

      for (const key in data.listArr) {
        const listObj = {
          id: key,
          ...data.listArr[key],
        };

        transformedLists.push(listObj);
      }

      if (isActive) {
        setLists(transformedLists);
        setPageCount(Math.ceil(data.numberOfLists / itemsPerPage));
        setIsLoading(false);
      }
    });

    return () => {
      isActive = false;
    };
  }, [queryParams, currentPage]);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
    window.scrollTo(0, 0);
  };

  const content =
    lists.length > 0 ? (
      <div className={classes.container}>
        <div className={classes["sort-container"]}>
          <div className={classes["sort-title"]}>Order</div>
          <div className={classes["sort-items"]}>
            <option
              className={classes["sort-item"]}
              value="recommendations"
              onClick={changeSortHandler}
            >
              Most recommended
            </option>
            <option
              className={classes["sort-item"]}
              value="newest"
              onClick={changeSortHandler}
            >
              Newest
            </option>
            <option
              className={classes["sort-item"]}
              value="oldest"
              onClick={changeSortHandler}
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
          <Pagination pageCount={pageCount} handlePageClick={handlePageClick} />
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
