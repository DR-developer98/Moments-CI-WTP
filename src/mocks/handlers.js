// 25a. We hebben dan de URL van onze API nodig
const baseURL = "https://drf-api-wtp-project-731b35348821.herokuapp.com/"

// 25. handlers-Array om al onze mock-handlers in op te slaan
export const handlers = [
    // 25b. `${baseURL}dj-rest-auth/user/` ===> Dit werkt voor dit project niet op dit moment
    // omdat ik bij het volgen van het WTP. Om toegang te krijgen tot het JSON-object,
    // moeten we inloggen op Moments en dan aan de URL van de API het staartje dj-rest-auth/user/ 
    // toevoegen. Deze test probeert dit eindpunt dj-rest-auth/user te bereiken en het JSON-object
    // gerelateerd aan de ingelogde gebruiker op te halen.
    // Het JSON-object dat we zien, zetten we neer bij 25c.

    // req=request, res=response, ctx=context
  rest.get(`${baseURL}dj-rest-auth/user/`, (req, res, ctx) => {
    return res(// 25c.
      ctx.json({
        pk: 2,
        username: "brian",
        email: "",
        first_name: "",
        last_name: "",
        profile_id: 2,
        profile_image:
          "https://res.cloudinary.com/dgjrrvdbl/image/upload/v1/media/../default_profile_qdjgyp",
      })
    );
  }),
  // 25d. Dit is om de afmeldfunctie na te bootsen.
  // Als alles goed gaat, retourneert onze callback-functie een 200 OK response
  // Voor stap 25e. ga naar setUpTests.js
  rest.post(`${baseURL}dj-rest-auth/logout/`, (req, res, ctx) => {
    return res(ctx.status(200));
  }),
];