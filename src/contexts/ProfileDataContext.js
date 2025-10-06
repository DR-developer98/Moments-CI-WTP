import { createContext, useContext } from "react";
import { useCurrentUser } from "./CurrentUserContext";
import { axiosRes, axiosReq } from "../api/axiosDefault";
import { followHelper, unfollowHelper } from "../utils/utils";
import { data } from "msw/lib/types/context";

export const ProfileDataContext = createContext();
export const SetProfileDataContext = createContext();

export const useProfiledata = () => useContext(ProfileDataContext);
export const useSetProfileData = () => useContext(SetProfileDataContext);

export const ProfileDataProvider = () => {
  const [profileData, setProfileData] = useState({
    pageProfile: { results: [] },
    popularProfiles: { results: [] },
  });

  const currentUser = useCurrentUser();

  // 23. Logica voor het volgen van een profiel
  // voor stap 23a. kijk bij SetProfileData.Provider
  const handleFollow = async (clickedProfile) => {
    try {
      const { data } = await axiosRes.post("/followers/", {
        followed: clickedProfile.id,
      });
      // 23f. Om het aantal gevolgde en volgende profielen zowel in PostPage alsook
      // in ProfilePage te updaten.
      setProfileData((prevState) => ({
        ...prevState,
        // 23fb. Deze update doorvoeren in de PostPage
        // Deze hele functie (binnen in de .map()-methode) kan vereenvoudigd worden
        // d.m.v. een followHelper-functie. Voor stap 23g. ga naar utils.js
        pageProfile: {
          results: prevState.popularProfiles.results.map((profile) =>
            followHelper(profile, clickedProfile, data.id)
          ),
          // 23h. ↑↑↑ followHelper-util gebruikt om al die code te vervangen ↑↑↑
          // Die code is allemaal in utils>followHelper ondergebracht
        },
        // 23fa. Deze update doorvoeren in de popular profiles-zijbalk
        popularProfiles: {
          ...prevState.popularProfiles,
          results: prevState.popularProfiles.results.map((profile) =>
            followHelper(profile, clickedProfile, data.id)
          ),
          // 23h. ↑↑↑ followHelper-util gebruikt om al die code te vervangen ↑↑↑
        },
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnfollow = async (clickedProfile) => {
    try {
      const { data } = await axiosRes.delete(
        `/followers/${clickedProfile.following_id}/`
      );
      setProfileData((prevState) => ({
        ...prevState,
        pageProfile: {
          results: prevState.popularProfiles.results.map((profile) =>
            unfollowHelper(profile, clickedProfile)
          ),
        },
        popularProfiles: {
          ...prevState.popularProfiles,
          results: prevState.popularProfiles.results.map((profile) =>
            unfollowHelper(profile, clickedProfile)
          ),
        },
      }));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get(
          "/profiles/?ordering=-followers_count"
        );
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
    <ProfileDataContext.Provider value={profileData}>
      <>
        {
          // 23a. We moeten de handleFollow-functie "expose" (blootstellen, als het ware)
          // daarom voegen we hem toe als waarde van de value-prop.
          // Voor stap 23b. ga naar ProfilePage.js
        }
      </>
      <SetProfileDataContext.Provider value={{ setProfileData, handleFollow, handleUnfollow }}>
        {children}
      </SetProfileDataContext.Provider>
    </ProfileDataContext.Provider>
  );
};
