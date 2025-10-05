import React, { useEffect, useState } from "react";
import appStyles from "../../App.module.css";
import { Container } from "react-bootstrap";
import { axiosReq } from "../../api/axiosDefault";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import Asset from "../../components/Asset";
import Profile from "./Profile";

// 20a. We destructureren de mobile-prop direct tussen haakjes
// voor stap 20b. kijk net boven het return-statement
const PopularProfiles = ({ mobile }) => {
  const [profileData, setProfileData] = useState({
    // 19. We zetten beide keys op dezelfde waarde,
    // omdat we voor latere stappen het nodig hebben, dat
    // beide in sync blijven
    pageProfile: { results: [] },
    popularProfiles: { results: [] },
  });

  // 19a. We deconstructureren popularProfiles
  const { popularProfiles } = profileData;
  // 19e. Wanneer voeren we het useEffect uit?
  // iedere gebruiker moet verschillende requests doen om
  // profielen te volgen of te ontvolgen; daarom zal currentUser
  // onderdeel zijn van de dependancy array.
  // Voor stap 19f. kijk onder <p>Most popular profiles</p>
  const currentUser = useCurrentUser();

  // 19b. Zoals altijd maken we gebruik van de useEffect-hook om
  // gegevens uit de API op te halen
  useEffect(() => {
    const handleMount = async () => {
      try {
        // 19c. hier deconstructureren we het data-object
        // we gebruiken de axios Request Interceptor om de profielen
        // in aflopende volgorde van volgers op te halen
        const { data } = await axiosReq.get(
          "/profiles/?ordering=-followers_count"
        );
        // 19d. indien alles goed gaat, dan kunnen we het volgende doen
        // We spreiden ...prevState uit (we nemen dus de huidige info mee)
        // om popularProfiles vervolgens met de opgehaalde data te updaten
        setProfileData((prevState) => ({
          ...prevState,
          popularProfiles: data,
        }));
        setHasLoaded(true);
      } catch (err) {
        console.log(err);
      }
      handleMount();
    };
  }, [currentUser]);

  return (
    // 20b. ${mobile && 'd-lg-none text-center mb-3'}
    // Indien "mobile" true (d.w.z doorgegeven als prop), dan voeg 'd-lg-none text-center mb-3'
    // als klasses toe.
    // Voor stap 20c. Kijk hieronder (ternarny conditional met mobile ? () : ())
    <Container className={`${appStyles.Content} ${mobile && 'd-lg-none text-center mb-3'}`}>
      {
        // 19g. Indien popularProfiles > 0, dan worden de profielen weergegeven.
        // Indien nee, dan wordt er een Spinner weergegeven
        popularProfiles.results.length ? (
          <>
            <p>Most popular profiles</p>
            {mobile ? (// 20c. mobile aanwezig als prop ---> JA? dan maximaal 4 profielen (.slice(0,4)) 
            // naast elkaar (d-flex justify-content-around) weergeven
                <div className="d-flex justify-content-around">
                    {popularProfiles.results.slice(0,4).map((profile) => {
                        <Profile key={profile.id} profile={profile} mobile/>
                    })}
                </div>
            ) : ( // 20ca. NEE? Dan reguliere profielenweergave (10 items onder elkaar)
            popularProfiles.results.map((profile) => {
              // 19f. We itereren door de profielen om ze allemaal weer te geven
              <Profile key={profile.id} profile={profile}/>
            })
            ) }
          </>
        ) : (
          <Asset spinner />
        )
      }
    </Container>
  );
};

export default PopularProfiles;
