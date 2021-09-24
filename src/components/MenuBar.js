import React, { useState, useContext, useEffect } from "react";
import { Menu } from "semantic-ui-react";
import { Link, useHistory } from "react-router-dom";
import { AuthContext } from "../context/auth";
const MenuBar = () => {
  const history = useHistory();
  const { user, logout } = useContext(AuthContext);
  const pathname = window.location.pathname;
  const path = pathname === "/" ? "home" : pathname.substr(1);
  const handleItemClick = ({ name }) => setactiveItem(name);
  const [activeItem, setactiveItem] = useState(path);
  useEffect(() => {
    setactiveItem(path);
  }, [path]);
  const menubar = !user ? (
    <Menu pointing secondary size="massive" color="blue">
      <Menu.Item
        name="home"
        active={activeItem === "home"}
        onClick={handleItemClick}
        
        as={Link}
        to="/"
      />

      <Menu.Menu position="right">
        <Menu.Item
          name="login"
          active={activeItem === "login"}
          onClick={handleItemClick}
          as={Link}
          to="/login"
        />
      </Menu.Menu>

      <Menu.Menu position="right">
        <Menu.Item
          name="register"
          active={activeItem === "register"}
          onClick={handleItemClick}
          as={Link}
          to="/register"
        />
      </Menu.Menu>
    </Menu>
  ) : (
    <div>
      <Menu pointing secondary size="massive" color="blue">
        <Menu.Item
          name={user.username}
          active={activeItem === "home"}
          onClick={handleItemClick}
          as={Link}
          to="/"
        />
        <Menu.Menu position="right">
          <Menu.Item
            name="logout"
            active={activeItem === "logout"}
            onClick={() => {
              history.push("/login");
              logout();
            }}
          />
        </Menu.Menu>
      </Menu>
    </div>
  );
  return <div>{menubar}</div>;
};

export default MenuBar;
