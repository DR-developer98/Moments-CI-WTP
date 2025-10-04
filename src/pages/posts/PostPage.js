import React, { useEffect, useState } from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import appStyles from "../../App.module.css";
import { useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import Post from "./Post";

import CommentCreateForm from "../comments/CommentCreateForm";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import Comment from "../comments/Comment";

function PostPage() {
  // 9a. We gaan nu de gegevens van de beoogde post ophalen
  // a.d.h.v. de id die in de url voorkomt (ter herinnering: /posts/:id ===> de id van de post kan door de url worden weergegeven)
  const { id } = useParams();
  // 9b. We gaan zometeen een request doen aan de API voor één enkele post.
  // Wanneer we om één post vragen, krijgen we ook één post-object terug.
  // Als we echter meerdere posts opvragen, dan krijgen we een array van objecten.
  // We zetten de beginwaarde van post op een object met de "results" key, wier waarde
  // gelijk is aan een lege array. Op deze manier kunnen we ongeacht het aantal geretourneerde
  // posts operaties op de array uitvoeren
  const [post, setPost] = useState({ results: [] });
  const currentUser = useCurrentUser();
  const profile_image = currentUser?.profile_image;
  const [comments, setComments] = useState({ results: [] });

  useEffect(() => {
    const handleMount = async () => {
      try {
        // 9c. const [{name1: name2}] ==> deze manier van destructureren
        // stelt ons in staat om een variabel een betenisvollere naam te geven.
        // Wij halen een generieke "data" op, maar het heeft voor ons meer betekenis
        // met de naam "post"

        // 18a. {data: comments} ---> we deconstructureren de data en geven we hem 
        // de betekenisvollere naam "comments". Voor stap 18b. kijk onder setPost
        const [{ data: post }, {data: comments}] = await Promise.all([
          // 9d. een Promise is de "belofte" van een waarde/result-object.
          // Alle promises moeten "resolved" worden, d.w.z. waarkomen.
          // Indien deze waarkomen/nagekomen worden, dan gebruiken we de
          // Request Interceptor om de post met {id} op te halen.

          // Ter herinnering: een Request Interceptor onderschept iedere Req aan de API
          // die de inlogstatus van de gebruiker nodig heeft voor zijn uitvoering en ververst
          // de Access Token van de gebruiker
          axiosReq.get(`/posts/${id}`),
          // 18. Request voor het ophalen van de comments
          // voor stap 18a. zie hierboven const [...] = await Promis [...]
          axiosReq.get(`/comments/?post=${id}`)
        ]);
        // 9da. D.m.v. de setPost functie zetten we post op {results: [post]}
        setPost({ results: [post] });
        // 18b. Zet comments op "comments" d.m.v. setComments.
        // Voor stap 18c. kijk beneden net boven </Container>
        setComments(comments);
      } catch (err) {
        // 9db. Anders loggen we de foutmeldingen in de console
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
        <Post
          // 10a. we spreiden het post-object uit de results-array uit
          // zodat al zijn key-value paren als props doorgegeven kunnen worden
          // We geven ook de setPost functie als prop, die later nodig hebben
          // voor het bijhouden van de likes en comments.
          // Voor stap 10b. ga terug naar Post.js
          // 10f. we voegen postPage toe als prop om te checken of de gebruiker ook de eigenaar van de post is. Deze is een Truthy waarde
          // voor stap 10g. ga terug naar Post.js
          {...post.results[0]}
          setPosts={setPost}
          postPage
        />
        <Container className={appStyles.Content}>
          {currentUser ? (
            <CommentCreateForm
              profile_id={currentUser.profile_id}
              profileImage={profile_image}
              post={id}
              setPost={setPost}
              setComments={setComments}
            />
          ) : comments.results.length ? (
            "Comments"
          ) : null}

          {// 18c. Zijn er comments?
          comments.results.length ? ( // JA! Dan geef de comments weer
            comments.results.map(comment => {
              // 18d. we spreiden het comment-object uit d.m.v. {...comment}
              // zodat zijn content als props doorgegeven wordt
              // voor stap 18e. kijk in Comment.js
              <Comment key={comment.id} {...comment} setPost={setPost} setComments={setComments}/>
            })
          ) : currentUser ? ( // NEE! Is de gebruiker ingelogd? // // JA! Dan geef onderstaande melding weer
            <span>No comments yet, be the first to comment!</span>
          ) : ( // // NEE! Dan geef onderstaande melding weer
            <span>No comments... yet!</span>
          ) }

        </Container>
      </Col>
      <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
        Popular profiles for desktop
      </Col>
    </Row>
  );
}

export default PostPage;
