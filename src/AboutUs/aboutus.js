import React from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBIcon,
} from "mdb-react-ui-kit";
import Navbar from "../Navbar/Navbar.js";

const AboutUsPage = () => {
  const EmreKaya = process.env.PUBLIC_URL + `/Images/Developers/EmreKaya.png`;

  const BahaYildirim =
    process.env.PUBLIC_URL + `/Images/Developers/BahaYildirim.png`;

  const MertCanTacyildiz =
    process.env.PUBLIC_URL + `/Images/Developers/MertCanTaçyıldız.jpg`;

  const EnesFurkanAkilli =
    process.env.PUBLIC_URL + `/Images/Developers/EnesFurkanAkıllı.jpg`;

  const AleynaKiziltas =
    process.env.PUBLIC_URL + `/Images/Developers/AleynaKızıltaş.jpg`;
  return (
    <div>
      <Navbar />
      <MDBCard
        className="bg-card"
        style={{ minHeight: "100vh", backgroundColor: "#E89F71" }}
      >
        <MDBCardBody className="text-center">
          <h2
            className="h2-responsive mb-4"
            style={{ fontSize: "2.5rem", color: "#AA4A30" }}
          >
            About Us
          </h2>
          <p style={{ fontSize: "2.0rem", color: "#AA4A30" }}>
            UnWasted aims to tackle one of the biggest problems of our time,
            food waste, and ensure that those in need can benefit from it.
            Restaurants can upload their surplus or donated items to our
            platform, and those in need can place orders for these items free of
            charge and collect them.
          </p>
          <p></p> {/* Add an empty paragraph for spacing */}
          <p></p> {/* Add an empty paragraph for spacing */}
          <MDBRow className="mt-5">
            <MDBCol md="4" className="mb-4">
              <img
                src={AleynaKiziltas}
                width={200}
                height={200}
                alt="Aleyna Kızıltaş"
              />
              <h5
                className="font-weight-bold mt-4"
                style={{ color: "#D57149", fontWeight: "bold" }}
              >
                Aleyna Kızıltaş
              </h5>
              <p
                className="text-muted"
                style={{ color: "#D57149", fontWeight: "bold" }}
              >
                Web Developer
              </p>
            </MDBCol>
            <MDBCol md="4" className="mb-4">
              <img src={EmreKaya} width={200} height={200} alt="Emre Kaya" />
              <h5
                className="font-weight-bold mt-4"
                style={{ color: "#D57149", fontWeight: "bold" }}
              >
                Hüseyin Emre Kaya
              </h5>
              <p
                className="text-muted"
                style={{ color: "#D57149", fontWeight: "bold" }}
              >
                Full Stack Developer
              </p>
            </MDBCol>
            <MDBCol md="4" className="mb-4">
              <img
                src={EnesFurkanAkilli}
                width={200}
                height={200}
                alt="Enes Furkan AKıllı"
              />
              <h5
                className="font-weight-bold mt-4"
                style={{ color: "#D57149", fontWeight: "bold" }}
              >
                Enes Furkan Akıllı
              </h5>
              <p
                className="text-muted "
                style={{ color: "#D57149", fontWeight: "bold" }}
              >
                Web Developer
              </p>
            </MDBCol>
            <MDBCol md="4" className="mb-4">
              <img
                src={BahaYildirim}
                width={300}
                height={200}
                alt="Baha Yıldırım"
              />
              <h5
                className="font-weight-bold mt-4"
                style={{ color: "#D57149", fontWeight: "bold" }}
              >
                Baha Yıldırım
              </h5>
              <p
                className="text-muted"
                style={{ color: "#D57149", fontWeight: "bold" }}
              >
                Back-end Developer
              </p>
            </MDBCol>
            <MDBCol md="4" className="mb-4">
              <img
                src={MertCanTacyildiz}
                width={200}
                height={200}
                alt="Mert Can Taçyıldız"
              />
              <h5
                className="font-weight-bold mt-4"
                style={{ color: "#D57149", fontWeight: "bold" }}
              >
                Mert Can Taçyıldız
              </h5>
              <p
                className="text-muted"
                style={{ color: "#D57149", fontWeight: "bold" }}
              >
                Front-end Developer
              </p>
            </MDBCol>
          </MDBRow>
        </MDBCardBody>
      </MDBCard>
    </div>
  );
};

export default AboutUsPage;
