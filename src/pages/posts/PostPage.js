import React, { useEffect, useState } from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import appStyles from "../../App.module.css";
import { useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";

function PostPage() {
  // 9a. We gaan nu de gegevens van de beoogde post ophalen
  // a.d.h.v. de id die in de url voorkomt
  const { id } = useParams;
  // 9b. We gaan zo meteen een request doen aan de API voor één enkele post.
  // Wanneer we om één post vragen krijgen we ook één post-object terug.
  // Als we echter meerdere posts aanvragen, dan krijgen we een array van objecten.
  // We zetten de beginwaarde van post op een object met de "results" key, wier waarde
  // gelijk is aan een lege array. Op deze manier kunnen we ongeacht het aantal geretourneerde
  // posts operaties op de array uitvoeren
  const [post, setPost] = useState({ results: [] });

  useEffect(() => {
    const handleMount = async () => {
      try {
        // 9c. const [{name1: name2}] ==> deze manier van destructureren
        // stelt ons in staat om een variabel een betenisvollere naam te geven
        // wij halen een generieke "data" op, maar het heeft voor ons meer betekenis m
        // met de naam "post"
        const [{ data: post }] = await Promise.all([
            // 9d. een Promise is de "belofte" van een waarde/result-object.
            // Alle promises moeten "resolved" worden, d.w.z. waarkomen.
            // Indien deze waarkomen/nagekomen worden, dan gebruiken we de
            // Request Interceptor om de post met {id} op te halen
          axiosReq.get(`/posts/${id}`),
        ]);
        setPost({ results: [post] });
        console.log(post);
      } catch (err) {
        console.log(err);
      }
    };
    // 9e. Deze code zal runnen, iedere keer dat de :id in de url verandert
    handleMount();
    // 9f. [id] om ervoor te zorgen dat useEffect slechts één keer uitgevoerd wordt
  }, [id]);

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <p>Popular profiles for mobile</p>
        <p>Post component</p>
        <Container className={appStyles.Content}>Comments</Container>
      </Col>
      <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
        Popular profiles for desktop
      </Col>
    </Row>
  );
}

export default PostPage;
