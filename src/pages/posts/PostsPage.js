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
  const { pathname } = useLocation();

  useEffect(() => {
    const fetchPosts = async () => {
        try {
            // 13d. d.m.v. de Request interceptor halen we de posts op
            // we passen hierbij het juiste filter toe
            const {data} = await axiosReq.get(`/posts/${filter}`);
            // 13e. de opgehaalde data gebruiken we om de waarde van 
            // de posts-variabel te updaten
            setPosts(data);
            // 13f. Daar er nu posts worden geretourneerd, wordt de loader
            // niet langer weergegeven
            setHasLoaded(true);
        } catch (err) {
            console.log(err)
        }
    }

    // 13h. hasLoaded moet weer op false, zodat de gebruiker de loader ziet
    // terwijl de posts worden opgehaald. Voor stap 13i. kijk in het return-statement
    setHasLoaded(false);
    // 13g. Wanneer willen we de fetchPosts functie runnen?
    // Iedere keer dat er een nieuw filter wordt toegepast 
    // en dat de pathname verandert (d.w.z. wanneer de gebruiker
    // in van feed naar liked gaat en omgekeerd). 
    // Daarom voegen we deze toe in de array als tweede parameter
    // van de useEffect hook 
    fetchPosts();
  }, [filter, pathname])

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <p>Popular profiles mobile</p>
        {hasLoaded ? (//JA, zijn er posts?
            <>
            {posts.results.length ? (// // JA! dan laten we erdoorheen mappen (om ze een voor een weer te geven)
                posts.results.map(post => {
                    <Post key={post.id} 
                    // met {...post} en setPosts={setPosts} zal de gebruiker
                    // de posts liken en becommentariëren
                    {...post} setPosts={setPosts}/>
                })
            ) : (// // NEE, dan geef de NoResults image weer met de bijbehorende melding
                <Container className={appStyles.Content}>
                    <Asset src={NoResults} message={message}/>
                </Container>
            )}
            </>
        ) : (// NEE, geef de spinner weer
            <Container className={appStyles.Container}>
                <Asset spinner/>
            </Container>
        ) }
      </Col>
      <Col md={4} className="d-none d-lg-block p-0 p-lg-2">
        <p>Popular profiles for desktop</p>
      </Col>
    </Row>
  );
}

export default PostsPage;
