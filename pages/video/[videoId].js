import classNames from "classnames";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import Modal from "react-modal";
import DisLike from "../../components/icons/disilike-icon";
import Like from "../../components/icons/like-icon";
import Navbar from "../../components/nav/Navbar";
import { getVideoById } from "../../lib/videos";
import styles from "../../styles/Video.module.css";

Modal.setAppElement("#__next");

const Video = ({ video }) => {
  const router = useRouter();
  const [toggleLike, setToggleLike] = useState(false);
  const [toggleDislike, setToggleDislike] = useState(false);
  const { videoId } = router.query;
  const {
    title,
    publishTime,
    description,
    channelTitle,
    statistics: { viewCount } = { viewCount: 0 },
  } = video;

  useEffect(() => {
    const getStats = async () => {
      const response = await fetch(`/api/stats?videoId=${videoId}`, {
        method: "GET",
      });
      const data = await response.json();
      if (data.length > 0) {
        const favourited = data[0].favourited;
        if (favourited === 1) {
          setToggleLike(true);
        } else if (favourited === 0) {
          setToggleDislike(true);
        }
      }
    };

    getStats();
  }, []);

  const runRatingService = async (favourited) => {
    const response = await fetch("/api/stats", {
      method: "POST",
      body: JSON.stringify({
        videoId,
        favourited,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response;
  };

  const handleToggleDislike = async (e) => {
    const val = !toggleDislike;
    setToggleDislike(val);
    setToggleLike(toggleDislike);
    const favourited = val ? 0 : 1;
    const response = await runRatingService(favourited);
    const data = await response.json();
  };
  const handleToggleLike = async () => {
    const val = !toggleLike;
    setToggleLike(val);
    setToggleDislike(toggleLike);

    const favourited = val ? 1 : 0;
    const response = await runRatingService(favourited);
    const data = await response.json();
  };
  return (
    <div className={styles.container}>
      <Navbar />
      <Modal
        isOpen={true}
        contentLabel="Watch the video"
        onRequestClose={() => {
          router.back();
        }}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <iframe
          id="ytplayer"
          className={styles.videoPlayer}
          type="text/html"
          width="100%"
          height="360"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=0&origin=http://example.com&controls=0&rel=0`}
          frameborder="0"
        ></iframe>

        <div className={styles.likeDislikeBtnWrapper}>
          <div className={styles.btnWrapper}>
            <button onClick={handleToggleLike}>
              <Like selected={toggleLike} />
            </button>
          </div>
          <div className={styles.btnWrapper}>
            <button onClick={handleToggleDislike}>
              <DisLike selected={toggleDislike} />
            </button>
          </div>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.modalBodyContent}>
            <div className={styles.col1}>
              <p className={styles.publishTime}>{publishTime}</p>
              <p className={styles.title}>{title}</p>
              <p className={styles.description}>{description}</p>
            </div>
            <div className={styles.col2}>
              <p className={classNames(styles.subText, styles.subTextWrapper)}>
                <span className={styles.textColor}>Cast: </span>
                <span className={styles.channelTitle}>{channelTitle}</span>
              </p>
              <p className={classNames(styles.subText, styles.subTextWrapper)}>
                <span className={styles.textColor}>View Count: </span>
                <span className={styles.channelTitle}>{viewCount}</span>
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Video;

export async function getStaticProps(context) {
  const { videoId } = context.params;
  const videoArray = await getVideoById(videoId);

  return {
    props: {
      video: videoArray.length > 0 ? videoArray[0] : {},
    },
    revalidate: 10,
  };
}

export async function getStaticPaths() {
  const listOfVideos = ["4yq3TlszZmo", "TJFVV2L8GKs", "0WWzgGyAH6Y"];
  const paths = listOfVideos.map((videoId) => ({
    params: { videoId },
  }));

  return { paths, fallback: "blocking" };
}
