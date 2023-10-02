import { useEffect, useState } from "react";
import Axios from "axios";
import "./ContactInfo.css";
import ShowButton from "../FormPopup/FormPopup";

function ContactInfo({ userid, contact, location }) {
  const [user, setUser] = useState([]);

  useEffect(() => {
    Axios.get("http://localhost:8080/profile/" + userid, {
      withCredentials: true,
    }).then((response) => {
      setUser(response.data);
    });
  }, []);

  return (
    <>
      <tr>
        <td>
          <div class="d-flex align-items-center">
            <img
              src="https://mdbootstrap.com/img/new/avatars/8.jpg"
              alt=""
              style={{ width: "45px", height: "45px" }}
              class="rounded-circle"
            />
            <div class="ms-3">
              <p class="fw-bold mb-1">{user.fullname}</p>
              <p class="text-muted mb-0">{user.email}</p>
            </div>
          </div>
        </td>
        <td>
          <p class="fw-normal mb-1">{contact.date_created}</p>
        </td>
        <td>
          <span
            className={`badge rounded-pill d-inline  ${
              contact.status === "ACTIVE"
                ? "statusContainer"
                : "solvedContainer"
            }`}
          >
            {contact.status}
          </span>
        </td>
        <td>{user.type}</td>
        <td>
          <ShowButton contact={contact} location={location} />
        </td>
      </tr>
    </>
  );
}

export default ContactInfo;
