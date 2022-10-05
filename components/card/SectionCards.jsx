import classNames from "classnames";
import Link from "next/link";
import React from "react";
import Card from "./Card";
import styles from "./SectionCards.module.css";

const SectionCards = ({
  title,
  videos,
  size,
  shouldWrap = false,
  shouldScale = true,
}) => {
  console.log({ videos });
  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div
        className={classNames(styles.cardWrapper, shouldWrap && styles.wrap)}
      >
        {videos.map((item, index) => (
          <Link key={index} href={`/video/${item.id}`}>
            <a>
              <Card
                id={index}
                imgUrl={item.imgUrl}
                size={size}
                shouldScale={shouldScale}
              />
            </a>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default SectionCards;
