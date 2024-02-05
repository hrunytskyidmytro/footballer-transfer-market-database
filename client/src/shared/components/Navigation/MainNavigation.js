import React, { useContext } from "react";
import { Link } from "react-router-dom";

// import MainHeader from "./MainHeader";
// import NavLinks from "./NavLinks";
// import SideDrawer from "./SideDrawer";
// import Backdrop from "../UIElements/Backdrop";
import { AuthContext } from "../../context/auth-context";
import "./MainNavigation.css";
import { Layout, Menu } from "antd";

const { Header } = Layout;

const MainNavigation = (props) => {
  const auth = useContext(AuthContext);
  // const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  // const openDrawerHandler = () => {
  //   setDrawerIsOpen(true);
  // };

  // const closeDrawerHandler = () => {
  //   setDrawerIsOpen(false);
  // };

  return (
    //   <React.Fragment>
    //     {drawerIsOpen && <Backdrop onClick={closeDrawerHandler} />}
    //     <SideDrawer show={drawerIsOpen} onClick={openDrawerHandler}>
    //       <nav className="main-navigation__drawer-nav">
    //         <NavLinks />
    //       </nav>
    //     </SideDrawer>
    //     <MainHeader>
    //       <button className="main-navigation__menu-btn" onClick={openDrawerHandler}>
    //         <span />
    //         <span />
    //         <span />
    //       </button>
    //       <h1 className="main-navigation__title">
    //         <Link to="/">Transfer market</Link>
    //       </h1>
    //       <nav className="main-navigation__header-nav">
    //         <NavLinks />
    //       </nav>
    //     </MainHeader>
    //   </React.Fragment>
    // );
    <Layout>
      <Header style={{ display: "flex", alignItems: "center" }}>
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["1"]}
          style={{ flex: 1, minWidth: 0 }}
          selectedKeys={[]}
        >
          <Menu.Item key="1" className="main-navigation__home-page">
            <Link to="/">Transfer-market</Link>
          </Menu.Item>
          <Menu.Item key="1">
            <Link to="/footballers">Footballers</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/transfers">Transfers</Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to="/clubs">Clubs</Link>
          </Menu.Item>
          <Menu.Item key="4">
            <Link to="/auth">Login</Link>
          </Menu.Item>
          {auth.token && (
            <Menu.Item key="5">
              <button onClick={auth.logout}>Log out</button>
            </Menu.Item>
          )}
        </Menu>
      </Header>
    </Layout>
  );
};

export default MainNavigation;
