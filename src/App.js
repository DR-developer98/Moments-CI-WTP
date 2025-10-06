import NavBar from "./components/NavBar";
import styles from "./App.module.css";
import Container from "react-bootstrap/Container";
import { Route, Switch } from "react-router-dom";
// ↓ import axiosDefault
import "./api/axiosDefault";
import SignUpForm from "./pages/auth/SignUpForm";
import SignInForm from "./pages/auth/SignInForm";
// 7a. zie Route PostCreateForm beneden
// voor stap 7b. sie Asset.js
import PostCreateForm from "./pages/posts/PostCreateForm";
// 9. PostPage; zie Desbetreffende Route; voor 9a. zie PostPage.js
import PostPage from "./pages/posts/PostPage";
import PostsPage from "./pages/posts/PostsPage";
import { useCurrentUser } from "./contexts/CurrentUserContext";
import PostEditForm from "./pages/posts/PostEditForm";
import ProfilePage from "./pages/profiles/ProfilePage";
import UsernameForm from "./pages/profiles/UsernameForm";
import UserPasswordForm from "./pages/profiles/UserPasswordForm";
import ProfileEditForm from "./pages/profiles/ProfileEditForm";
// import { createContext, useEffect, useState } from "react";
// import axios from 'axios';

// 3. Iedere keer dat we de createContext-functie aanroepen,
// wordt er een nieuw Context-object gecreëerd.
// export const CurrentUserContext = createContext();
// export const SetCurrentUserContext = createContext();

function App() {
  // 12a. We willen weten wie de huidige gebruiker is, zodat we de door hem gelikete posts kunnen weergeven
  const currentUser = useCurrentUser();
  // 12b. We hebben uiteraard ook zijn profile_id nodig. Deze is gelijk aan de profile_id van de currentUser
  // indien deze gedefinieerd is (vanwaar het vraagteken achter --> currentUser?)
  // Indien de gebruikersdetails nog worden opgehaald, zal de profile_id gelijk worden gezet op een lege string.
  // voor stap 12c. kijk bij Routes
  const profile_id = currentUser?.profile_id || "";

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
          {/* <Route exact path="/" render={() => <h1>Home page</h1>} /> */}
          <Route
            // 12. We vervangen bovenstaande uitgecommentarieerde Home page door <PostsPage/>
            // voor stap 12a. kijk net onder App()
            exact
            path="/"
            render={() => (
              <PostsPage message="No results found. Adjust the search keyword" />
            )}
          />
          <Route
            // 12c. Route voor de feed (posts van gevolgde profielen)
            exact
            path="/feed"
            render={() => (
              <PostsPage
                message="No resulsts found. Adjust the search keyword or follow a profile"
                // 12d. filter voor de gevolgde profielen (kijk 21. Notities in 2. API)
                filter={`owner__followed__owner__profile=${profile_id}&`}
              />
            )}
          />
          <Route
            // 12e. Route voor de gelikete posts met het filter
            // voor stap 13. kijk weer in PostsPage.js
            exact
            path="/feed"
            render={() => (
              <PostsPage
                message="No resulsts found. Adjust the search keyword or like a post"
                filter={`likes__owner__profile=${profile_id}&ordering=-likes__created_at&`}
              />
            )}
          />
          <Route exact path="/signin" render={() => <SignInForm />} />
          <Route exact path="/signup" render={() => <SignUpForm />} />
          <Route exact path="/posts/create" render={() => <PostCreateForm />} />
          <Route
            exact
            // 9. :id betekent dat "id" een parameter is, die via de url doorgegeven kan worden
            path="/posts/:id"
            render={() => <PostPage />}
          />
          <Route
            exact
            // 17. :id in de url, deze kunnen we uit de url ophalen d.m.v. de useParams() hook
            // kijk in PostEditForm.js voor stap 17a.
            path="/posts/:id/edit"
            render={() => <PostEditForm />}
          />
          <Route exact path="/profiles/:id" render={() => <ProfilePage />} />
          <Route
            exact
            path="/profiles/:id/edit/username"
            render={() => <UsernameForm />}
          />
          <Route
            exact
            path="/profiles/:id/edit/password"
            render={() => <UserPasswordForm />}
          />
          <Route
            exact
            path="/profiles/:id/edit"
            render={() => <ProfileEditForm />}
          />
          <Route render={() => <p>Page not found!</p>} />
        </Switch>
      </Container>
    </div>
  );
}

export default App;
