import React, { useState } from "react";

const AuthContext = React.createContext({
  token: "",
  id: "",
  name: "",
  access: "",
  isLoggedIn: false,
  ratings: [],
  bookmarks: [],
  borrowings: [],
  recommendations: [],
  votes: [],
  historyBorrowings: [],
  login: (
    token,
    id,
    name,
    access,
    ratings,
    bookmarks,
    borrowings,
    recommendations,
    votes,
    historyBorrowings
  ) => {},
  logout: () => {},
});

export const AuthContextProvider = (props) => {
  const [token, setToken] = useState("");
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [access, setAccess] = useState("");
  const [ratings, setRatings] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [borrowings, setBorrowings] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [votes, setVotes] = useState([]);
  const [historyBorrowings, setHistoryBorrowings] = useState([]);

  const userIsLoggedIn = !!token;

  const loginHandler = (
    token,
    id,
    name,
    access,
    ratings,
    bookmarks,
    borrowings,
    recommendations,
    votes,
    historyBorrowings
  ) => {
    setToken(token);
    setId(id);
    setName(name);
    setAccess(access);
    setRatings(ratings);
    setBookmarks(bookmarks);
    setBorrowings(borrowings);
    setRecommendations(recommendations);
    setVotes(votes);
    setHistoryBorrowings(historyBorrowings);
  };

  const logoutHandler = () => {
    setToken(null);
    setId(null);
    setName(null);
    setAccess(null);
    setRatings(null);
    setBookmarks(null);
    setBorrowings(null);
    setRecommendations(null);
    setVotes(null);
    setHistoryBorrowings(null);
  };

  const contextValue = {
    token: token,
    id: id,
    name: name,
    access: access,
    ratings: ratings,
    bookmarks: bookmarks,
    borrowings: borrowings,
    recommendations: recommendations,
    votes: votes,
    historyBorrowings: historyBorrowings,
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
