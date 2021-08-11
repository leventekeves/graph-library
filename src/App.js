import { Switch, Route } from "react-router-dom";

import Layout from "./components/Layout/Layout";

import HomePage from "./pages/HomePage";
import BooksPage from "./pages/BooksPage";
import ListsPage from "./pages/ListsPage";
import ExpandPage from "./pages/ExpandPage";
import RentPage from "./pages/RentPage";
import BookmarksPage from "./pages/BookmarksPage";
import AdminPage from "./pages/AdminPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import BookDetail from "./pages/BookDetail";
import ListDetail from "./pages/ListDetail";

function App() {
  return (
    <Layout>
      <Switch>
        <Route path="/" exact>
          <HomePage />
        </Route>
        <Route path="/books" exact>
          <BooksPage />
        </Route>
        <Route path="/books/:bookId">
          <BookDetail />
        </Route>
        <Route path="/lists" exact>
          <ListsPage />
        </Route>
        <Route path="/lists/:listID">
          <ListDetail />
        </Route>
        <Route path="/expand">
          <ExpandPage />
        </Route>
        <Route path="/rent">
          <RentPage />
        </Route>
        <Route path="/bookmarks">
          <BookmarksPage />
        </Route>
        <Route path="/admin">
          <AdminPage />
        </Route>
        <Route path="/profile">
          <ProfilePage />
        </Route>
        <Route path="/login">
          <LoginPage />
        </Route>
        <Route path="/signup">
          <SignupPage />
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;
