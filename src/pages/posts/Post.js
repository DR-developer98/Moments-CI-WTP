import React from "react";
// 10. import desbetreffende styles; voor stap 10a. ga naar PostPage.js
import styles from "../../styles/Post.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Card, Media } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Avatar from "../../components/Avatar";
import { axiosRes } from "../../api/axiosDefault";
import { MoreDropdown } from "../../components/MoreDropdown";

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
    // 11b. setPosts (prop in de <Post/> uit PostPage.js)
    // hebben we nodig om de post te updaten.
    // voor stap 11c. kijk in de handleLike-functie
    setPosts,
  } = props;

  // 10c. De ingelogde gebruiker kan niet zijn eigen posts liken
  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;

  // 16g. Voor de Post-edit functie moeten we de gebruiker naar /posts/:id/edit doorsturen
  // Hiertoe hebben we de useHistory hook nodig.
  const history = useHistory();

  // 16h. Functie voor het behandelen van de edit functie 
  const handleEdit = () => {
    // 16ha. d.m.v. history.push("NEW PATHNAME") sturen we de gebruiker door naar /posts/:id/edit
    // de handleEdit functie geven we dan door als prop.
    // 16i. {is_owner && postPage && <MoreDropdown handleEdit={handleEdit}/>}
    // Voor stap 16j. kijk weer in MoreDropdown.js
    history.push(`/posts/${id}/edit`)
  }

  // 16l. handleDelete-functie
  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/posts/${id}/`);
      history.goBack();
    } catch (err) {
      console.log(err);
    }
  }

  // 11. handleLike event handler | LIKE
  const handleLike = async () => {
    try {
      // 11a. Response Interceptor ==> axiosRes.post("likes/", {post: id})
      // Hiermee proberen we de post: id naar het /likes/-api-eindpunt te posten.
      // Zodoende weet de API welke post we proberen te liken
      const { data } = await axiosRes.post("/likes/", { post: id });
      // 11c. prevPosts ==> de vorige staat van "posts"
      setPosts((prevPosts) => ({
        ...prevPosts,
        results: prevPosts.results.map((post) => {
          return post.id === id
            ? // 11d. indien de id van de post die we willen liken met de id van de post in kwestie
              // correspondeert, dan wordt de gehele post geretourneerd met een met 1 verhoogd aantal likes
              { ...post, likes_count: post.likes_count + 1, like_id: data.id }
            : // 11e. zo niet, dan retourneren we simpelweg de post en doen daar verder niets mee
              post;
        }),
      }));
    } catch (err) {
      console.log(err);
    }
  };

  // 11f. UNLIKE event handler
  const handleUnlike = async () => {
    try {
      const { data } = await axiosRes.delete(`/likes/${like_id}/`);
      setPosts((prevPosts) => ({
        ...prevPosts,
        results: prevPosts.results.map((post) => {
          return post.id === id
            ? { ...post, likes_count: post.likes_count - 1, like_id: null }
            : post;
        }),
      }));
    } catch (err) {
      console.log(err);
    }
  };

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
            {is_owner && postPage && <MoreDropdown handleEdit={handleEdit} handleDelete={handleDelete}/>}
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
            <span onClick={() => {handleUnlike}}>
              <i className={`fas fa-heart ${styles.Heart}`} />
            </span>
          ) : currentUser ? (
            <span
              onClick={() => {
                handleLike;
              }}
            >
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
