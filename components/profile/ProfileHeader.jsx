import { Button, Image, Skeleton, Spin, Typography } from "antd";
import styles from "./profileHead.module.css";
import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { updateBanner } from "@/actions/user";
import Box from "../box/Box";

const { Text } = Typography;
const ProfileHeader = ({ userId, userData, isLoading, isError }) => {
  //states to handle banner change
  const [bannerPreview, setBannerPreview] = useState(false);

  const bannerRef = useRef(null);
  const [banner, setBanner] = useState(null);

  //user authenticated
  const { user } = useUser();

  //
  const { mutate, isPending } = useMutation({
    mutationFn: updateBanner,
    onSuccess: () => {
      toast.success("Banner updated successfully");
    },
    onError: () => {
      toast.error("Something went wrong, Try again later ");
    },
  });
  //handle banner change function
  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setBanner(reader.result);
        mutate({
          id: user?.id,
          banner: reader.result,
          prevBannerId: userData?.data?.banner_id,
        });
      };
    }
  };
  //update the banner when user data changes
  useEffect(() => {
    if (userData?.data?.banner_url) {
      setBanner(userData?.data?.banner_url);
    }
  }, [userData, setBanner]);
  return (
    <div className={styles.container}>
      {/* banner */}
      <Spin spinning={isPending}>
        <div className={styles.banner} onClick={() => setBannerPreview(true)}>
          <Image
            src={banner || "/defaultbanner.png"}
            alt="banner"
            width={"100%"}
            height={"15rem"}
            preview={{
              mask: null,
              visible: bannerPreview,
              onVisibleChange: (visible) => {
                setBannerPreview(visible);
              },
            }}
          />
          {userId === user?.id && (
            <div
              className={styles.editBanner}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <input
                accept="image/*"
                multiple={false}
                ref={bannerRef}
                onChange={(e) => handleBannerChange(e)}
                type="file"
                hidden
              />
              <Button
                onClick={() => bannerRef.current.click()}
                type="primary"
                shape="circle"
                icon={
                  <Icon icon="fluent:image-edit-24-filled" width={"20px"} />
                }
              />
            </div>
          )}
        </div>
      </Spin>
      <Box>
        <div className={styles.footer}>
          {/* left side */}
          <div className={styles.left}>
            {/* profile picture */}
            <div className={styles.profile}>
              <div className={styles.profileImage}>
                <Image
                  src={userData?.data?.image_url || "/defaultprofile.jpg"}
                  alt="profile picture"
                  preview={{ mask: null }}
                />
              </div>
              {/* name */}
              <div className={styles.profileInfo}>
                {!isLoading ? (
                  <>
                    <Text className={"typoH6"}>
                      {userData?.data?.first_name} {userData?.data?.last_name}
                    </Text>
                    <Text className={"typoBody1"} type="secondary">
                      @{userData?.data?.username}
                    </Text>
                  </>
                ) : (
                  <Skeleton style={{ width: "9rem" }} paragraph={{ rows: 2 }} />
                )}
              </div>
            </div>
          </div>
          {/* right side */}
          <div className={styles.right}>Right side</div>
        </div>
      </Box>
    </div>
  );
};

export default ProfileHeader;
