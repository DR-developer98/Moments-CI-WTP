import React, { useEffect, useRef, useState } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

import styles from "../../styles/PostCreateEditForm.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import { FormFile } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import { useHistory } from "react-router";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import { axiosReq } from "../../api/axiosDefault";

function PostEditForm() {
  const [errors, setErrors] = useState({});
  const [postData, setPostData] = useState({
    title: "",
    content: "",
    image: "",
  });

  const imageInput = useRef(null);
  const history = useHistory();
  // 17a. We gebruiken hier de useParams() hook om de "id" uit de url op te halen
  const { id } = useParams();

  // 17b. Zoals altijd gebruiken we de useEffect-hook voor functies die net voor het mounten
  // van een component te laten runnen
  useEffect(() => {
    const handleMount = async () => {
      try {
        // 17c. Zoals altijd halen we de post op a.d.h.v. zijn id
        const { data } = await axiosReq.get(`/posts/${id}`);
        // 17d. we deconstructureren de data in title, content, image en is_owner
        const { title, content, image, is_owner } = data;
        // 17e. indien de gebruiker de eigenaar van de post is, dan zal de gebruiker toegang hebben
        // tot het edit-formulier, ander wordt ie d.m.v. history.push("/") naar de homepage teruggestuurd
        is_owner ? setPostData({ title, content, image }) : history.push("/");
      } catch (err) {
        console.log(err);
      }
    };

    // 17f. hier roepen we de handleMount() functie aan
    handleMount();
    // 17g. hieronder zoals altijd de dependency-array
    // Voor stap 17h. kijk bij handleSubmit
  }, [history, id]);

  const handleChange = (event) => {
    setPostData({
      ...postData,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeImage = (event) => {
    if (event.target.files.length) {
      URL.revokeObjectURL(image);
      setPostData({
        ...postData,
        image: URL.createObjectURL(event.target.files[0]),
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    // 17h. Hiermee checken we of er al een bestand bestaat in imageInput
    // (d.w.z. heeft de gebruiker een nieuwe foto geüpload?)
    // zo niet, dan zal het oorspronkelijke bestand in de API blijven,
    // zo ja, dan wordt de nieuwe foto voor de oude in de plaats geplaatst
    // voor stap 17i. kijk in het try-deel van het statement
    if (imageInput?.current?.files[0]) {
      formData.append("image", imageInput.current.files[0]);
    }
    try {
      // 17i. We moeten hier een .put request doen i.p.v. een .post,
      // want wij willen geen nieuw post-item aanmaken in de API.
      // Daarnaast voegen we ook het staartje ${id} toe aan de url
      // zodat de API weet welke post geüpdatet moet worden
      await axiosReq.post(`/posts/${id}/`, formData);
      // 17j. hiermee sturen we de gebruiker terug naar de post, die hij net
      // bewerkt heeft. We hoeven dus niet langer het "data"-object te deconstructureren
      // en daarom kunnen we die van voor "awai [...]" verwijderen.
      history.push(`/posts/${id}`);
    } catch (err) {
      console.log(err);
      if (err.response?.status !== 401) {
        setErrors(err.response?.data);
      }
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
          onChange={handleChange}
        />
      </Form.Group>
      {errors?.title?.map((message, idx) => (
        <Alert key={idx} variant="warning">
          {message}
        </Alert>
      ))}
      <Form.Group>
        <Form.Label>Content</Form.Label>
        <Form.Control
          value={content}
          rows={6}
          as="textarea"
          name="content"
          onChange={handleChange}
        />
      </Form.Group>
      {errors?.content?.map((message, idx) => (
        <Alert key={idx} variant="warning">
          {message}
        </Alert>
      ))}
      <Button
        className={`${btnStyles.Button} ${btnStyles.Blue}`}
        onClick={() => history.goBack()}
      >
        cancel
      </Button>
      <Button className={`${btnStyles.Button} ${btnStyles.Blue}`} type="submit">
        save
      </Button>
    </div>
  );

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col className="py-2 p-0 p-md-2" md={7} lg={8}>
          <Container
            className={`${appStyles.Content} ${styles.Container} d-flex flex-column justify-content-center`}
          >
            <Form.Group className="text-center">
              <figure>
                <Image className={appStyles.Image} src={image} rounded />
              </figure>
              <div>
                <Form.Label
                  className={`${btnStyles.Button} ${btnStyles.Blue} btn`}
                  htmlFor="image-upload"
                >
                  Change the image
                </Form.Label>
              </div>

              <FormFile
                id="image-upload"
                accept="image/*"
                onChange={handleChangeImage}
                ref={imageInput}
              />
            </Form.Group>
            {errors?.image?.map((message, idx) => (
              <Alert key={idx} variant="warning">
                {message}
              </Alert>
            ))}
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

export default PostEditForm;
