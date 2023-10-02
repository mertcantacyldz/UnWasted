import { useState, useEffect } from "react";
import Axios from "axios";
import Navbar from "../../Navbar/Navbar.js";
import "bootstrap/dist/css/bootstrap.css";
import "./ProductLeftSide.css";
import {
  MDBContainer,
  MDBInput,
  MDBBtn,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBFile,
} from "mdb-react-ui-kit";
import ProductCard from "../ProductCard/ProductCard";

function App() {
  const [productName, setProductName] = useState("");
  const [stock, setStock] = useState("");
  const [describe, setDescribe] = useState("");
  const [time, setTime] = useState("");
  const [userid, setuserid] = useState("");
  const [products, setProduct] = useState([]);
  const [file, setFile] = useState();

  useEffect(() => {
    Axios.get("http://localhost:8080/products").then((response) => {
      setProduct(response.data);
    });
  }, []);

  useEffect(() => {
    async function getcookie() {
      let response = await Axios.get("http://localhost:8080/getcookie", {
        withCredentials: true,
      });
      setuserid(response.data);
    }
    getcookie();
  }, []);

  function addItem() {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("productname", productName);
    formData.append("stock", stock);
    formData.append("expirationdate", time);
    formData.append("information", describe);
    formData.append("userid", userid);

    Axios.post("http://localhost:8080/addproduct", formData).then(
      (response) => {
        console.log(response);
        window.location.reload();
      }
    );
  }

  useEffect(() => {
    console.log("Dosya ismi: " + file);
  }, [file]);

  return (
    <div>
      <div className="Addproduct">
        <MDBContainer className="container-lg d-flex formHeader">
          <h1 className="formHeaderText">Add Product</h1>
        </MDBContainer>
        <form className="formcss">
          <MDBContainer className="mb-4">
            <MDBInput
              type="text"
              id="form4Example1"
              label="Product Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              style={{ color: "#4F261A" }}
            />
          </MDBContainer>

          <MDBContainer className="mb-4">
            <MDBInput
              type="number"
              id="form4Example2"
              label="Stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              style={{ color: "#4F261A" }}
            />
          </MDBContainer>

          <MDBContainer className="mb-4">
            <MDBInput
              type="date"
              id="form4Example3"
              label="Time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              style={{ color: "#4F261A" }}
            />
          </MDBContainer>

          <MDBContainer className="mb-4">
            <MDBInput
              type="textarea"
              id="form4Example4"
              label="Please describe the product"
              rows="4"
              value={describe}
              onChange={(e) => setDescribe(e.target.value)}
              style={{ color: "#4F261A" }}
            />
          </MDBContainer>

          <MDBContainer className="mb-4">
            <MDBFile
              type="file"
              label="Please add product's image"
              id="customfile"
              filename={file}
              onChange={(e) => setFile(e.target.files[0])}
              accept="image/*"
            />
          </MDBContainer>

          <MDBBtn
            color="primary"
            className="btn-block mb-4"
            onClick={addItem}
            style={{
              background: "#d57149",
              borderColor: "transparent",
              boxShadow: "none",
            }}
          >
            Add Food
          </MDBBtn>
        </form>
      </div>
    </div>
  );
}

export default App;
