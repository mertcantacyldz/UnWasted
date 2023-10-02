import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Axios from "axios";

function FormPopup({ contact, location }) {
  const [show, setShow] = useState(false);
  const [feedback, setFeedback] = useState();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const sendFeedback = () => {
    handleClose();
    Axios.post(`http://localhost:8080/answercontact`, {
      contactid: contact.id,
      feedback: feedback,
    }).then((response) => {
      setFeedback(response.data);
    });

    window.location.reload();
  };

  const [user, setUser] = useState([]);

  useEffect(() => {
    Axios.get(`http://localhost:8080/profile/${contact.user_id}`).then(
      (response) => {
        setUser(response.data);
      }
    );
  }, []);

  return (
    <>
      {location === "Admin" ? (
        <>
          <Button variant="primary" onClick={handleShow}>
            Show Contact
          </Button>

          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Contact Information</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label>User Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    disabled
                    value={contact.message}
                  />
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label>User Name</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    disabled
                    value={user.fullname}
                  />
                </Form.Group>
                {contact.status === "SOLVED" ? (
                  <>
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlTextarea1"
                    >
                      <Form.Label>Your Feedback</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={contact.feedback}
                        disabled
                      />
                    </Form.Group>
                  </>
                ) : (
                  <>
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlTextarea1"
                    >
                      <Form.Label>Write Feedback</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        onChange={(s) => {
                          setFeedback(s.target.value);
                        }}
                      />
                    </Form.Group>
                  </>
                )}
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={sendFeedback}
                disabled={contact.status === "SOLVED"}
              >
                Send Feedback
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      ) : (
        <>
          <Button variant="primary" onClick={handleShow}>
            Show Feedback
          </Button>

          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Contact Information</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label>User Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    disabled
                    value={contact.message}
                  />
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea1"
                >
                  <Form.Label>Feedback</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={contact.feedback}
                    disabled
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </>
  );
}

export default FormPopup;
