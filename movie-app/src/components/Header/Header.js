import React, { useEffect } from "react";
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
  useEffect(() => {}, [user]);

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

  const handleProtectedNavigation = (path) => {
    if (!isLoggedIn) {
      alert("로그인 후 이용해주세요.");
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  const home = () => {
    navigate("/");
  };

  return (
    <div className={styles.headerContainer}>
      <div className={styles.headerTitleBox}>
        <h1 className={styles.headerTitle} onClick={home}>
          MOVIE-APP
        </h1>
      </div>
      <div className={styles.menuContainer}>
        <div className={styles.menuBtn}>
          <Button onClick={() => handleProtectedNavigation("/myPage")}>
            마이페이지
          </Button>
          <Button onClick={() => handleProtectedNavigation("/reservation")}>
            예매하기
          </Button>
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
