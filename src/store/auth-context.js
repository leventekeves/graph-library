import React, { useState } from "react";

const AuthContext = React.createContext({
  token: "",
  id: "",
  name: "",
  access: "",
  isLoggedIn: false,
  login: (token, id, name, access) => {},
  logout: () => {},
});

export const AuthContextProvider = (props) => {
  const [token, setToken] = useState("123456789");
  const [id, setId] = useState("-MhZLH44xLPw8jpO9lGP");
  const [name, setName] = useState("Admin");
  const [access, setAccess] = useState("admin");

  const userIsLoggedIn = !!token;

  const loginHandler = (token, id, name, access) => {
    setToken(token);
    setId(id);
    setName(name);
    setAccess(access);
  };

  const logoutHandler = () => {
    setToken(null);
    setId(null);
    setName(null);
    setAccess(null);
  };

  const contextValue = {
    token: token,
    id: id,
    name: name,
    access: access,
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
