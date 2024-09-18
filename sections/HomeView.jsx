import PostGenerator from "@/components/home/PostGenerator";
import styles from "./styles/home-view.module.css";

const HomeView = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.postsArea}>
        <PostGenerator />
        <span>Posts</span>
      </div>
      <div className={styles.right}>
        <span>Trending section</span>
        <span>Follow suggestions</span>
      </div>
    </div>
  );
};

export default HomeView;
