import { useRef, useContext, useState } from "react";
import AuthContext from "../../store/auth-context";
import { useHistory } from "react-router-dom";

import classes from "./Login.module.css";
import authClasses from "./Authentication.module.css";
import Button from "../Layout/Button";

async function loginUser(email, password) {
  const response = await fetch("/user/login", {
    method: "POST",
    body: JSON.stringify({ email: email, password: password }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    return response.ok;
  } else {
    const data = await response.json();
    return data;
  }
}

const Login = () => {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const authCtx = useContext(AuthContext);
  const history = useHistory();

  const [loginFailed, setLoginFailed] = useState(false);

  const onSubmitHandler = (event) => {
    event.preventDefault();

    loginUser(
      // emailInputRef.current.value,
      // passwordInputRef.current.value
      "admin@admin.com",
      "admin"
    ).then((data) => {
      if (data) {
        authCtx.login(
          "123456789",
          data.id,
          data.name,
          data.access,
          data.ratings,
          data.bookmarks,
          data.borrowings,
          data.recommendations,
          data.votes,
          data.historyBorrowings
        );
        history.replace("/");
      } else {
        setLoginFailed(true);
      }
    });
  };

  return (
    <div className={authClasses.container}>
      <div className={authClasses["form-container"]}>
        <div className={authClasses.title}>Login</div>
        <form onSubmit={onSubmitHandler}>
          <div className={authClasses.label}>E-mail</div>
          <input
            type="email"
            ref={emailInputRef}
            className={authClasses.input}
          />
          <div className={authClasses.label}>Password</div>
          <input
            type="password"
            ref={passwordInputRef}
            className={authClasses.input}
          />
          {loginFailed ? (
            <div className={classes["error-message"]}>Login unsuccessful!</div>
          ) : (
            ""
          )}

          <div className={authClasses["button-container"]}>
            <Button>Submit</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
