import React from "react";
import styles from "../../styles/Comment.module.css";
import { Media } from "react-bootstrap";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import Avatar from "../../components/Avatar";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { axiosRes } from "../../api/axiosDefault";

// 18e. Comment
const Comment = (props) => {
  const {
    profile_id,
    profile_image,
    owner,
    updated_at,
    content,
    id,
    setPost,
    setComments,
  } = props;
  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;

  // 18f. Voor de delete-functie hebben we zowel setComments alsook setPost nodig
  // Deze worden doorgegeven als props via PostPage.js. Deze hebben we hierboven
  // aan de gedestructureerde props toegevoegd
  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/comments/${id}/`);
      // 18g. setPost om de comments-count te updaten
      setPost((prevPost) => ({
        results: [
          {
            ...prevPost.results[0],
            comments_count: prevPost.results[0].comments_count - 1,
          },
        ],
      }));

      // 18h. setComments om de bewuste opmerking uit de lijst te verwijderen
      setComments((prevComments) => ({
        ...prevComments,
        results: prevComments.results.filter((comment) => comment.id !== id),
      }));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Media>
        <Link to={`/profiles/${profile_id}`}>
          <Avatar src={profile_image} />
        </Link>
        <Media.Body>
          <span className={styles.Owner}>{owner}</span>
          <span className={styles.Date}>{updated_at}</span>
          <p>{content}</p>
        </Media.Body>
        {is_owner && <MoreDropdown handleDelete={handleDelete} />}
      </Media>
    </div>
  );
};

export default Comment;
