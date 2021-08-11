import classes from "./ListsContent.module.css";

const ListsContent = () => {
  return (
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
        <div className={classes["list-item"]}>
          <div>
            <p>Listanév</p>
            <p>Könyvek száma</p>
          </div>
          <div>Ajánlások</div>
        </div>
        <div className={classes["list-item"]}>
          <div>
            <p>Listanév</p>
            <p>Könyvek száma</p>
          </div>
          <div>Ajánlások</div>
        </div>
        <div className={classes["list-item"]}>
          <div>
            <p>Listanév</p>
            <p>Könyvek száma</p>
          </div>
          <div>Ajánlások</div>
        </div>
      </div>
    </div>
  );
};

export default ListsContent;
