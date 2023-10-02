import { useEffect, useState } from "react";
import Axios from "axios";
import ProductCard from "../ProductCard/ProductCard";

function RightBody() {
  const [products, setProduct] = useState([]);

  useEffect(() => {
    Axios.get("http://localhost:8080/myproducts", {
      withCredentials: true,
    }).then((response) => {
      setProduct(response.data);
    });
  }, []);

  return (
    <div className="container flex-column">
      {products.map((product) => {
        return <ProductCard product={product} />;
      })}
    </div>
  );
}

export default RightBody;
