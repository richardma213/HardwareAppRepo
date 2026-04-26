export default function Card({ children, className = "", style = {} }) {
  const baseStyle = {
    background: "var(--card)",
    color: "var(--text)",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "var(--shadow)",
    marginBottom: "20px",
    border: "1px solid var(--border)",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)"
  };

  return (
    <div className={className} style={{ ...baseStyle, ...style }}>
      {children}
    </div>
  );
}
