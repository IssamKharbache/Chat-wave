import { useUser } from "@clerk/nextjs";
import FollowInfoBox from "./FollowInfoBox";
import styles from "@/sections/profile/profileView.module.css";
import PostGenerator from "../home/post/PostGenerator";
import Post from "../home/post/Post";
import FollowSuggestions from "./FollowSuggestions";

const ProfileBody = ({ userId }) => {
  const { user: currentUser } = useUser();
  const isCurrentUser = currentUser?.id === userId;
  return (
    <div className={styles.profileBody}>
      {/* left */}
      <div className={styles.left}>
        <div className={styles.sticky}>
          <FollowInfoBox id={userId} />
          <FollowSuggestions />
        </div>
      </div>
      {/* right */}
      <div className={styles.right}>
        <Post id={userId} />
      </div>
    </div>
  );
};

export default ProfileBody;
