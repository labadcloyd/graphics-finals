import styles from "./page.module.css";
import { Footer, Navbar, Sketchpad } from "@/layouts";

export default function Home() {
  return (
    <div className={styles.wrapper}>
      <Navbar></Navbar>
      <div className={styles.container}>
        <Sketchpad></Sketchpad>
      </div>
      <Footer />
    </div>
  );
}
