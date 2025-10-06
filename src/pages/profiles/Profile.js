import React from "react";
import styles from "../../styles/Profile.module.css";
import buttonStyles from "../../styles/Button.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Button } from "react-bootstrap";
import { useSetProfileData } from "../../contexts/ProfileDataContext";

// 21. Zie PopularProfiles.js voor de doorgegeven props (mobile, profile en key)
const Profile = (props) => {
  // 21a. We destructureren de props zoals gewoonlijk
  const { mobile, profile, imageSize = 55 } = props;
  // 21b. We destructureren ook de doorgegeven "profile" prop
  const { id, following_id, image, owner } = profile;
  // 21c. We hebben ook nodig te weten, of de momenteel ingelogde gebruiker
  // ook de eigenaar van het profiel is
  const currentUser = useCurrentUser();
  // 21d. en ook of zijn username gelijk is aan de naam van de eigenaar van het profiel
  const is_owner = currentUser?.username === owner;

  // 23d. handleFollow functie gedestructureerd m.g.v. 
  // de useSetProfileData context hook.
  // Voor stap 23e. bij de Follow-button beneden
  const {handleFollow, handleUnfollow} = useSetProfileData();

  return (
    // 21e. WordBreak is ervoor bedoeld om te voorkomen dat dingen heel erg
    // krap op elkaar komen te staan in de mobielweergave
    // voor stap 21f. kijk beneden !mobile && currentuser && !is_owner
    <div
      className={`my-3 d-flex align-items-center ${mobile && "flex-column"}`}
    >
      <div>
        <Link className="align-self-center" to={`/profiles/${id}`}>
          <Avatar src={image} height={imageSize} />
        </Link>
      </div>
      <div className={`mx-2 ${styles.WordBreak}`}>
        <strong>{owner}</strong>
      </div>
      <div className={`text-center ${!mobile && ml - auto}`}>
        {!mobile &&
          currentUser &&
          !is_owner(
            // 21f. We zitten NIET op een telefoon && de gebruiker
            // is ingelogd && de gebruiker is NIET de eigenaar van het profiel
            // ==> is er een following_id? (d.w.z. volgt de ingelogde gebruiker het profiel in kwestie?)
            // JA! ==> geeft "unfollow"-button weer, anders geef de "follow"-button weer
            following_id ? (
              <Button
                className={`${buttonStyles.Button} ${buttonStyles.BlackOutline}`}
                onClick={() => {handleUnfollow(profile)}}
              >
                unfollow
              </Button>
            ) : (
              <Button
                className={`${buttonStyles.Button} ${buttonStyles.Black}`}
                // 23e. handleFollow in de event handler
                // met "profile" als argument. Dit profile
                // is het profiel, dat de gebruiker zojuist heeft aangeklikt
                // Voor stap 23f. ga naar handleFollow in ProfileDataContext.js
                onClick={() => handleFollow(profile)}
              >
                follow
              </Button>
            )
          )}
      </div>
    </div>
  );
};

export default Profile;
