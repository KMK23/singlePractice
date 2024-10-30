import React from "react";
import { Link } from "react-router-dom";
import Button from "./../Button/Button";
import styles from "./Header.module.scss";
function Header(props) {
  return (
    <div className={styles.headerContainer}>
      <div className={styles.headerTitleBox}>
        <h1 className={styles.headerTitle}>MOVIE-APP</h1>
      </div>
      <div className={styles.menuContainer}>
        <div className={styles.menuBtn}>
          <Link to={"login"}>
            <Button>로그인</Button>
          </Link>
          <Link to={"signUp"}>
            <Button>회원가입</Button>
          </Link>
          <Link to={"reservation"}>
            <Button>예매하기</Button>
          </Link>

          <Link to={"myPage"}>
            <Button>마이페이지</Button>
          </Link>
          <Link to={"service"}>
            <Button>고객센터</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Header;
