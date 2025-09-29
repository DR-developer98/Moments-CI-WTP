import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import styles from "../../styles/SignInUpForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";

import {
  Form,
  Button,
  Image,
  Col,
  Row,
  Container,
  Alert,
} from "react-bootstrap";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

const SignUpForm = () => {
  // Ter herinneringç met de hook useState
  // bepalen we de default waarde van - in dit geval - signUpData
  // De default waarde is gelijk aan een object met drie keys,
  // alle met als waarde een lege string.
  const { signUpData, setSignUpData } = useState({
    username: "",
    password1: "",
    password2: "",
  });
  // Hier hebben we signUpData gedeconstrueerd
  // Op deze manier hebben we toegang tot de
  // afzonderlijke keys.
  const { username, password1, password2 } = signUpData;
  // ↓↓↓ We slaan alle errors op in een object en gebruikern de useState hook
  // om de waarde van het errors-object op leeg {} te zetten
  const { errors, setErrors } = useState({});
  // ↓↓↓ useHistory is een hook. Het geeft je toegang tot het history-object.
  // Het history-object stelt je in staat om naar een andere pagina te navigeren,
  // terug te gaan naar de vorige pagina, de browsergeschiedenigs beheren
  const history = useHistory();
  const handleChange = (event) => {
    setSignUpData({
      // ...signUpData: door dit te doen wordt het hele object
      // signUpData in de huidige status gekopieerd.
      ...signUpData,
      // ↓ hieronder creëren we een key:value-paar,
      // event.target.name is de beginwaarde
      // event.target.value is de waarde ingegeven door de gebruiker
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // we gaan signUpData (object dat alle registratiegegevens bevat)
      // naar het registratie-eindpunt /registration posten.
      // Door middel van het try statement, gaan we een
      // controle op dit statement uitoeren.
      await axios.post("/dj-rest-auth/registration/", signUpData);
      // history.push ==> na de submit willen we uitkomen op de /signin pagina
      history.push("/signin");
    } catch (err) {
      // ↓↓↓ err.response?.data ===> optional chaining
      // d.w.z. checken of de "response" is gedefinieerd
      // alvorens naar de "data" op zoek te gaan.
      setErrors(err.response?.data);
    }
  };

  return (
    <Row className={styles.Row}>
      <Col className="my-auto py-2 p-md-2" md={6}>
        <Container className={`${appStyles.Content} p-4 `}>
          <h1 className={styles.Header}>sign up</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="username">
              <Form.Label className="d-none">username</Form.Label>
              <Form.Control
                type="text"
                placeholder="username"
                name="username"
                // ter herinnering: met
                // het "value"-attribuut,
                // zetten we de beginwaarde van het username-inputveld
                // op '' (een lege string, zoals boven aangegeven)
                value={username}
                onChange={handleChange}
              />
            </Form.Group>
            {errors.username?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}
            <Form.Group controlId="password1">
              <Form.Label className="d-none">Password</Form.Label>
              <Form.Control
                className={styles.Input}
                type="password"
                placeholder="Password"
                name="password1"
                value={password1}
                onChange={handleChange}
              />
            </Form.Group>
            {errors.password1?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}
            <Form.Group controlId="password2">
              <Form.Label className="d-none">Confirm password</Form.Label>
              <Form.Control
                className={styles.Input}
                type="password"
                placeholder="Confirm password"
                name="password2"
                value={password2}
                onChange={handleChange}
              />
            </Form.Group>
            {errors.password2?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}
            <Button
              className={`${btnStyles.Button} ${btnStyles.Wide} ${btnStyles.Bright}`}
              type="submit"
            >
              Sign up
            </Button>
            {errors.non_field_errors?.map((message, idx) => (
              <Alert variant="warning" key={idx} className="mt-3">
                {message}
              </Alert>
            ))}
          </Form>
        </Container>
        <Container className={`mt-3 ${appStyles.Content}`}>
          <Link className={styles.Link} to="/signin">
            Already have an account? <span>Sign in</span>
          </Link>
        </Container>
      </Col>
      <Col
        md={6}
        className={`my-auto d-none d-md-block p-2 ${styles.SignUpCol}`}
      >
        <Image
          className={`${appStyles.FillerImage}`}
          src={"https://codeinstitute.s3.amazonaws.com/AdvancedReact/hero2.jpg"}
        />
      </Col>
    </Row>
  );
};

export default SignUpForm;
