import PostGenerator from "@/components/home/post/PostGenerator";
import styles from "./styles/home-view.module.css";
import Post from "@/components/home/post/Post";
import PopularTrends from "@/components/home/post/trends/PopularTrends";
import FollowSuggestions from "@/components/profile/FollowSuggestions";

const HomeView = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.postsArea}>
        <PostGenerator />
        <Post />
      </div>
      <div className={styles.right}>
        <PopularTrends />
        <FollowSuggestions />
      </div>
    </div>
  );
};

export default HomeView;
