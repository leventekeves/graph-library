import { useRef } from "react";
import classes from "./Signup.module.css";

async function addNewUser(userData) {
  await fetch(
    "https://graph-library-kl-default-rtdb.europe-west1.firebasedatabase.app/Users.json",
    {
      method: "POST",
      body: JSON.stringify(userData),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

const Signup = () => {
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
    addNewUser({ ...userData, access: "user" });
  };

  return (
    <div className={classes.container}>
      <div>Signup</div>
      <form onSubmit={onSubmitHandler}>
        <div>Name</div>
        <input type="text" ref={nameInputRef} />
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

export default Signup;
