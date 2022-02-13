import { useRef, useContext } from "react";
import AuthContext from "../../store/auth-context";
import { useHistory } from "react-router-dom";

import authClasses from "./Authentication.module.css";
import Button from "../Layout/Button";

async function fetchUsers(email, password) {
  const response = await fetch("/user/login", {
    method: "POST",
    body: JSON.stringify({ email: email, password: password }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not fetch users.");
  }
  return data;
}

const Login = () => {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const authCtx = useContext(AuthContext);
  const history = useHistory();

  const onSubmitHandler = (event) => {
    event.preventDefault();

    fetchUsers(
      // emailInputRef.current.value,
      // passwordInputRef.current.value
      "admin@admin.com",
      "admin"
    ).then((data) => {
      if (data.credentialsCorrect === true) {
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
          <div className={authClasses["button-container"]}>
            <Button>Submit</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
