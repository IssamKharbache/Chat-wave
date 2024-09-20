import { Alert, Avatar, Flex, Typography } from "antd";
import styles from "./trends.module.css";
import { QueryClient } from "@tanstack/react-query";
import { getPopularTrends } from "@/actions/post";
import Iconify from "@/components/global/Iconify";

const PopularTrends = async () => {
  const queryClient = new QueryClient();
  try {
    const { data } = await queryClient.fetchQuery({
      queryKey: ["trends"],
      queryFn: getPopularTrends,
      //refresh query after 1 day
      staleTime: 1000 * 60 * 60 * 24,
    });

    return (
      <div className={styles.wrapper}>
        {/* header */}
        <div className={styles.container}>
          <Flex vertical>
            <Typography className="typoSubtitle2">
              Top Trending Hashtags
            </Typography>
            <Typography className="typoH4"># Popular Trends</Typography>
          </Flex>
          <Flex vertical gap={"10px"}>
            {data.map((trend, index) => (
              <Flex key={index} gap={"1rem"} align="center">
                {/* icond */}
                <Avatar
                  style={{ backgroundColor: "var(--text-color)" }}
                  icon={
                    <Iconify
                      icon="mingcute:hashtag-fill"
                      width={20}
                      height={20}
                      color="white"
                    />
                  }
                />
                {/* trend name */}
                <Flex vertical>
                  <Typography
                    className="typoSubtitle1"
                    style={{ fontWeight: "bold" }}
                  >
                    {trend?.name}
                  </Typography>
                  <Typography
                    className="typoCaption"
                    style={{ fontWeight: "bold", color: "gray" }}
                  >
                    {trend?._count?.name}{" "}
                    {trend?._count?.name === 1 ? "Post" : "Posts"}
                  </Typography>
                </Flex>
              </Flex>
            ))}
          </Flex>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <Alert
        message="Error"
        description="Unable to load trends"
        type="error"
        showIcon
      />
    );
  }
};

export default PopularTrends;
