import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import logo from "../assets/logo.png";
import styles from "../styles/NavBar.module.css";
import { NavLink } from "react-router-dom";
// 3f. import { CurrentUserContext } from "../App";
import {
  useCurrentUser,
  useSetCurrentUser,
} from "../contexts/CurrentUserContext";
import Avatar from "./Avatar";
import useClickOutsideToggle from "../hooks/useClickOutsideToggle";

const NavBar = () => {
  // 3f. Zie App.js en SignInForm.js voor de vorige 3. stappen
  // ↓↓↓ Hiermee krijgen we toegang tot de currentUser (gezet op data.user in SignInForm.js)
  // const currentUser = useContext(CurrentUserContext);

  // 3j. We updaten bovenstaande currentUser variabel d.m.v. custom hooks (zie CurrentUserContext.js)
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  const {expanded, setExpanded, ref} = useClickOutsideToggle();

  // 6. voor het inklappen van het menu, beginnen we hiermee
  // met de expanded houden we bij of het burger-icoon-menu in- of uitgeklapt is
  // useState(false) ===> menu is in begin ingeklapt
  // voor 6a. ga naar het return statement beneden
  // const [expanded, setExpanded] = useState(false);
  // // 6c. we declareren nu een ref, die een referentie aan het burger-icoon vasthoudt.
  // // we gebruiker hierbij een useRef hook
  // // Voor stap 6d. kijk weer bij Nav.Toggle
  // const ref = useRef(null);

  // // 6e. 
  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     // 6ea. hiermee checken we of de gebruiker weg heeft geklikt van de burger-knop
  //     // indien ja, dan laten we het menu weer inklappen
  //     if (ref.current && !ref.current.contains(event.target)){
  //       setExpanded(false);
  //     }
  //   }

  //   document.addEventListener('mouseup', handleClickOutside)
  //   // 6eb. clearup functie; hoewel deze component niet unmounted wordt
  //   // is het nog steeds good practice om alle event listeners weg te halen
  //   return () => {
  //     document.removeEventListener('mouseup', handleClickOutside)
  //   }
  // }, [ref])

  // 5e. Signout handler
  const handleSignOut = async () => {
    try {
      await axios.post("dj-rest-auth/logout/");
      setCurrentUser(null);
    } catch (err) {
      console.log(err);
    }
  };

  // 5. Overige navbar-iconen toevoegen
  const addPostIcon = (
    <NavLink
      className={styles.NavLink}
      activeClassName={styles.Active}
      to="/posts/create"
    >
      <i className="fas fa-plus-square"></i>Add Post
    </NavLink>
  );
  // 5a. navbar iconen zichtbaar voor de ingelogde gebruiker
  const loggedInIcons = (
    <>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/feed"
      >
        <i className="fas fa-stream"></i>Feed
      </NavLink>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/liked"
      >
        <i className="fas fa-heart"></i>Liked
      </NavLink>
      <NavLink className={styles.NavLink} to="/" onClick={handleSignOut}>
        <i className="fas fa-sign-out-alt"></i>Sign out
      </NavLink>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        // 5aa. hier sturen we de gebruiker naar zijn profiel door
        // <img src={currentuser?.profile_image}> ---> is currentUser !null
        // dan kunnen we zijn profile_image tonen
        // voor stap 5b. ---> Avatar.module.css
        to={`/profiles/${currentUser?.profile_id}`}
      >
        <Avatar
          // 5d. We vervangen <img> door de geïmporteerde Avatar-component
          src={currentUser?.profile_image}
          text="Profile"
          height={40}
        />
      </NavLink>
    </>
  );
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
    // 6a. door expanded={expanded} laten we de weten dat we het menu graag ingeklapt willen
    // 6b. bij Navbar.Toggle ==> onClick={() => setExpanded(!expanded)}
    // we willen dus dat bij het klikken expanded van false naar true en omgekeerd gaat
    // Voor stap 6c. kijk weer boven onder [expanded, setExpanded] ↑ 

    // 6d. ref={ref} bij Navbar.Toggle ===> hiermee kunnen we aan dit DOM-element refereren
    // en bijhouden of de gebruiker erin geklikt heeft
    // voor Stap 6e. kijk weer boven onder const ref=useRef(null)
    <Navbar
      expanded={expanded}
      className={styles.NavBar}
      expand="md"
      fixed="top"
    >
      <Container>
        <NavLink to="/">
          <Navbar.Brand>
            <img src={logo} alt="logo" height="45" />
          </Navbar.Brand>
        </NavLink>
        {currentUser && addPostIcon}
        <Navbar.Toggle
          ref={ref}
          onClick={() => setExpanded(!expanded)}
          aria-controls="basic-navbar-nav"
        />
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
