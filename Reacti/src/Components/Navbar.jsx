import logo from "../assets/pngwing.com (4).png";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();

  return (
    <div>
      <nav className="naav">

        <img className="net" src={logo} alt="Netflix" />


        <div className="right">
          <div className="opt">
            <span><i className="fa-solid fa-earth-asia"></i></span>
            <select>
              <option>English</option>
              <option>Tamil</option>
            </select>
          </div>
          <button
            className="btt"
            onClick={() => navigate("/signin")}
          >
            Sign In
          </button>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;