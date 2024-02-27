import React from "react";
import { Layout } from "antd";

const { Footer } = Layout;

const MainFooter = () => {
  return (
    <Footer
      style={{
        textAlign: "center",
      }}
    >
      ©{new Date().getFullYear()} Created by Dmytro Hrunytskyi
    </Footer>
  );
};

export default MainFooter;
