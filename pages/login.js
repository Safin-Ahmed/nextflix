import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { magic } from "../lib/magic-client";
import styles from "../styles/Login.module.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [userMsg, setUserMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleComplete = () => setIsLoading(false);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  const handleOnChangeEmail = (e) => {
    setEmail(e.target.value);
  };
  const handleLoginWithEmail = async () => {
    if (email) {
      // route to dashboard

      try {
        setIsLoading(true);
        const didToken = await magic.auth.loginWithMagicLink({ email });
        console.log({ didToken });
        if (didToken) {
          const response = await fetch("/api/login", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${didToken}`,
              "Content-Type": "application/json",
            },
          });

          const loggedInResponse = await response.json();
          if (loggedInResponse.done) {
            router.replace("/");
          } else {
            setIsLoading(false);
            setUserMsg("Something went wrong logging in");
          }
          //
        }
      } catch (e) {
        console.error("Magic Link Error", e);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
      setUserMsg("Enter a valid email address");
    }
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Netflix - Login</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <header className={styles.header}>
        <div className={styles.headerWrapper}>
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
        </div>
      </header>
      <main className={styles.main}>
        <div className={styles.mainWrapper}>
          <h1 className={styles.signinHeader}>Sign In</h1>
          <input
            className={styles.emailInput}
            type="text"
            placeholder="Email Address"
            onChange={handleOnChangeEmail}
          />
          <p className={styles.userMsg}>{userMsg}</p>
          <button className={styles.loginBtn} onClick={handleLoginWithEmail}>
            {isLoading ? "Loading..." : "Sign In"}
          </button>
        </div>
      </main>
    </div>
  );
};

export default Login;
