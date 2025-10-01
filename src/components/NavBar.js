import React, { useContext } from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import logo from "../assets/logo.png";
import styles from "../styles/NavBar.module.css";
import { NavLink } from "react-router-dom";
// 3f. import { CurrentUserContext } from "../App";
import { useCurrentUser } from "../contexts/CurrentUserContext";

const NavBar = () => {
  // 3f. Zie App.js en SignInForm.js voor de vorige 3. stappen
  // ↓↓↓ Hiermee krijgen we toegang tot de currentUser (gezet op data.user in SignInForm.js)
  // const currentUser = useContext(CurrentUserContext);

  // 3j. We update bovenstaande currentUser variabel d.m.v. custom hooks (zie CurrentUserContext.js)
  const currentUser = useCurrentUser();
  const loggedInIcons = <>{currentUser?.username}</>
  // 3g. We slaan de elementen die alleen aan uitgelogde gebruikers getoond moeten worden op 
  // in de variabel loggedOutIcons. We gaan deze elementen niet in een <div> insluiten,
  // daar dit met de CSS zou knoeien. We gebruiken i.p. daarvan de lege <></>
  const loggedOutIcons = (
    <>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/signin"
      >
        <i className="fas fa-sign-in-alt"></i>Sign in
      </NavLink>
      <NavLink
        to="/signup"
        className={styles.NavLink}
        activeClassName={styles.Active}
      >
        <i className="fas fa-user-plus"></i>Sign up
      </NavLink>
    </>
  );
  return (
    <Navbar className={styles.NavBar} expand="md" fixed="top">
      <Container>
        <NavLink to="/">
          <Navbar.Brand>
            <img src={logo} alt="logo" height="45" />
          </Navbar.Brand>
        </NavLink>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto text-left">
            <NavLink
              exact
              className={styles.NavLink}
              activeClassName={styles.Active}
              to="/"
            >
              <i className="fas fa-home"></i>Home
            </NavLink>
            {currentUser ? loggedInIcons : loggedOutIcons}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
