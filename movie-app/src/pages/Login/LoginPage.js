import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.scss";
import {
  googleLogin,
  loginUser,
  registerUser,
  selectUser,
} from "../../store/userSlice/userSlice";

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (user.isAuthenticated) {
      navigate("/"); // 로그인 성공 시 메인 화면으로 이동
    }
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault(); // 기본 제출 동작 방지
    if (!email || !password) {
      setErrorMessage("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    if (isRegistering) {
      dispatch(registerUser({ email, password }));
    } else {
      dispatch(loginUser({ email, password }));
    }

    setEmail("");
    setPassword("");
  };

  const handleGoogleLogin = () => {
    dispatch(googleLogin());
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setEmail("");
    setPassword("");
    setErrorMessage("");
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>
          {isRegistering ? "회원가입 페이지" : "로그인 페이지"}
        </h2>
        {/* form 태그 추가 */}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />
          <button type="submit" className={styles.button}>
            {isRegistering ? "회원가입" : "로그인"}
          </button>
        </form>

        {user.status === "loading" && (
          <p className={styles.message}>처리 중...</p>
        )}
        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
        {user.status === "failed" && (
          <p className={styles.errorMessage}>실패: {user.error}</p>
        )}

        <button onClick={toggleMode} className={styles.toggleButton}>
          {isRegistering ? "로그인 하기" : "회원가입 하기"}
        </button>

        <button onClick={handleGoogleLogin} className={styles.socialButton}>
          Google로 로그인
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
