import React from "react";
import { Layout } from "antd";

const { Footer } = Layout;

const MainFooter = () => {
  return (
    <Footer
      style={{
        textAlign: "center",
        backgroundColor: "#0A172A",
        color: "white",
      }}
    >
      ©{new Date().getFullYear()} Created by Dmytro Hrunytskyi
    </Footer>
  );
};

export default MainFooter;
