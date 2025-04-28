import styles from "./page.module.css";
import { Navbar, Sketchpad } from "@/layouts";

export default function Home() {
  return (
    <div className={styles.wrapper}>
      <Navbar></Navbar>
      <div className={styles.container}>
        <Sketchpad></Sketchpad>
      </div>
    </div>
  );
}
