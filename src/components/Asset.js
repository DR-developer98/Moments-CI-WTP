import React from "react";
import { Spinner } from "react-bootstrap";
import styles from "../styles/Asset.module.css";

// 7b. hierin destructureren we spinner, src en message, zodat ze altijd beschikbaar zijn
// ongeacht hun waarde
// Binnenin de div wordt eerst gekeken of iedere prop bestaat en zo ja, dan wordt de expressie
// na de && uitgevoerd
// voor stap 7c. ga naar PostCreateForm.js bij de imports
const Asset = ({ spinner, src, message }) => {
  return (
    <div className={`${styles.Asset} p-4`}>
      {spinner && <Spinner animation="border" />}
      {src && <img src={src} alt={message} />}
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default Asset;