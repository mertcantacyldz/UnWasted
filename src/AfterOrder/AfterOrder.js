import { useEffect, useState } from "react";
import "./AfterOrder.css";
import Navbar from "../Navbar/Navbar";
import bellIcon from "./Assets/bellicon.svg";
import productImage from "./Assets/productImage.png";
import clockIcon from "./Assets/clockicon.svg";
import Counter from "./Counter/Counter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapLocationDot } from "@fortawesome/free-solid-svg-icons";
import Axios from "axios";

function AfterOrder() {
  const [order, setOrder] = useState([]);
  const [user, setUser] = useState([]);
  const [product, setProduct] = useState([]);
  const [imagePath, setimagePath] = useState("");

  useEffect(() => {
    async function getorder() {
      try {
        const response = await Axios.get(`http://localhost:8080/orders`, {
          withCredentials: true,
        });
        setOrder(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    getorder();
  }, []);

  useEffect(() => {
    if (order && order.length > 0) {
      console.log("görmek istediğim order: ", order);
      Axios.get("http://localhost:8080/singleproduct/" + order[0].product_id, {
        withCredentials: true,
      }).then((response) => {
        setProduct(response.data);
        console.log("product response ", response.data[0].information);
        setimagePath(
          process.env.PUBLIC_URL +
            `/Images/ProductImages/${response.data[0].image}`
        );
      });
    }
  }, [order]);

  useEffect(() => {
    if (order && order.length > 0) {
      Axios.get(`http://localhost:8080/profile/${product[0].user_id}`, {
        withCredentials: true,
      }).then((response) => {
        setUser(response.data);
      });
    }
  }, [product]);

  const handleAddressClick = () => {
    const address = user.address;
    const searchAddress = encodeURI(address);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${searchAddress}`
    );
  };

  return (
    <div className="body">
      <Navbar />
      <div className="container-fluid d-flex fullbody">
        <div className="container-fluid d-flex innerBody">
          <div className="container d-flex headText">
            <div>
              <img src={bellIcon} className="iconSize" alt="bellicon" />
            </div>
            <p className="headText-text">
              SHOW THE RESTAURANT EMPLOYEE CODE TO RECEIVE THE PRODUCT
            </p>
            <div>
              <img src={bellIcon} className="iconSize" alt="bellicon" />
            </div>
          </div>
          <div className="container-fluid d-flex mt-3 centerBody">
            <div className="container d-flex me-4 codeBox">
              <div>
                <h3>Order Address</h3>
                <address>{user.address}</address>
                <div className="container d-flex iconDiv">
                  <button className="mapButton" onClick={handleAddressClick}>
                    <FontAwesomeIcon
                      icon={faMapLocationDot}
                      className="mapIcon"
                    />
                  </button>
                </div>
              </div>
            </div>
            <div className="container d-flex me-4 productImage">
              <img
                src={imagePath}
                alt="ProductImage"
                className="w-100 h-100 rounded-4"
              />
            </div>
            <div className="container d-flex codeBox">
              <p className="codeText">
                {order.length > 0 ? order[0].order_code : <p>...</p>}
              </p>
            </div>
          </div>
          <div className="container-fluid d-flex footer">
            <p className="footer-text">
              You chose{" "}
              {product.length > 0 ? product[0].product_name : <p>...</p>}!
            </p>
            <p className="footer-text">
              The food is reserved for you. You have <b>60 Minutes</b> to
              recieve
            </p>
            <div className="container d-flex timerContainer">
              <img
                src={clockIcon}
                alt="ClockIcon"
                className="clockIcon d-flex"
              />
              <p className="footer-text d-flex pt-4">
                Remaining Time:{" "}
                <Counter
                  {...(product.length > 0 ? product[0].product_id : null)}
                />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AfterOrder;
