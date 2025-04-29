import styles from "./styles.module.css";
export default function Footer() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div>
          <p>© 2025 Sketchpad - Midpoint Ellipse</p>
        </div>
        <div style={{ display: "flex", gap: "42px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              flexDirection: "column",
            }}
          >
            <p style={{ fontWeight: "500", fontSize: "14px" }}>Cloyd Abad</p>
            <p style={{ color: "gray" }}>BSCS IV - Developer</p>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              flexDirection: "column",
            }}
          >
            <p style={{ fontWeight: "500", fontSize: "14px" }}>
              Parker Manalaysay
            </p>
            <p style={{ color: "gray" }}>BSCS IV - Developer</p>
          </div>
        </div>
      </div>
    </div>
  );
}
