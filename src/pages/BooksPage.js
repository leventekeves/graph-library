import { Fragment } from "react";
import BooksContent from "../components/Books/BooksContent";
import SubNavigation from "../components/Layout/SubNavigation";

const BooksPage = () => {
  return (
    <Fragment>
      <SubNavigation location={[{ name: "Books", link: "" }]} />
      <BooksContent />
    </Fragment>
  );
};

export default BooksPage;
