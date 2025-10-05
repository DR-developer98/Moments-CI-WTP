import { axiosReq } from "../api/axiosDefaults";

// 15e. fetchMoreData is een functie die we voor meerdere bronnen zullen gebruiken,
// waar paginatie op toegepast is, bijv. "posts" en "setPosts"
export const fetchMoreData = async (resource, setResource) => {
  try {
    // 15f. hier halen we de gegevens op, zoals altijd
    const { data } = await axiosReq.get(resource.next);
    // 15g. prevResource (bijv. de reeds weergegeven posts) nemen we mee,
    // dat is het hele punt van de Infinite Scroll
    setResource((prevResource) => ({
      // 15ga. we spreiden de prevResource uit (vorige staat van het object)
      ...prevResource,
      // 15gb. het next-attribuut updaten we met de URL van de volgende pagina van resultaten
      next: data.next,
      // 15gc. We gebruiken de .reduce-methode om de nieuw opgehaalde resultaten aan de huidige array
      // van resultaten op te hangen
      results: data.results.reduce((acc, cur) => {
        // 15h. Terwijl we posts uit volgende pagina's worden opgehaald, zullen de gebruikers ongetwijfeld
        // nieuwe posts aanmaken of bestaande verwijderen, waardoor reeds weergegeven posts in volgende pagina's
        // eindigen. Om te voorkomen dat er oude posts aan de huidige results-array
        // worden toegevoegd (wat tot dubbele waarden zou leiden), moeten we de al aanwezige posts uitfilteren.
        // Dit doen we d.m.v. de .some-methode

        // 15ha. Hierbij itereren we door accResult (huidige array van opgehaalde posts) en checken we voor iedere post of
        // zijn id gelijk is aan die van de nieuw opgehaalde post.
        // JA? ---> dan retourneren we acc (de huidige posts-array) zonder de nieuwe post toe te voegen (want zou er dubbel in komen te staan)
        // NEE? ---> de nieuw opgehaalde post is nog niet aanwezig en mag wel toegevoegd worden.
        // // d.m.v. [...acc, cur] ===> spreiden we de huidige array uit ...acc en voegen we de nieuw post "cur" toe
        // voor stap 15i. ga terug naar PostsPage
        return acc.some((accResult) => accResult.id === cur.id)
          ? acc
          : [...acc, cur];
      }, prevResource.results),
    }));
  } catch (err) {}
};

// 23g. followHeper-functie
export const followHelper = ({profile, clickedProfile, following_id}) => {
  return profile.id === clickedProfile.id
    ? // Dit is het profiel dat ik aangeklikt heb
      // update zijn volgerstal en zet zijn following_id
      {
        ...profile,
        followers_count: profile.followers_count + 1,
        // 23ga. we geven following_id door als prop
        // en data.id is in ProfileDataContext als prop
        // van followHelper doorgegeven, 
        // daarom hebben we geen following_id: data.id nodig.
        // folliwng_id is voldoende
        // Voor stap 23h. ga terug naar ProfileDataContext.js
        following_id,
      }
    : profile.is_owner
    ? // Dit is het profiel van de ingelogde gebruiker
      // update zijn volgendtal
      { ...profile, following_count: profile.following_count + 1 }
    : // Dit is niet het profiel van de ingelogde gebruiker of
      // het profiel dat de ingelogde gebruiker heeft aangeklikt,
      // dus retourneer het onveranderd
      profile;
};
