import React, {
  useEffect,
  useState,
} from "react"; /*useState Bileşeni globalde state yönetmemizi sağlar*/
import Axios from "axios";
import LogRegImage from "./Assets/LogRegImage.png";
import Logo from "./Assets/Logo.svg";
import { MDBRadio } from "mdb-react-ui-kit";

/*Props parent send function/value to children (onClick icin kullandim)*/
export const Register = (props) => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [type, setType] = useState("");
  const [address, setAddress] = useState("");
  const [donator, setDonator] = useState(false);
  const [file, setFile] = useState();

  const register = () => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("password", pass);
    formData.append("email", email);
    formData.append("fullname", name);
    formData.append("phone_no", contact);
    formData.append("type", type);
    formData.append("address", address);

    Axios.post("http://localhost:8080/register", formData).then((response) => {
      console.log(response);
    });
  };

  useEffect(() => {
    console.log("Dosya ismi: " + file);
  }, [file]);

  return (
    <div>
      <div className="Logo">
        <img src={Logo} alt="" />
      </div>

      <img className="LogRegImage" src={LogRegImage} alt="" />

      <div className="auth-form-container">
        <h1 className="h1-register">REGISTER</h1>
        <form
          className="register-form"
          enctype="multipart/form-data"
          method="POST"
        >
          <div>
            <MDBRadio
              name="inlineRadio"
              id="inlineRadio2"
              value="Buyer"
              label="Buyer"
              onChange={(e) => setType(e.target.value)}
              onClick={() => setDonator(false)}
              inline
            />
            <MDBRadio
              name="inlineRadio"
              id="inlineRadio1"
              value="Donator"
              label="Donator"
              onChange={(e) => setType(e.target.value)}
              onClick={() => setDonator(true)}
              inline
            />
          </div>
          <label htmlFor="email"></label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="E-mail"
            id="email"
            name="email"
          />
          <label htmlFor="username"></label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="fullname"
            placeholder={donator ? "Company Name" : "Full Name"}
            id="username"
            name="username"
          />
          {donator && (
            <>
              <label htmlFor="Address"></label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                type="text"
                placeholder="Address"
                id="Address"
              />
              <input
                filename={file}
                onChange={(e) => setFile(e.target.files[0])}
                type="file"
                accept="image/*"
              ></input>
            </>
          )}
          <label htmlFor="contactNumber"></label>
          <input
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            type="contactNumber"
            placeholder="Contact number"
            id="contactNumber"
            name="contactNumber"
          />
          <label htmlFor="password"></label>
          <input
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            type="password"
            placeholder="Password"
            id="password"
            name="password"
          />
          <br></br>
          <button type="submit" onClick={register}>
            Register
          </button>
        </form>

        <button
          className="link-btn"
          onClick={() => props.onFormSwitch("login")}
        >
          Already have an account? Login here!
        </button>
      </div>
    </div>
  );
};
