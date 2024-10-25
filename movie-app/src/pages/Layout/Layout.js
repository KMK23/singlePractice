import React from "react";
import Header from "../../components/Header/Header";
import Nav from "../../components/Nav/Nav";
import { Outlet } from "react-router-dom";
import Footer from "../../components/Footer/Footer";

function Layout(props) {
  return (
    <>
      <Header /> {/* 상단: 로그인, 회원가입, 마이페이지, 고객센터 */}
      <Nav /> {/* 하단: 영화, 예매, 극장, 혜택 */}
      <Outlet /> {/* 페이지 내용이 여기에 렌더링 */}
      <Footer />
    </>
  );
}

export default Layout;
