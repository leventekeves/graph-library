import ReactPaginate from "react-paginate";

import classes from "./Pagination.module.css";

const Pagination = (props) => {
  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel=">"
      onPageChange={props.handlePageClick}
      pageRangeDisplayed={2}
      marginPagesDisplayed={2}
      pageCount={props.pageCount}
      previousLabel="<"
      renderOnZeroPageCount={null}
      className={classes["pagination"]}
      pageClassName={classes["lii"]}
      pageLinkClassName={classes["lia"]}
      activeClassName={classes["activeclass"]}
      activeLinkClassName={classes["activelinkclass"]}
      breakClassName={classes["lii"]}
      breakLinkClassName={classes["lia"]}
      previousClassName={classes["lii"]}
      nextClassName={classes["lii"]}
      previousLinkClassName={classes["lia"]}
      nextLinkClassName={classes["lia"]}
    />
  );
};

export default Pagination;
