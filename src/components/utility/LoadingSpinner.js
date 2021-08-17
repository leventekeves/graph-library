import classes from "./LoadingSpinner.module.css";

import { useState, useEffect } from "react";

const LoadingSpinner = () => {
  const delay = 0.5;

  const [show, setShow] = useState(false);

  useEffect(() => {
    let timer1 = setTimeout(() => setShow(true), delay * 1000);

    return () => {
      clearTimeout(timer1);
    };
  }, []);

  const content = (
    <div className={classes["lds-ring"]}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );

  return show ? <div>{content}</div> : <div></div>;
};

export default LoadingSpinner;
