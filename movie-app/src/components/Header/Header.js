import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "./../Button/Button";
import styles from "./Header.module.scss";

function Header(props) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // localStorage에서 로그인 정보 확인
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      console.log(user);
    }
  }, []);
  return (
    <div className={styles.headerContainer}>
      <div className={styles.headerTitleBox}>
        <h1 className={styles.headerTitle}>MOVIE-APP</h1>
      </div>
      <div className={styles.menuContainer}>
        <div className={styles.menuBtn}>
          {user ? (
            // 로그인되어 있으면 사용자 정보 표시
            <>
              <span>{user.email}님, 환영합니다!</span>
              <Link to={"myPage"}>
                <Button>마이페이지</Button>
              </Link>
              <Link to={"reservation"}>
                <Button>예매하기</Button>
              </Link>
              <Link to={"service"}>
                <Button>고객센터</Button>
              </Link>
            </>
          ) : (
            // 로그인 안 되어 있으면 로그인/회원가입 버튼
            <Link to={"login"}>
              <Button>로그인/회원가입</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
