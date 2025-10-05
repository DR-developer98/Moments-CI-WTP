import React, { useState } from "react";

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import appStyles from "../../App.module.css";
import styles from "../../styles/PostsPage.module.css";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import { axiosReq } from "../../api/axiosDefault";
import Post from "./Post";

import NoResults from "../../assets/no-results.png";
import Asset from "../../components/Asset";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";
import PopularProfiles from "../profiles/PopularProfiles";

// 13. We destructureren de props gelijk in de parameters van de functie
// filter is bij default op een lege string gezet
function PostsPage({ message, filter = "" }) {
  // 13a. de opgehaalde posts slaan we op in een leeg object
  const [posts, setPosts] = useState({ results: [] });
  // 13b. Terwijl de gebruiker het laden van alle posts afwacht,
  // zullen we een laadicoon weergeven
  const [hasLoaded, setHasLoaded] = useState(false);
  // 13c. useLocation retourneert een object met allerlei informatie over de huidige url
  // waar de gebruiker zich bevindt. We moeten dit weten voor als de gebruiker tijdens
  // het ophalen van de posts heen en weer tussen home, feed, etc... navigeert
  // voor stap 13d. kijk bij fetchPosts
  const { pathname } = useLocation();
  // 14a. query, setQuery (voor SearchBar). Voor stap 14b. ga terug naar de SearchBar ↓↓↓
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // 13d. d.m.v. de Request interceptor halen we de posts op
        // we passen hierbij het juiste filter toe
        const { data } = await axiosReq.get(`/posts/${filter}search=${query}`);
        // 13e. de opgehaalde data gebruiken we om de waarde van
        // de posts-variabel te updaten
        setPosts(data);
        // 13f. Daar er nu posts worden geretourneerd, wordt de loader
        // niet langer weergegeven
        setHasLoaded(true);
      } catch (err) {
        console.log(err);
      }
    };

    // 13h. hasLoaded moet weer op false, zodat de gebruiker de loader ziet
    // terwijl de posts worden opgehaald. Voor stap 13i. kijk in het return-statement
    setHasLoaded(false);
    // 13g. Wanneer willen we de fetchPosts functie runnen?
    // Iedere keer dat er een nieuw filter wordt toegepast
    // en dat de pathname verandert (d.w.z. wanneer de gebruiker
    // in van feed naar liked gaat en omgekeerd).
    // Daarom voegen we deze toe in de array als tweede parameter
    // van de useEffect hook

    // 14f. De API-request willen we pas na 1 seconde uitvoeren. Hiertoe gebruikern we een setTimeOut functie
    const timer = setTimeout(() => {
      fetchPosts();
    }, 1000);
    // 14g. Nadat de API-request succesvol is uitgevoerd, gebruiken we een cleanup-functie
    // Dit is één van de standaard-functies van de useEffect-hook
    return () => {
      clearTimeout(timer);
    };
  }, [filter, query, pathname]);

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <PopularProfiles
          // 20. We voegen de PopularProfiles-component ook op deze plek toe
          // om de weergave en de situering op de pagina ervan te differentiëren
          // tussen Desktop en mobiel.
          // Voor stap 20a. kijk in PopularProfiles.js
          mobile
        />
        <i className={`fas fa-search ${styles.SearchIcon}`}></i>
        <Form
          // 14. SEARCH BAR. Voor stap 14a. ga naar query, setQuery ↑↑↑
          // 14b. value={query} stelt ons in staat om wijzigingen in de zoekbalk waar te nemen en bij te houden
          value={query}
          // 14c. wanneer er wijzigingen optreden, wordt de query door de setQuery-functie bijgewerkt
          // stap 14d. (zie boven) ---> ${filter}search=${query}
          // stap 14e. (zie boven) ---> "query" toegevoegd als element van de array (2e argument useEffect hook).
          // Op deze manier runt de useEffect hook ook wanneer er een wijziging in de query wordt waargenomen (d.w.z
          // terwijl de gebruiker iets in de zoekbalk aan het intypen is)
          // voor stap 14f. kijk aan het einde van de useEffect hook
          onChange={(event) => setQuery(event.target.value)}
          className={styles.SearchBar}
          onSubmit={(event) => event.preventDefault()}
        >
          <Form.Control
            type="text"
            className="mr-sm-2"
            placeholder="Search posts"
          />
        </Form>
        {
          // 13i. Logica voor het weergeven van de posts
          hasLoaded ? ( // 13ia. JA, zijn er posts?
            <>
              {posts.results.length ? ( // // 13ib. JA! dan laten we erdoorheen mappen (om ze een voor een weer te geven)
                <InfiniteScroll
                  // 15. InfiniteScroll (geïmporteerd uit react-bootstrap). Die neemt een children-prop
                  // waarin we de component invoegen, waar we die infinite scroll op toe willen passen
                  children={posts.results.map((post) => {
                    <Post
                      key={post.id}
                      // 13ic. met {...post} en setPosts={setPosts} zal de gebruiker
                      // de posts kunnen liken en becommentariëren
                      {...post}
                      setPosts={setPosts}
                    />;
                  })}
                  // 15a. dataLength --> hoe veel items er weergegeven moeten worden
                  // 15b. loader --> weer te geven component wanneer de items worden ogpehaald
                  // 15c. hasMore --> wat te doen wanneer de bodem van de pagina is bereikt?
                  dataLength={posts.results.length}
                  loader={<Asset spinner />}
                  // 15ca. hasMore --> in onze API zien we dat de posts een "next"-key hebben, die
                  // aangeeft of er volgende pagina's aan posts bestaan. Deze is of "true" of "false".
                  // Wanneer de laatste pagina is bereikt, dan staat ie gelijk aan false.
                  // We gebruiken hierbij een double NOT operator !!posts.next
                  // De functie van de double NOT operator is om expliciete checks uit te voeren
                  // of een zuivere Boolean-waarde terug te koppelen
                  hasMore={!!posts.next}
                  // 15d. next --> deze prop accepteert een functie die aangeroepen zal worden om de
                  // volgende pagina met resultaten weer te geven, indien hasMore = true
                  // Voor stap 15e. ga naar utils>utils.js

                  // 15i. fetchMoreData(posts, setPosts)
                  next={() => {
                    fetchMoreData(posts, setPosts);
                  }}
                />
              ) : (
                // // 13id. NEE, dan geef de NoResults image weer met de bijbehorende melding
                <Container className={appStyles.Content}>
                  <Asset src={NoResults} message={message} />
                </Container>
              )}
            </>
          ) : (
            // 13ie. NEE, geef de spinner weer
            <Container className={appStyles.Container}>
              <Asset spinner />
            </Container>
          )
        }
      </Col>
      <Col md={4} className="d-none d-lg-block p-0 p-lg-2">
        <PopularProfiles />
      </Col>
    </Row>
  );
}

export default PostsPage;
