import React, { useEffect, useState } from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import Asset from "../../components/Asset";

import styles from "../../styles/ProfilePage.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";

import PopularProfiles from "./PopularProfiles";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { axiosReq } from "../../api/axiosDefault";
import {
  useProfiledata,
  useSetProfileData,
} from "../../contexts/ProfileDataContext";
import InfiniteScroll from "react-infinite-scroll-component";
import Post from "../posts/Post";
import NoResults from "../../assets/no-results.png";

function ProfilePage() {
  const [hasLoaded, setHasLoaded] = useState(false);
  const currentUser = useCurrentUser();
  // 22. We gebruiken hier de useParams() hook om de "id" uit de url op te halen
  const { id } = useParams();
  // 22c. setProfileData Context Hook geïmporteerd
  // voor stap 22d. kijk weer beneden in het try-gedeelte van het statement
  const setProfileData = useSetProfileData();
  // 22f. destructurering van het pageProfile-object
  const { pageProfile } = useProfiledata();
  // 22g. destructurering van het enkele profiel-object
  // Voor stap 22h. kijk bij <Image> in het return-statement
  const [profile] = pageProfile.results;
  // 22l. zoals altijd checken we op deze manier of de ingelogde gebruiker
  // ook de eigenaar van het weergegeven profiel is.
  // Zoek de "follow button" <p> op in het return-statement voor stap 22m.
  const is_owner = currentUser?.username === profile?.owner;
  const [profilePosts, setProfilePosts] = useState({ results: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 22a. {data: pageProfile} ---> we deconstructureren de data en geven we hem
        // de betekenisvollere naam "comments". Voor stap 18b. kijk onder setPost
        const [{ data: pageProfile }, { data: profilePosts }] =
          await Promise.all([
            axiosReq.get(`/profiles/${id}/`),
            axiosReq.get(`/profiles/?owner__profile=${id}`),
            // 22b. Als alles goed gaat moeten we pageProfile updaten
            // Hiervoor hebben we de useSetProfileData Context hook nodig
            // zie stap 22c. onder "const {id} = useParams()"
            setProfileData((prevData) => ({
              ...prevData,
              pageProfile: { results: [pageProfile] },
            })),
          ]);
        setProfilePosts(profilePosts);
        // 22d. We hebben a.d.h.v. de id het profiel opgehaald
        // d.m.v. setProfileData hebben we pageProfile geüpdatet
        // hasLoaded moet nu op true gezet worden, zodat de spinner verdwijnt
        setHasLoaded(true);
      } catch (err) {
        console.log();
      }
    };
    // 22e. Hier roepen we onze fetchData functie aan
    // Voor stap 22f. kijk weer boven
    fetchData();
  }, [id, setProfileData]);

  const mainProfile = (
    <>
      <Row noGutters className="px-3 text-center">
        <Col lg={3} className="text-lg-left">
          <Image
            className={styles.ProfileImage}
            // 22h. de roundedCircle prop is
            // om de afbeelding mooi af te ronden
            roundedCircle
            // 22i. profile? ("conditional chaining")
            // We kregen een error en dat was doordat JSX de profielimage
            // probeerde weer te geven, voordat de API-request volbracht was.
            // Om dit op te lossen, hoeven we simpelweg een ? achter "profile" te zetten
            // ===> profile moet eerst opgehaald worden, voordat er überhaupt een
            // profielimage weergegeven kan worden
            // Voor stap 22j. kijk hieronder
            src={profile?.image}
          />
        </Col>
        <Col lg={6}>
          <h3 className="m-2">{profile?.owner}</h3>
          <Row className="justify-content-center no-gutters">
            <Col xs={3} className="my-2">
              <>
                {
                  // 22j. profile?.posts_count,
                  // d.w.z. alleen wanneer de API-request volbracht is
                  // kan het profiel en de respectieve posts_count
                  // weergegeven worden. Voor stap 22k. ga verder naar beneden
                }
              </>
              <div>{profile?.posts_count}</div>
              <div>posts</div>
            </Col>
            <Col xs={3} className="my-2">
              <div>{profile?.followers_count}</div>
              <div>followers</div>
            </Col>
            <Col xs={3} className="my-2">
              <div>{profile?.following_count}</div>
              <div>following</div>
            </Col>
          </Row>
        </Col>
        <Col lg={3} className="text-lg-right">
          <>
            {
              // 22k. Voordat we de logica voor de weergave van de Follow-button
              // kunnen schrijven, moeten we bovenaan wat code toevoegen
              // om te checken of de ingelogde gebruiker ook de eigenaar van het
              // weergegeven profiel is ↑, ga dus naar boven voor stap 22l.
            }
          </>
          {
            // 22m. ternary conditional voor de weergave van follow en unfollow button
            // Ga verder naar beneden voor stap 22n.
            currentUser &&
              !is_owner(
                profile?.following_id ? (
                  <Button
                    className={`${btnStyles.Button} ${btnStyles.BlackOutline}`}
                    onClick={() => {}}
                  >
                    unfollow
                  </Button>
                ) : (
                  <Button
                    className={`${btnStyles.Button} ${btnStyles.Black}`}
                    onClick={() => {}}
                  >
                    follow
                  </Button>
                )
              )
          }
          <p>Follow button</p>
        </Col>
        {
          // 22n. is het profiel gedefinieerd?, zo ja,
          // indien er content is, dan wordt die binnenin de Col-tag
          // weergegeven
          profile?.content && <Col className="p-3">{profile.content}</Col>
        }
      </Row>
    </>
  );

  const mainProfilePosts = (
    <>
      <hr />
      <p className="text-center">{profile?.owner}'s posts</p>
      <hr />
      {profilePosts.results.length ? (
        <InfiniteScroll
          children={profilePosts.results.map((post) => {
            <Post key={post.id} {...post} setPosts={setProfilePosts} />;
          })}
          dataLength={profilePosts.results.length}
          loader={<Asset spinner />}
          hasMore={!!profilePosts.next}
          next={() => {
            fetchMoreData(profilePosts, setProfilePosts);
          }}
        />
      ) : (
        <Asset
          src={NoResults}
          message={`No results found, ${profile?.owner} hasn't posted yet.`}
        />
      )}
    </>
  );

  return (
    <Row>
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <PopularProfiles mobile />
        <Container className={appStyles.Content}>
          {hasLoaded ? (
            <>
              {mainProfile}
              {mainProfilePosts}
            </>
          ) : (
            <Asset spinner />
          )}
        </Container>
      </Col>
      <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
        <PopularProfiles />
      </Col>
    </Row>
  );
}

export default ProfilePage;
