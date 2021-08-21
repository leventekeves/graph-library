import { useRef, useContext } from "react";
import AuthContext from "../../store/auth-context";
import { useHistory } from "react-router-dom";

import classes from "./Login.module.css";

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
      for (const key in data) {
        if (
          emailInputRef.current.value === data[key].email &&
          passwordInputRef.current.value === data[key].password
        ) {
          authCtx.login("123456789", key, data[key].name, data[key].access);
          history.replace("/");
          break;
        }
      }
    });
  };

  return (
    <div className={classes.container}>
      <div>Login</div>
      <form onSubmit={onSubmitHandler}>
        <div>E-mail</div>
        <input type="email" ref={emailInputRef} />
        <div>Password</div>
        <input type="password" ref={passwordInputRef} />
        <div>
          <button>Submit</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
