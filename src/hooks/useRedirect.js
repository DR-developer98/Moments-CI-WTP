import axios from "axios";
import { useHistory } from "react-router";

// 24. Veelzijdige hook om de gebruiker naar verschillende pagina's door te sturen 
// a.d.h.v. zijn loginstatus
export const useRedirect = (userAuthStatus) => {
    // 24a. Daar we de gebruiker moeten redirecten, hebben we uiteraard
    // het history-object en de useHistory-hook nodig
    const history = useHistory();

    // 24b. We moeten een netwerk-verzoek doen on Mount
    // Daartoe hebben we de useEffect-hook nodig
    // Zoals gewoonlijk gebruiken we de handleMount-functie en aangezien
    // we hier een netwerk-verzoek doen, hebben we een trycatch statement nodig
    useEffect(() => {
        const handleMount = async () => {
            try {
                // 24c. hier hebben we geen van onze Interceptors nodig
                // Dit eindpunt (tussen haakjes) zal ons vertellen of de
                // gebruiker wel of niet ingelogd is
                await axios.post('/dj-rest-auth/token/refresh/')
                // 24d. Indien de gebruiker wel ingelogd is, dan zal de rest
                // van de code in het try-block uitgevoerd worden. Indien dit niet 
                // het geval is, dan zal er een 401 error geretourneerd worden.

                // 24e. We voegen een if-statement om dit na te gaan
                // D.w.z. ===> indien de gebruiker ingelogd is, dan sturen we hem door
                // naar de homepagina
                if (userAuthStatus === "loggedIn") {
                    history.push("/");
                }
            } catch (err) {
                // 24f. Indien de gebruiker niet ingelogd is, dan sturen we hem terug 
                // naar de homepagina
                if (userAuthStatus === "loggedOut") {
                    history.push("/");
                }
            }
        }
        // 24g. Laten we niet vergeten om de handleMount-functie 
        // aan te roepen.
        // Voor sta 24h. ga naar SignInForm.js
        handleMount();
    }, [history, userAuthStatus])
}