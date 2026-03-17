
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <h1>d.reads 📚</h1>

      <ul>
        <li>
          <Link to="/">Search</Link>
        </li>
        <li>
          <Link to="/profile">Profile</Link>
        </li>
        <li>
          <Link to="/liked">Liked</Link>
        </li>
        <li>
          <Link to="/want-to-read">Want to Read</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
       