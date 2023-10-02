import "./ProductCard.css";
import Axios from "axios";

function ProductCard({ product }) {
  const imagePath =
    process.env.PUBLIC_URL + `/Images/ProductImages/${product.image}`;
  function deleteItem() {
    Axios.post("http://localhost:8080/deleteproduct", {
      productid: product.id,
    }).then((response) => {
      console.log(response);
    });

    window.location.reload();
  }

  return (
    <div className="card my-2" style={{ width: "10rem" }}>
      <img
        src={imagePath}
        className="card-img-top"
        alt="Fissure in Sandstone"
      />
      <div className="card-body">
        <h5
          className="card-title"
          style={{ fontSize: "14px", fontWeight: "bold" }}
        >
          {product.product_name}
        </h5>
        <p className="card-text" style={{ fontSize: "12px" }}>
          {product.information}
        </p>
        <button
          className="btn btn-primary"
          style={{ backgroundColor: "#d57149" }}
          onClick={deleteItem}
        >
          Remove
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
