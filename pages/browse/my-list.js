import Head from "next/head";
import React from "react";
import SectionCards from "../../components/card/SectionCards";
import Navbar from "../../components/nav/Navbar";
import { getMyList } from "../../lib/videos";
import styles from "../../styles/MyList.module.css";
import redirectUser from "../../utils/redirectUser";

const MyList = ({ myListVideos }) => {
  return (
    <div>
      <Head>
        <title>My List</title>
      </Head>
      <main className={styles.main}>
        <Navbar />
        <div className={styles.sectionWrapper}>
          <SectionCards
            title="My List"
            videos={myListVideos}
            size="small"
            shouldWrap
            shouldScale={false}
          />
        </div>
      </main>
    </div>
  );
};

export async function getServerSideProps(context) {
  const { userId, token } = await redirectUser(context);

  const videos = await getMyList(token, userId);
  return {
    props: {
      myListVideos: videos,
    },
  };
}

export default MyList;
