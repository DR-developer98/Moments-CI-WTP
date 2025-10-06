// 30-09-2025

import React, { useContext, useState } from "react";
import axios from "axios";

import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";

import { Link, useHistory } from "react-router-dom";

import styles from "../../styles/SignInUpForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";
// 3c. import { SetCurrentUserContext } from "../../App";
import { useSetCurrentUser } from "../../contexts/CurrentUserContext";
import { useRedirect } from "../../hooks/useRedirect";

function SignInForm() {
  // 3c. ↓↓↓ Zie App.js, hier slaan we de SetCurrentUserContext op in een variabel
  // const setCurrentUser = useContext(SetCurrentUserContext);
  // 3i. ↓↓↓ We updaten bovenstaande variabel 
  const setCurrentUser = useSetCurrentUser()
  // 24h. We importeren de useRedirect-hook
  // om de ingelogde gebruiker weg te houden
  // bij deze pagina als ze toch al ingelogd zijn
  // Voor stap 24i. ga naar histoy.goBack in handleSubmit
  useRedirect("loggedIn")

  const [signInData, setSignInData] = useState({
    username: "",
    password: "",
  });
  const { username, password } = signInData;

  const [errors, setErrors] = useState({});

  const history = useHistory();
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
        // We posten het signInData naar het /login-endpunt
        // 3d. we destructureren het data object
      const {data} = await axios.post("/dj-rest-auth/login/", signInData);
      // 3e. We zetten de waarde van currentUser op data.user (opgehaald uit de API)
      setCurrentUser(data.user)
      // Daarna sturen we de gebruiker door naar de homepagina ("/")
      // history.push("/");

      // 24i. We sturen de gebruiker terug naar de laatste pagina die hij bekeek 
      // voordat hij opnieuw in moest loggen.
      // Voor stap 24j. ga naar SignUpform.js
      history.goBack();
    } catch (err) {
        // Is de response gedefinieerd?
        // Zo ja, dan pas gaan we op zoek naar de data
      setErrors(err.response?.data);
    }
  };

  const handleChange = (event) => {
    setSignInData({
        // ...signInData ==> we nemen het gehele
        // signInData-object in zijn huidige status mee
      ...signInData,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <Row className={styles.Row}>
      <Col className="my-auto p-0 p-md-2" md={6}>
        <Container className={`${appStyles.Content} p-4 `}>
          <h1 className={styles.Header}>sign in</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="username">
              <Form.Label className="d-none">Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Username"
                name="username"
                className={styles.Input}
                value={username}
                onChange={handleChange}
              />
            </Form.Group>
            {errors.username?.map((message, idx) => (
              <Alert key={idx} variant="warning">
                {message}
              </Alert>
            ))}

            <Form.Group controlId="password">
              <Form.Label className="d-none">Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                className={styles.Input}
                value={password}
                onChange={handleChange}
              />
            </Form.Group>
            {errors.password?.map((message, idx) => (
              <Alert key={idx} variant="warning">
                {message}
              </Alert>
            ))}
            <Button
              className={`${btnStyles.Button} ${btnStyles.Wide} ${btnStyles.Bright}`}
              type="submit"
            >
              Sign in
            </Button>
            {errors.non_field_errors?.map((message, idx) => (
              <Alert key={idx} variant="warning" className="mt-3">
                {message}
              </Alert>
            ))}
          </Form>
        </Container>
        <Container className={`mt-3 ${appStyles.Content}`}>
          <Link className={styles.Link} to="/signup">
            Don't have an account? <span>Sign up now!</span>
          </Link>
        </Container>
      </Col>
      <Col
        md={6}
        className={`my-auto d-none d-md-block p-2 ${styles.SignInCol}`}
      >
        <Image
          className={`${appStyles.FillerImage}`}
          src={"https://codeinstitute.s3.amazonaws.com/AdvancedReact/hero.jpg"}
        />
      </Col>
    </Row>
  );
}

export default SignInForm;