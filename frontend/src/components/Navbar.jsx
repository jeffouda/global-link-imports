import { NavLink } from "react-router-dom";
import { NAV_LINKS } from "../routes/links";

const Navbar = () => {
  const userRole = "user";

  return (
    <nav>
      <ul>
        {NAV_LINKS.filter((link) => {
          if (link.public) return true;
          if (!link.role) return true;
          return link.role === userRole;
        }).map((link) => (
          <li key={link.path}>
            <NavLink to={link.path}>{link.label}</NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
