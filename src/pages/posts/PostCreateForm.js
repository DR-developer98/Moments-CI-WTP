// 1-10-2025
// 7. Voor de eerste stap (route creëren) ga naar App.js

import React, { useState } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
// 7c. import Asset
// voor stap 7d. kijk onder Form.label image-upload
import Asset from "../../components/Asset";

import Upload from "../../assets/upload.png";

import styles from "../../styles/PostCreateEditForm.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import { FormFile } from "react-bootstrap";

function PostCreateForm() {
  const [errors, setErrors] = useState({});
  // 7e. we definiëren postData en setPostData, vergelijkbaar met hoe
  // we dit bij de eerder gemaakte formulieren hebben we gedaan
  const [postData, setPostData] = useState({
    title: "",
    content: "",
    image: "",
  });

  // 7f. functie om Change te handelen
  const handleChange = (event) => {
    setPostData({
      ...postData,
      [event.target.name]: event.target.value,
    });
  };

  // 7i. functie om Change image te handelen
  const handleChangeImage = (event) => {
    // 7j. we checken of de gebruiker een afbeelding heeft uitgekozen
    // door te kijken of er een bestand is in de bestand-array (zo ja, dan is de length groter dan 0)
    if (event.target.files.length) {
      // 7jc. indien de gebruiker een andere afbeelding wilt uploaden na er al een ingeladen te hebben.
      // moeten we die lokale link naar de vorige image intrekken (revoke)
      // voor stap 7k. ga terug naar Form.File
      URL.revokeObjectURL(image);
      setPostData({
        // 7ja. zoals altijd spreiden we het postData-object uit
        ...postData,
        // 7jb. createObjectURL creëert een lokale link naar
        // het doorgegeven bestand (eerste element uit de files-array)
        image: URL.createObjectURL(event.target.files[0]),
      });
    }
  };

  const { title, content, image } = postData;

  const textFields = (
    <div className="text-center">
      <Form.Group>
        <Form.Label>Title</Form.Label>
        <Form.Control
          value={title}
          type="text"
          name="title"
          // 7g. onChange={handleChange},
          // gelijk aan wat we bij de andere twee formulieren hebben gedaan
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Content</Form.Label>
        <Form.Control
          value={content}
          rows={6}
          as="textarea"
          name="content"
          // 7g. onChange={handleChange},
          // gelijk aan wat we bij de andere twee formulieren hebben gedaan
          // voor stap 7h. scroll naar beneden naar FormFile
          onChange={handleChange}
        />
      </Form.Group>

      <Button
        className={`${btnStyles.Button} ${btnStyles.Blue}`}
        onClick={() => {}}
      >
        cancel
      </Button>
      <Button className={`${btnStyles.Button} ${btnStyles.Blue}`} type="submit">
        create
      </Button>
    </div>
  );

  return (
    <Form>
      <Row>
        <Col className="py-2 p-0 p-md-2" md={7} lg={8}>
          <Container
            className={`${appStyles.Content} ${styles.Container} d-flex flex-column justify-content-center`}
          >
            <Form.Group className="text-center">
              {
                // 7l. ternary statement om te checken of de gebruiker al een image heeft uitgekozen.
                // zo ja, dan gaat de expressie tussen het eerste paar () op,
                // anders is de tweede expressie van toepassing
                image ? (
                  <>
                    <figure>
                      <Image
                        className={appStyles.Image}
                        src={image}
                        // 7la. rounded: react-bootstrap prop om de hoeken van de image af te ronden
                        rounded
                      />
                    </figure>
                    <div>
                      <Form.Label
                      // 7lb. htmlFor="image-upload" zorgt ervoor dat de functie in FormFile weer wordt aangeroepen
                      // Met die css-styleregels komt dit label er als een button uit te zien
                        className={`${btnStyles.Button} ${btnStyles.Blue} btn`}
                        htmlFor="image-upload"
                      >
                        Change the image
                      </Form.Label>
                    </div>
                  </>
                ) : (
                  <Form.Label
                    className="d-flex justify-content-center"
                    htmlFor="image-upload"
                  >
                    <Asset
                      // 7d. we geven de afbeelding door (upload.png) als prop (die is bovenaan geïmporteerd)
                      // voor stap 7e. ga naar boven onder const err, setErr
                      src={Upload}
                      message="Click or tap to upload an image"
                    />
                  </Form.Label>
                )
              }

              <FormFile
                // 7h. de id moet gezet worden op "image-upload"
                // het accept-attribuut moet gezet worden op "image/*",
                // zodat we zeker weten dat de gebruikers alleen afbeeldingen in kunnen laden
                // voor stap 7i. ga weer naar boven onder handleChanges
                id="image-upload"
                accept="image/*"
                // 7k. nu kunnen we de onChange prop toevoegen
                // Voor stap 7l. ga naar boven de Form.Label "image-upload"
                onChange={handleChangeImage}
              />
            </Form.Group>
            <div className="d-md-none">{textFields}</div>
          </Container>
        </Col>
        <Col md={5} lg={4} className="d-none d-md-block p-0 p-md-2">
          <Container className={appStyles.Content}>{textFields}</Container>
        </Col>
      </Row>
    </Form>
  );
}

export default PostCreateForm;
