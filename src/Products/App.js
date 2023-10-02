import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import Body from "./Body";
import Cart from "./Cart";
import "./body.css";
import Axios from "axios";

const App = () => {
  const [show, setShow] = useState(true);
  const [cart, setCart] = useState([]);
  const [warning, setWarning] = useState(false);
  const [products, setProduct] = useState([]);

  useEffect(() => {
    Axios.get("http://localhost:8080/products").then((res) => {
      setProduct(res.data);
      console.log(res);
    });
  }, []);

  const handleClick = (product) => {
    let isPresent = false;
    if (cart.length > 0) isPresent = true;

    if (isPresent) {
      setWarning(true);
      setTimeout(() => {
        setWarning(false);
      }, 2000);
      return;
    }

    Axios.post(
      "http://localhost:8080/addcart",
      {
        productId: product.id,
      },
      {
        withCredentials: true,
      }
    ).then((res) => {
      console.log(res);
    });

    alert("Product added successfully to cart");

    window.location.reload();
  };

  return (
    <React.Fragment>
      <Navbar size={cart.length} setShow={setShow} show={show} />
      {show ? (
        <Body
          handleClick={handleClick}
          products={products}
          cartlength={cart.length}
        />
      ) : (
        <Cart cart={cart} setCart={setCart} />
      )}
      {warning && (
        <div className="warning"> You can only add one item on basket !!</div>
      )}
    </React.Fragment>
  );
};

export default App;
