import "bootstrap/dist/css/bootstrap.css";
import {
  Button,
  Container,
  Form,
  Nav,
  Navbar,
  NavDropdown,
  Stack,
  Card,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBIcon,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBBtn,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBCollapse,
} from "mdb-react-ui-kit";

import "./Navbar.style.css";

import Logo from "../Navbar/Assets/Logo.svg";

import Axios from "axios";

import { useLocation } from "react-router-dom";

function NavScrollExample({ size, setShow, show }) {
  const [showBasic, setShowBasic] = useState(false);
  const [user, setUser] = useState([]);
  const [cartSize, setCartSize] = useState(size);
  
  const location = useLocation();

  useEffect(() => {
    Axios.get("http://localhost:8080/profile", { withCredentials: true }).then(
      (response) => {
        setUser(response.data);
      }
    );
  }, []);

  let navigate = useNavigate();
  const routeChange = () => {
    let path = `login`;
    navigate(path);
  };
  function logout() {
    Axios.get("http://localhost:8080/logout", {
      withCredentials: true,
    });
  }

  const toggleStyle = {
    backgroundColor: "#E89F71",
    color: "#AA4A30",
    border: "none",
    fontSize: "1.2rem",
  };

  const menuStyle = {
    backgroundColor: "#E89F71",
    color: "white",
    width: "200px",
    borderRadius: "10px",
    fontSize: "1.2rem",
    padding: "10px",
  };

  const Loginbutton = {
    backgroundColor: "rgba(237, 207, 169, 0)",
    color: "#EDCFA9",
    border: "none",
    fontSize: "1.0rem",
    borderRadius: "1.5rem",
    width: "9rem",
    height: "2.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  };

  function handleClick() {
    window.location = "/cart";
    setCartSize(prevSize => prevSize + 1);
  }

  return (
    <MDBNavbar expand="lg" light>
      <MDBContainer fluid>
        <MDBNavbarBrand href="/">
          <img src={Logo} height="30" alt="" loading="lazy" />
        </MDBNavbarBrand>

        <MDBNavbarToggler
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
          onClick={() => setShowBasic(!showBasic)}
        >
          <MDBIcon icon="bars" fas />
        </MDBNavbarToggler>

        <MDBCollapse navbar show={showBasic}>
          <MDBNavbarNav className="mr-auto mb-2 mb-lg-0">
            <MDBNavbarBrand>
              <MDBNavbarItem>
                <MDBNavbarLink active aria-current="page" href="/">
                  Home
                </MDBNavbarLink>
              </MDBNavbarItem>
            </MDBNavbarBrand>
            <MDBNavbarBrand>
              <MDBNavbarItem>
                <MDBNavbarLink active aria-current="page" href="/products">
                  Products
                </MDBNavbarLink>
              </MDBNavbarItem>
            </MDBNavbarBrand>
            {user && user.type === "Donator" && (
               <MDBNavbarBrand>
                 <MDBNavbarItem>
                   <MDBNavbarLink active aria-current="page" href="/addProduct">
                     Add Products
                   </MDBNavbarLink>
                 </MDBNavbarItem>
               </MDBNavbarBrand>
             )}
            <MDBNavbarBrand>
              <MDBNavbarItem>
                <MDBNavbarLink active aria-current="page" href="contactUs">
                  Contact Us
                </MDBNavbarLink>
              </MDBNavbarItem>
            </MDBNavbarBrand>
            {user.isAdmin ? (
              <MDBNavbarBrand>
                <MDBNavbarItem>
                  <MDBNavbarLink active aria-current="page" href="adminPage">
                    Contact Forms
                  </MDBNavbarLink>
                </MDBNavbarItem>
              </MDBNavbarBrand>
            ) : null}
            <MDBNavbarBrand>
              <MDBNavbarItem>
                <MDBNavbarLink active aria-current="page" href="Aboutus">
                  About Us
                </MDBNavbarLink>
              </MDBNavbarItem>
            </MDBNavbarBrand>
          </MDBNavbarNav>
          {user.length === 0 ? (
            <>
              <MDBNavbarBrand>
                <MDBBtn color="#EDCFA9" style={Loginbutton} href="/login">
                  Login/Signup
                </MDBBtn>
              </MDBNavbarBrand>
            </>
          ) : (
            <>
              <MDBDropdown group className="shadow-0">
                <MDBDropdownToggle style={toggleStyle}>
                  <MDBIcon fas icon="user-ninja" /> {user.fullname}
                </MDBDropdownToggle>
                <MDBDropdownMenu style={menuStyle}>
                  <MDBDropdownItem link href="/profile">
                    Profile
                  </MDBDropdownItem>
                  <MDBDropdownItem link href="/afterOrder">
                    Orders
                  </MDBDropdownItem>
                  <MDBDropdownItem link href="/login" onClick={logout}>
                    LogOut
                  </MDBDropdownItem>
                </MDBDropdownMenu>
              </MDBDropdown>
              {location.pathname === "/products" ||
              location.pathname === "/cart" ? (
                <MDBNavbarBrand>
                  
                  <div className="cart" onClick={handleClick} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <MDBIcon fas icon="shopping-cart" size="sm" style={{ marginRight: '0.5rem' }} />
                    <span>{cartSize}</span>
                  </div>
                  
                </MDBNavbarBrand>
              ) : null}
            </>
          )}
        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar>
  );
}

export default NavScrollExample;
