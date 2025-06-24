import styles from "@/styles/loadingSpinner.module.css";

export default function LoadingPage() {
  return (
    <div className={styles.loadingCon}>
      <div className={styles.loadingSpinner}></div>
    </div>
  );
}
