import Navbar from "../Navbar/Navbar.js";
import "bootstrap/dist/css/bootstrap.css";
import ProductLeftSide from "./ProductLeftSide/ProductLeftSide.js";
import RightBody from "./RightBody/RightBody.js";
import "./AddProduct.css";

function App() {
  return (
    <div>
      <Navbar />
      <div className="container-fluid  d-flex allBody">
        <div className="container d-flex bodyitems">
          <div className="container leftbody">
            <ProductLeftSide />
          </div>
          <div className="container rightBody overflow-y-scroll">
            <RightBody />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
