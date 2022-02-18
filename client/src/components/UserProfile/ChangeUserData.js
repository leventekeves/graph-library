import { useContext, useRef, useState } from "react";
import AuthContext from "../../store/auth-context";
import Button from "../Layout/Button";
import classes from "./ChangeUserData.module.css";

async function changeUserData(userData) {
  const response = await fetch("/user", {
    method: "PUT",
    body: JSON.stringify(userData),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}

const ChangeUserData = () => {
  const [changeSubmitted, setChangeSubmitted] = useState(false);
  const [changeSuccessful, setChangeSuccessful] = useState(false);
  const nameInputRef = useRef();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const currentPasswordInputRef = useRef();

  const authCtx = useContext(AuthContext);

  const onSubmitHandler = (event) => {
    event.preventDefault();
    const userData = {
      userId: authCtx.id,
      currentPassword: currentPasswordInputRef.current.value,
      name: nameInputRef.current.value,
      email: emailInputRef.current.value,
      password: passwordInputRef.current.value,
    };
    changeUserData(userData).then((response) => {
      if (response.ok) {
        setChangeSuccessful(true);
      }
    });
    setChangeSubmitted(true);
  };

  let content;
  if (changeSubmitted && changeSuccessful) {
    content = (
      <div className={classes["feedback-message"]}>User Data Changed!</div>
    );
  } else if (changeSubmitted && !changeSuccessful) {
    content = (
      <div className={classes["feedback-message"]}>
        User Data Change Unsuccessful!
      </div>
    );
  } else {
    content = (
      <div className={classes.container}>
        <div className={classes["form-container"]}>
          <div className={classes.title}>Change User Data</div>
          <form onSubmit={onSubmitHandler}>
            <div className={classes.label}>Name</div>
            <input type="text" ref={nameInputRef} className={classes.input} />
            <div className={classes.label}>E-mail</div>
            <input type="email" ref={emailInputRef} className={classes.input} />
            <div className={classes.label}>Password</div>
            <input
              type="password"
              ref={passwordInputRef}
              className={classes.input}
            />
            <div className={classes.label}>Current Password</div>
            <input
              type="password"
              ref={currentPasswordInputRef}
              className={classes.input}
            />
            <div className={classes["button-container"]}>
              <Button>Submit</Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return content;
};

export default ChangeUserData;
