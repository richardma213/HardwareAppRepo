import "./Card.css";

export default function Card({ children, className = "", style, interactive = false, selected = false, ...rest }) {
  const classes = [
    "card",
    interactive && "card--interactive",
    selected && "card--selected",
    className
  ].filter(Boolean).join(" ");

  return (
    <div className={classes} style={style} {...rest}>
      {children}
    </div>
  );
}
