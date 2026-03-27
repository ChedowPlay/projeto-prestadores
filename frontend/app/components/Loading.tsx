import styles from "@/app/stylesheets/Loading.module.css"

const Loading: React.FC = ({}) => {
  return (
    <div className={styles.loadingOverlay}>
      <div className={styles.loadingSpinner}></div>
    </div>
  )
}

export default Loading;
