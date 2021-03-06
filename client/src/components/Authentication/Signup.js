import { useRef, useState } from "react";
import Button from "../Layout/Button";
import authClasses from "./Authentication.module.css";
import classes from "./Signup.module.css";

async function addNewUser(userData) {
  const response = await fetch("/user", {
    method: "POST",
    body: JSON.stringify(userData),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.ok;
}

const Signup = () => {
  const [signedUp, setSignedUp] = useState(false);
  const [creationSuccessful, setCreationSuccessful] = useState(false);

  const nameInputRef = useRef();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const onSubmitHandler = (event) => {
    event.preventDefault();
    const userData = {
      name: nameInputRef.current.value,
      email: emailInputRef.current.value,
      password: passwordInputRef.current.value,
    };
    addNewUser(userData).then((response) => {
      setSignedUp(true);
      if (response) {
        setCreationSuccessful(true);
      } else {
        setCreationSuccessful(false);
      }
    });
  };

  let content;
  if (creationSuccessful) {
    content = (
      <div className={classes["feedback-message"]}>Account created!</div>
    );
  } else {
    content = (
      <div className={authClasses.container}>
        <div className={authClasses["form-container"]}>
          <div className={authClasses.title}>Signup</div>
          <form onSubmit={onSubmitHandler}>
            <div className={authClasses.label}>Name</div>
            <input
              type="text"
              ref={nameInputRef}
              className={authClasses.input}
            />
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

            {!creationSuccessful && signedUp ? (
              <div className={classes["error-message"]}>
                E-mail address aleady exists!
              </div>
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
  }

  return content;
};

export default Signup;
