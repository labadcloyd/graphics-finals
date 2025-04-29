import styles from "./styles.module.css";
export default function Navbar() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div>
          <h4>Sketchpad</h4>
          <p>Midpoint Ellipse</p>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            flexDirection: "column",
          }}
        >
          <h4>Cloyd Abad - Parker Manalaysay</h4>
          <p>Developers</p>
        </div>
      </div>
    </div>
  );
}
