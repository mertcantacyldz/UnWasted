import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import Profile from "./Profile/Profile";
import Login from "./LoginRegister/App";
import Addproduct from "./AddProduct/AddProduct";
import AfterOrder from "./AfterOrder/AfterOrder";
import ContactForm from "./ContactForm/ContactForm";
import AdminPage from "./AdminPage/AdminPage";
import Homepage from "./HomePage/homepage";
import Products from "./Products/App";
import Cart from "./Products/Cart";
import AboutUs from "./AboutUs/aboutus"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />,
  },

  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/addproduct",
    element: <Addproduct />,
  },
  {
    path: "/afterOrder",
    element: <AfterOrder />,
  },
  {
    path: "/contactUs",
    element: <ContactForm />,
  },
  {
    path: "/adminPage",
    element: <AdminPage />,
  },
  {
    path: "/products",
    element: <Products />,
  },
  {
    path: "/cart",
    element: <Cart />,
  },
  {
    path: "/Aboutus",
    element: <AboutUs />,
  }
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
