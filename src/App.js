import { Switch, Route } from "react-router-dom";
import { useContext } from "react";

import Layout from "./components/Layout/Layout";

import HomePage from "./pages/HomePage";
import BooksPage from "./pages/BooksPage";
import ListsPage from "./pages/ListsPage";
import ExpandCollectionPage from "./pages/ExpandCollectionPage";
import BorrowingsPage from "./pages/BorrowingsPage";
import BookmarksPage from "./pages/BookmarksPage";
import AdminPage from "./pages/AdminPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import BookDetail from "./pages/BookDetail";
import ListDetail from "./pages/ListDetail";
import AuthContext from "./store/auth-context";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  const authCtx = useContext(AuthContext);

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
        <Route path="/lists/:listId">
          <ListDetail />
        </Route>
        <Route path="/expand">
          <ExpandCollectionPage />
        </Route>
        <Route path="/borrowings">
          <BorrowingsPage />
        </Route>
        <Route path="/bookmarks">
          <BookmarksPage />
        </Route>

        {authCtx.isLoggedIn && authCtx.access === "admin" && (
          <Route path="/admin">
            <AdminPage />
          </Route>
        )}

        {authCtx.isLoggedIn && (
          <Route path="/profile">
            <ProfilePage />
          </Route>
        )}

        {!authCtx.isLoggedIn && (
          <Route path="/login">
            <LoginPage />
          </Route>
        )}

        {!authCtx.isLoggedIn && (
          <Route path="/signup">
            <SignupPage />
          </Route>
        )}

        <Route path="*">
          <NotFoundPage />
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;
