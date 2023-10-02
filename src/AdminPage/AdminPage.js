import "./AdminPage.css";
import Navbar from "../Navbar/Navbar";
import { useEffect, useState } from "react";
import Axios from "axios";
import ContactInfo from "./ContactInfo/ContactInfo";

function AdminPage() {
  const [contactlist, setContactlist] = useState([]);

  useEffect(() => {
    Axios.get(`http://localhost:8080/allcontacts`).then((response) => {
      setContactlist(response.data);
    });
  }, []);

  console.log("contact sayfasına gelen veri: " + contactlist);

  return (
    <div className="body">
      <Navbar />
      <div className="container-fluid d-flex fullbody">
        <div className="container-fluid  tableContainer">
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
                    location="Admin"
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

export default AdminPage;
