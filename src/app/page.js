import styles from "./page.module.css";
import { Navbar } from "@/layouts";

export default function Home() {
  return (
    <div className={styles.wrapper}>
      <Navbar></Navbar>
      <div className={styles.container}></div>
    </div>
  );
}
