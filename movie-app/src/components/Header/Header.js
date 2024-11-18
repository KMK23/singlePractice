import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser, selectUser } from "../../store/userSlice/userSlice";
import Button from "./../Button/Button";
import styles from "./Header.module.scss";

function Header() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser); // Redux 상태에서 user 정보 가져오기
  const isLoggedIn = useSelector((state) => state.user.isAuthenticated);
  const navigate = useNavigate();
  useEffect(() => {
    console.log("Redux 상태 변경 감지: isLoggedIn =", isLoggedIn);
  }, [isLoggedIn]);

  const handleLogout = () => {
    console.log("로그아웃 버튼 클릭"); // 디버그 로그
    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        console.log("로그아웃 성공"); // 디버그 로그
        alert("로그아웃되었습니다.");
        navigate("/");
      })
      .catch((error) => {
        console.error("로그아웃 실패:", error); // 디버그 로그
      });
  };

  return (
    <div className={styles.headerContainer}>
      <div className={styles.headerTitleBox}>
        <h1 className={styles.headerTitle}>MOVIE-APP</h1>
      </div>
      <div className={styles.menuContainer}>
        <div className={styles.menuBtn}>
          <Link to={"myPage"}>
            <Button>마이페이지</Button>
          </Link>
          <Link to={"reservation"}>
            <Button>예매하기</Button>
          </Link>
          <Link to={"service"}>
            <Button>고객센터</Button>
          </Link>

          {/* 로그인 상태에 따라 버튼 표시 */}
          {isLoggedIn ? (
            <Button onClick={handleLogout}>로그아웃</Button>
          ) : (
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
