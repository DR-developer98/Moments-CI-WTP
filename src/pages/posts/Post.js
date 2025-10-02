import React from "react";
// 10. import desbetreffende styles; voor stap 10a. ga naar PostPage.js
import styles from "../../styles/Post.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Card, Media } from "react-bootstrap";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import Avatar from "../../components/Avatar";

const Post = (props) => {
  // 10b. Hier destructureren we de props (...post.results[0])
  // voor stap 10c. kijk beneden
  const {
    id,
    owner,
    profile_id,
    profile_image,
    comments_count,
    likes_count,
    like_id,
    title,
    content,
    image,
    updated_at,
    // 10g. postPage toegevoegd als te deconstructureren prop
    // postPage is een Truthy-waarde
    // voor stap 10h. kijk in 8. Notities
    postPage,
  } = props;

  // 10c. De ingelogde gebruiker kan niet zijn eigen posts liken
  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;

  return (
    <Card className={styles.Post}>
      <Card.Body>
        <Media className="align-items-center justify-content-between">
          <Link to={`/profiles/${profile_id}`}>
            <Avatar
              // 10d. weergave avatar image, ietsjes groter dan in de navbar
              src={profile_image}
              height={55}
            />
            {owner}
          </Link>
          <div className="d-flex align-items-center">
            <span
            // 10e. Hier geven we weer wanneer de post voor het laatst gewijzigd is
            // voor stap 10f. kijk in PostPage.js --> postPage prop in <Post/>
            >
              {updated_at}
            </span>
            {is_owner && postPage && "..."}
          </div>
        </Media>
      </Card.Body>
      <Link to={`/posts/${id}`}>
        <Card.Img src={image} alt={title} />
      </Link>
      <Card.Body>
        {title && <Card.Title className="text-center">{title}</Card.Title>}
        {content && <Card.Text>{content}</Card.Text>}
        <div className={styles.PostBar}>
          {is_owner ? (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>You can't like your own post!</Tooltip>}
            >
              <i className="far fa-heart" />
            </OverlayTrigger>
          ) : like_id ? (
            <span onClick={() => {}}>
              <i className={`fas fa-heart ${styles.Heart}`} />
            </span>
          ) : currentUser ? (
            <span onClick={() => {}}>
              <i className={`far fa-heart ${styles.HeartOutline}`} />
            </span>
          ) : (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Log in to like posts!</Tooltip>}
            >
              <i className="far fa-heart" />
            </OverlayTrigger>
          )}
          {likes_count}
          <Link to={`/posts/${id}`}>
            <i className="far fa-comments" />
          </Link>
          {comments_count}
        </div>
      </Card.Body>
    </Card>
  );
};

export default Post;
