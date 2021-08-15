import { useEffect, useState } from "react";
import LoadingSpinner from "../utility/LoadingSpinner";
import classes from "./BrowseLists.module.css";
import ListItem from "./ListItem";

const BrowseLists = () => {
  const [lists, setLists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchLists() {
    const response = await fetch(
      "https://graph-library-kl-default-rtdb.europe-west1.firebasedatabase.app/Lists.json"
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Could not fetch books.");
    }

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
  }

  useEffect(() => {
    fetchLists();
  }, []);

  const content = (
    <div className={classes.container}>
      <div className={classes["sort-container"]}>
        <div className={classes["sort-title"]}>Sorrend</div>
        <div className={classes["sort-items"]}>
          <p>Legújabb</p>
          <p>Legrégebbi</p>
          <p>Ajánlások</p>
        </div>
      </div>
      <div className={classes["list-container"]}>
        {lists.map((list) => {
          return (
            <ListItem
              key={list.id}
              id={list.id}
              name={list.name}
              books={list.books}
              recommendations={list.recommendations}
            />
          );
        })}
      </div>
    </div>
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
