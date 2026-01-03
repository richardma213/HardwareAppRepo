export default function Card({ children }) {
  return (
    <div
      style={{
        background: "#1e1e1e",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        marginBottom: "20px",
        border: "1px solid rgba(255,255,255,0.05)"
      }}
    >
      {children}
    </div>
  );
}
