import NavBar from "./components/NavBar";
import styles from "./App.module.css";
import Container from "react-bootstrap/Container";
import { Route, Switch } from "react-router-dom";
// ↓ import axiosDefault
import "./api/axiosDefault";
import SignUpForm from "./pages/auth/SignUpForm";
import SignInForm from "./pages/auth/SignInForm";
// import { createContext, useEffect, useState } from "react";
// import axios from 'axios';

// 3. Iedere keer dat we de createContext-functie aanroepen,
// wordt er een nieuw Context-object gecreëerd.
// export const CurrentUserContext = createContext();
// export const SetCurrentUserContext = createContext();

function App() {
  // 01-10-2025 les over de weergave van navlinks a.d.h.v. inlogstatus
  // Versturen request aan onze API om na te gaan wie de ingelogde gebruiker is
  // 1. GET request aan dj-rest-auth/user/url
  // 2. de request moet uitgevoerd worden, wanneer de component is gemount
  // 3. door middel van useContext ---> de Context (veelomvattend data-object)
  // door de hele App aan verschillende componenten doorgeven
  // const [currentUser, setCurrentUser] = useState(null);
  // async = asynchroon: deze runt terwijl de overige functies runnen dus niet successievelijk
  // const handleMount = async () => {
  //   try {
  //     // 1. GET request aan dj-rest-auth/user;
  //     // 1a. CurrentUser wordt op "data" gezet
  //     const { data } = await axios.get("dj-rest-auth/user/");
  //     setCurrentUser(data);
  //   } catch (err) {
  //     // 1b. Mocht er een fout optreden, dan wordt die ook
  //     // in de console weergegeven
  //     console.log(err);
  //   }
  // };

  // 2. De request zal worden uitgevoerd, wanneer de component is gemount
  // 2a. Denk daarbij erom om een [] dependency lege array als tweede
  // argument toe te voegen. Hiermee zorgen we dat dit code-blok maar één
  // keer wordt uitgevoerd.
  // useEffect(() => {
  //   handleMount();
  // }, []);

  return (
    // 3b. Deze providers geven alle child-elementen toegang
    // tot currentUser en setCurrentUser() ---> deze zijn nu
    // props geworden, die in de afzonderlijke componenten 
    // kunnen worden gebruikt ---> verplaatst naar contexts > CurrentUserContext.js
      <div className={styles.App}>
        <NavBar />
        <Container className={styles.Main}>
          <Switch>
            <Route exact path="/" render={() => <h1>Home page</h1>} />
            <Route exact path="/signin" render={() => <SignInForm />} />
            <Route exact path="/signup" render={() => <SignUpForm />} />
            <Route render={() => <p>Page not found!</p>} />
          </Switch>
        </Container>
      </div>
  );
}

export default App;
