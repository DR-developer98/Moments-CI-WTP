import React from "react";
import styles from "../styles/Avatar.module.css";

// voor stap 5a. zie NavBar.js, voor stap 5b. zie Avatar.module.css
// 5c. Deze component krijgt props door: src, height en tekst
const Avatar = ({ src, height = 45, text }) => {
  // 5ca. deze props gaan we hier destructureren
  // maar eigenlijk kunnen we dit gelijk bij het doorgeven van de
  // argumenten doen ↑↑↑
  // const {src, height = 45, text} = props;
  return (
    <span>
      <img
        className={styles.Avatar}
        src={src}
        height={height}
        width={height}
        alt="avatar"
      />
      {text}
    </span>
  );
  // Voor stap 5d. zie NavBar.js
};

export default Avatar;
