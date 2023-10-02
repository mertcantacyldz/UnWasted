import React, {
  useState,
} from "react"; /*useState Bileşeni globalde state yönetmemizi sağlar*/
import "./LoginRegister.css";
import Axios from "axios";
import LogRegImage from "./Assets/LogRegImage.png";
import Logo from "./Assets/Logo.svg";

/*Props parent send function/value to children (onClick icin kullandim)*/
export const Login = (props) => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const handleSubmit = (e) => {
    /*Capture when user submit form*/
    /*Bu yapilmazsa sayfa reload atar state kaybolur*/
    console.log(email);
  };

  const login = () => {
    Axios.post(
      "http://localhost:8080/login",
      {
        email: email,
        password: pass,
      },
      { withCredentials: true }
    ).then((response) => {
      console.log(response);
    });
  };

  return (
    <div>
      <div className="Logo">
        <img src={Logo} alt="" />
      </div>

      <img className="LogRegImage" src={LogRegImage} alt="" />

      <div className="auth-form-container">
        <h1 className="h1-sign-in">SIGN IN</h1>

        <form className="login-form" onSubmit={handleSubmit} method="post">
          <label htmlFor="email"></label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="E-mail or User name"
            id="email"
            name="email"
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
          <button type="submit" onClick={login}>
            Log In
          </button>
        </form>

        <button
          className="link-btn"
          onClick={() => props.onFormSwitch("register")}
        >
          Don't have an account? Register here!
        </button>
      </div>
    </div>
  );

  /*
    Foto    <img className="LogRegImage" src={LogRegImage} alt=""/>
           
    Logo    <div className="Logo">
                <img src={Logo} alt=""/>
            </div>

    Foto    <div className="LogRegImage">
                <img className="LogRegImage" src={LogRegImage} alt=""/>
            </div>
    */
};
