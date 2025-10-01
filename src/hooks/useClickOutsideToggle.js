import React, { useContext, useEffect, useRef, useState } from "react";

// 6f. refactoring de toggle-menu-sectie uit NavBar.js
// Voor 6g. zie return-statement helemaal onderaan
const useClickOutsideToggle = () => {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setExpanded(false);
      }
    };

    document.addEventListener("mouseup", handleClickOutside);
    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
    };
  }, [ref]);

  // 6g. i.p.v. een <div> retourneren we hier de variabelen die we in NavBar.js nodig hebben
  return {expanded, setExpanded, ref}
};

export default useClickOutsideToggle;
