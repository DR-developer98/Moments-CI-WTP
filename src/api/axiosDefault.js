import axios from "axios";

// ↓ URL van onze APi
axios.defaults.baseURL = "https://drf-api-wtp-project-731b35348821.herokuapp.com/"
// ↓ Dit is het data-formaat dat de API zal verwachten
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
// ↓ voorkomt foutmeldingen wanneer we cookies versturen ↓
axios.defaults.withCredentials = true