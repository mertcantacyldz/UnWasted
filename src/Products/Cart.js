import React, { useState } from "react";
import { useEffect } from "react";
import "./cart.css";
import Axios from "axios";
import Navbar from "../Navbar/Navbar";
import { MDBContainer } from "mdb-react-ui-kit";

const Cart = ({}) => {
  const [readIngredient, setreadIngredient] = useState(false);
  const [cart, setCart] = useState([]);
  const [product, setProduct] = useState([]);
  const [code, setCode] = useState("");
  const [imagePath, setimagePath] = useState("");

  useEffect(() => {
    const randomCode = Math.floor(100000 + Math.random() * 900000);
    setCode(randomCode.toString());
  }, []);

  useEffect(() => {
    Axios.get("http://localhost:8080/cartItem", { withCredentials: true })
      .then((res) => {
        setCart(res.data);
        console.log("cart verisi " + res.data[0].product_id);
        Axios.get(
          "http://localhost:8080/singleproduct/" + res.data[0].product_id,
          {
            withCredentials: true,
          }
        )
          .then((response) => {
            setProduct(response.data);
            console.log("product response ", response.data[0].information);
            setimagePath(
              process.env.PUBLIC_URL +
                `/Images/ProductImages/${response.data[0].image}`
            );
          })
          .catch((error) => {
            console.log("Bir hata oluştu: ", error);
          });
      })
      .catch((error) => {
        console.log("Bir hata oluştu: ", error);
      });
  }, []);

  console.log("product bilgi " + product);

  const handleRemove = (id) => {
    Axios.post("http://localhost:8080/deleteCartItem", { cartid: id }).then(
      (response) => {
        console.log(response);
      }
    );

    window.location.reload();
  };

  const confirmOrder = (productId, cartId) => {
    Axios.post(
      "http://localhost:8080/addorder",
      { productid: productId, ordercode: code },
      { withCredentials: true }
    ).then((res) => {
      console.log(res);
    });

    Axios.post("http://localhost:8080/deleteCartItem", { cartid: cartId }).then(
      (response) => {
        console.log(response);
      }
    );

    window.location.reload();
  };

  return (
    <div className="main">
      <Navbar />
      <MDBContainer className="cardbody">
        {product.length > 0 ? (
          <div>
            <div className="cart_box" key={cart.id}>
              <div className="cart_img">
                <img src={imagePath} alt={cart.img} />
                <p>{product[0].product_name}</p>
              </div>
              <div className="cartIngredient">{product[0].information}</div>
              <div>
                <button onClick={() => handleRemove(cart[0].id)}>Remove</button>
              </div>
            </div>
            <br></br>
            <label className="readIngredients">
              <input
                onClick={() => setreadIngredient(!readIngredient)}
                type="checkbox"
              />
              {" I accept that I have read the ingredients."}
            </label>
            <button
              disabled={!readIngredient || cart.length === 0}
              onClick={() => confirmOrder(product[0].id, cart[0].id)}
              className="total"
            >
              Confirm Order
            </button>
          </div>
        ) : (
          <h1 className="empty">Your cart is empty!</h1>
        )}
      </MDBContainer>
    </div>
  );
};

export default Cart;
