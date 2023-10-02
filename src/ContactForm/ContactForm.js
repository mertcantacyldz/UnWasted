import "./ContactForm.css";
import Navbar from "../Navbar/Navbar";
import React from "react";
import Axios from "axios";
import { useState, useEffect } from "react";
import ContactInfo from "../AdminPage/ContactInfo/ContactInfo";

function ContactForm() {
  const [user, setUser] = useState([]);
  const [message, setMessage] = useState();
  const [contactlist, setContactlist] = useState([]);

  useEffect(() => {
    Axios.get(`http://localhost:8080/contacts`, { withCredentials: true }).then(
      (response) => {
        setContactlist(response.data);
      }
    );
  }, []);

  useEffect(() => {
    Axios.get("http://localhost:8080/profile", { withCredentials: true }).then(
      (response) => {
        setUser(response.data);
      }
    );
  }, []);

  const send = () => {
    Axios.post(
      `http://localhost:8080/contacts`,
      {
        message: message,
      },
      {
        withCredentials: true,
      }
    ).then((response) => {
      alert(response.data);
    });
  };

  return (
    <div className="body">
      <Navbar />
      <div className="container-fluid d-flex fullbody">
        <div className="container d-flex py-5 formContainer">
          <h1 id="formHeader">Contact Us</h1>
          <form className="container  form">
            <div>
              <label className="form-label text">Full Name</label>
              <div class="form-outline mb-4 formInput">
                <input
                  type="text"
                  className="form-control inputBackground"
                  value={user.fullname}
                />
              </div>
            </div>

            <div>
              <label className="form-label text">Email</label>
              <div class="form-outline mb-4 formInput">
                <input
                  type="email"
                  className="form-control inputBackground"
                  value={user.email}
                />
              </div>
            </div>

            <div>
              <label className="form-label text">Message</label>
              <div class="form-outline mb-4 formInput">
                <textarea
                  className="form-control inputBackground"
                  rows="4"
                  onChange={(v) => setMessage(v.target.value)}
                ></textarea>
              </div>
            </div>
            <button
              type="submit"
              class="btn  btn-block mb-4 submitButton"
              onClick={send}
            >
              Send
            </button>
          </form>
        </div>
        <div className="container d-flex previousFormContainer">
          <h1 className="previousFormHeader">Previous Contacts</h1>
          <table class="table table-hover table-striped align-middle mb-0 table">
            <thead style={{ backgroundColor: "#aa4a30" }}>
              <tr>
                <th className="theadText">Name</th>
                <th className="theadText">Created Date</th>
                <th className="theadText">Status</th>
                <th className="theadText">User Type</th>
                <th className="theadText">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contactlist.map((contact) => {
                return (
                  <ContactInfo
                    userid={contact.user_id}
                    contact={contact}
                    location="User"
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ContactForm;
