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