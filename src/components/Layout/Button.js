import classes from "./Button.module.css";

const Button = (props) => {
  return (
    <button
      value={props.value}
      className={classes.button}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};

export default Button;
