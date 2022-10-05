import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { magic } from "../../lib/magic-client";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [userName, setUserName] = useState("");
  const router = useRouter();
  useEffect(() => {
    const getUser = async () => {
      try {
        const { email, issuer } = await magic.user.getMetadata();
        const didToken = await magic.user.getIdToken();
        console.log({ didToken });
        if (email) {
          setUserName(email);
        }
        console.log(email);
      } catch (e) {
        // Handle errors if required!
        console.error("Error retrieving email", e);
      }
    };

    getUser();
  }, []);
  const handleOnClickHome = (e) => {
    e.preventDefault();
    router.push("/");
  };
  const handleOnClickLists = (e) => {
    e.preventDefault();
    router.push("/browse/my-list");
  };

  const handleSignout = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/logout");
      const data = await response.json();
      if (data.logout) {
        router.push("/login");
      }
    } catch (e) {
      // Handle errors if required!
      console.error("Error Logging out", e);
      router.push("/login");
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Link href="/">
          <a className={styles.logoLink}>
            <div className={styles.logoWrapper}>
              <Image
                src="/static/netflix.svg"
                alt="Netflix Logo"
                width="128px"
                height="34px"
              />
            </div>
          </a>
        </Link>

        <ul className={styles.navItems}>
          <li className={styles.navItem} onClick={handleOnClickHome}>
            Home
          </li>
          <li onClick={handleOnClickLists} className={styles.navItem2}>
            My List
          </li>
        </ul>
        <nav className={styles.navContainer}>
          <div>
            <button
              onClick={() => setShowDropdown((prev) => !prev)}
              className={styles.usernameBtn}
            >
              <p className={styles.username}>{userName}</p>
              {/** Expand More Icon */}
              <Image
                src="/static/expand_more.svg"
                alt="Expand Dropdown"
                width="24px"
                height="24px"
              />
            </button>
            {showDropdown && (
              <div className={styles.navDropdown}>
                <div>
                  <a onClick={handleSignout} className={styles.linkName}>
                    Sign Out
                  </a>

                  <div className={styles.lineWrapper}></div>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
