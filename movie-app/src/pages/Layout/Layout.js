import React from "react";
import Header from "../../components/Header/Header";
import Nav from "../../components/Nav/Nav";
import { Outlet } from "react-router-dom";
import Footer from "../../components/Footer/Footer";

function Layout(props) {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

export default Layout;
