import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";

function Navbar() {
  return (
    <nav id="navbar">
      <span>
        <img src={logo} alt="" className="logo" />
      </span>
      <ul>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/about">About</NavLink>
        </li>
        <li>
          <NavLink to="/newsletter">Newsletter</NavLink>
        </li>
      </ul>
    </nav>
  );
}
export default Navbar;
