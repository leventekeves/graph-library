import { useRef, useContext } from "react";
import AuthContext from "../../store/auth-context";
import { useHistory } from "react-router-dom";

import authClasses from "./Authentication.module.css";
import Button from "../Layout/Button";

async function fetchUsers() {
  const response = await fetch(
    "https://graph-library-kl-default-rtdb.europe-west1.firebasedatabase.app/Users.json"
  );
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
    fetchUsers().then((data) => {
      // emailInputRef.current.value = "user@user.com";
      // passwordInputRef.current.value = "user";
      for (const key in data) {
        if (
          emailInputRef.current.value === data[key].email &&
          passwordInputRef.current.value === data[key].password
        ) {
          const bookmarks = data[key].bookmarks;
          const transformedBookmarks = [];
          for (const key in bookmarks) {
            const BookmarkObj = {
              id: key,
              ...bookmarks[key],
            };
            transformedBookmarks.push(BookmarkObj);
          }

          authCtx.login(
            "123456789",
            key,
            data[key].name,
            data[key].access,
            transformedBookmarks
          );
          history.replace("/");
          break;
        }
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
