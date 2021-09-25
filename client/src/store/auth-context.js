import React, { useState } from "react";

const AuthContext = React.createContext({
  token: "",
  id: "",
  name: "",
  access: "",
  isLoggedIn: false,
  bookmarks: [],
  borrowings: [],
  login: (token, id, name, access, bookmarks) => {},
  logout: () => {},
});

export const AuthContextProvider = (props) => {
  const [token, setToken] = useState("123456789");
  const [id, setId] = useState("-MhZLH44xLPw8jpO9lGP");
  const [name, setName] = useState("Admin");
  const [access, setAccess] = useState("admin");
  const [bookmarks, setBookmarks] = useState([
    { bookId: "-Mh3YyK70IfId0ebhkSR" },
    { bookId: "-Mh3_Doh9YeOmg4GJHj8" },
    { bookId: "-Mh3_L3aa9rpFY4wROSK" },
  ]);
  const [borrowings, setBorrowings] = useState([
    { bookId: "-Mh3YyK70IfId0ebhkSR" },
    { bookId: "-Mh3_Doh9YeOmg4GJHj8" },
  ]);

  // const [token, setToken] = useState("");
  // const [id, setId] = useState("");
  // const [name, setName] = useState("");
  // const [access, setAccess] = useState("");
  // const [bookmarks, setBookmarks] = useState([]);

  const userIsLoggedIn = !!token;

  const loginHandler = (token, id, name, access, bookmarks, borrowings) => {
    setToken(token);
    setId(id);
    setName(name);
    setAccess(access);
    setBookmarks(bookmarks);
    setBorrowings(borrowings);
  };

  const logoutHandler = () => {
    setToken(null);
    setId(null);
    setName(null);
    setAccess(null);
    setBookmarks(null);
    setBorrowings(null);
  };

  const contextValue = {
    token: token,
    id: id,
    name: name,
    access: access,
    bookmarks: bookmarks,
    borrowings: borrowings,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
